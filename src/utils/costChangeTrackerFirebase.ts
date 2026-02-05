/**
 * Firebase Integration for CostChangeTracker
 * 
 * This file provides Firebase storage integration for the CostChangeTracker service.
 * In production, replace the in-memory storage with these Firebase methods.
 * 
 * Firebase Structure:
 * /cost-tracking/{recommendationId}/
 *   - baseline: CostEstimate
 *   - history: CostHistoryEntry[]
 */

import type { CostEstimate, CostHistoryEntry } from '../types/cost';

/**
 * Firebase integration interface for cost tracking
 * 
 * To integrate with Firebase:
 * 1. Initialize Firebase in your app (see firebase.ts)
 * 2. Import Firestore: import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
 * 3. Replace the in-memory Map storage in CostChangeTrackerService with these methods
 */
export interface FirebaseCostStorage {
  /**
   * Store baseline cost in Firebase
   * Path: /cost-tracking/{recommendationId}/baseline
   */
  setBaseline(recommendationId: string, costEstimate: CostEstimate): Promise<void>;

  /**
   * Retrieve baseline cost from Firebase
   * Path: /cost-tracking/{recommendationId}/baseline
   */
  getBaseline(recommendationId: string): Promise<CostEstimate | null>;

  /**
   * Add entry to cost history in Firebase
   * Path: /cost-tracking/{recommendationId}/history
   */
  addHistoryEntry(recommendationId: string, entry: CostHistoryEntry): Promise<void>;

  /**
   * Retrieve cost history from Firebase
   * Path: /cost-tracking/{recommendationId}/history
   */
  getHistory(recommendationId: string): Promise<CostHistoryEntry[]>;

  /**
   * Update baseline and add to history atomically
   * Uses Firebase transaction to ensure consistency
   */
  updateBaselineWithHistory(
    recommendationId: string,
    newBaseline: CostEstimate,
    historyEntry: CostHistoryEntry
  ): Promise<void>;
}

/**
 * Example Firebase implementation (pseudo-code)
 * 
 * Uncomment and adapt when Firebase is configured:
 * 
 * import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, runTransaction } from 'firebase/firestore';
 * 
 * export class FirebaseCostStorageImpl implements FirebaseCostStorage {
 *   private db = getFirestore();
 *   private collectionName = 'cost-tracking';
 * 
 *   async setBaseline(recommendationId: string, costEstimate: CostEstimate): Promise<void> {
 *     const docRef = doc(this.db, this.collectionName, recommendationId);
 *     await setDoc(docRef, {
 *       baseline: costEstimate,
 *       history: [],
 *       updatedAt: new Date()
 *     }, { merge: true });
 *   }
 * 
 *   async getBaseline(recommendationId: string): Promise<CostEstimate | null> {
 *     const docRef = doc(this.db, this.collectionName, recommendationId);
 *     const docSnap = await getDoc(docRef);
 *     
 *     if (!docSnap.exists()) {
 *       return null;
 *     }
 *     
 *     return docSnap.data().baseline as CostEstimate;
 *   }
 * 
 *   async addHistoryEntry(recommendationId: string, entry: CostHistoryEntry): Promise<void> {
 *     const docRef = doc(this.db, this.collectionName, recommendationId);
 *     await updateDoc(docRef, {
 *       history: arrayUnion(entry),
 *       updatedAt: new Date()
 *     });
 *   }
 * 
 *   async getHistory(recommendationId: string): Promise<CostHistoryEntry[]> {
 *     const docRef = doc(this.db, this.collectionName, recommendationId);
 *     const docSnap = await getDoc(docRef);
 *     
 *     if (!docSnap.exists()) {
 *       return [];
 *     }
 *     
 *     const history = docSnap.data().history || [];
 *     
 *     // Convert Firestore Timestamps to Date objects
 *     return history.map((entry: any) => ({
 *       ...entry,
 *       timestamp: entry.timestamp.toDate(),
 *       approvalTimestamp: entry.approvalTimestamp?.toDate()
 *     }));
 *   }
 * 
 *   async updateBaselineWithHistory(
 *     recommendationId: string,
 *     newBaseline: CostEstimate,
 *     historyEntry: CostHistoryEntry
 *   ): Promise<void> {
 *     const docRef = doc(this.db, this.collectionName, recommendationId);
 *     
 *     await runTransaction(this.db, async (transaction) => {
 *       const docSnap = await transaction.get(docRef);
 *       
 *       if (!docSnap.exists()) {
 *         throw new Error('Document does not exist');
 *       }
 *       
 *       const currentHistory = docSnap.data().history || [];
 *       
 *       transaction.update(docRef, {
 *         baseline: newBaseline,
 *         history: [...currentHistory, historyEntry],
 *         updatedAt: new Date()
 *       });
 *     });
 *   }
 * }
 * 
 * // Usage in CostChangeTrackerService:
 * // Replace Map storage with Firebase calls:
 * // 
 * // Instead of: this.baselines.set(recommendationId, costEstimate);
 * // Use: await this.firebaseStorage.setBaseline(recommendationId, costEstimate);
 * //
 * // Instead of: this.baselines.get(recommendationId);
 * // Use: await this.firebaseStorage.getBaseline(recommendationId);
 */

/**
 * Firebase Security Rules for cost tracking
 * 
 * Add these rules to your firestore.rules file:
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Cost tracking collection
 *     match /cost-tracking/{recommendationId} {
 *       // Allow read for authenticated users who have access to the recommendation
 *       allow read: if request.auth != null;
 *       
 *       // Allow write only for Solution Architects and Admins
 *       allow create, update: if request.auth != null && 
 *         (request.auth.token.role == 'Solution_Architect' || 
 *          request.auth.token.role == 'Admin');
 *       
 *       // Prevent deletion of cost tracking data (audit trail)
 *       allow delete: if false;
 *     }
 *   }
 * }
 */

/**
 * Firebase Indexes
 * 
 * Add these indexes to firestore.indexes.json for efficient queries:
 * 
 * {
 *   "indexes": [
 *     {
 *       "collectionGroup": "cost-tracking",
 *       "queryScope": "COLLECTION",
 *       "fields": [
 *         { "fieldPath": "updatedAt", "order": "DESCENDING" }
 *       ]
 *     }
 *   ]
 * }
 */

/**
 * Migration guide from in-memory to Firebase storage:
 * 
 * 1. Set up Firebase in your project:
 *    - Create firebase.ts with Firebase configuration
 *    - Initialize Firestore
 * 
 * 2. Implement FirebaseCostStorageImpl class (see example above)
 * 
 * 3. Update CostChangeTrackerService:
 *    - Add constructor parameter: constructor(private storage: FirebaseCostStorage)
 *    - Replace all Map operations with storage method calls
 *    - Make all methods async
 *    - Add proper error handling for network failures
 * 
 * 4. Update all callers to handle async operations:
 *    - await tracker.setBaseline(...)
 *    - await tracker.calculateChange(...)
 *    - await tracker.getHistory(...)
 * 
 * 5. Add Firebase security rules (see above)
 * 
 * 6. Test thoroughly with Firebase emulator before deploying
 */

export const FIREBASE_INTEGRATION_NOTES = {
  collection: 'cost-tracking',
  documentStructure: {
    baseline: 'CostEstimate object',
    history: 'Array of CostHistoryEntry objects',
    updatedAt: 'Timestamp of last update',
  },
  securityRules: 'See comments above for Firestore security rules',
  indexes: 'See comments above for required indexes',
  migration: 'See migration guide above for step-by-step instructions',
};
