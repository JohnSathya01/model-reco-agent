/**
 * CostChangeTracker Service
 * 
 * Monitors and tracks cost estimate changes against baseline values.
 * Implements Phase 2 requirements for cost calculator tracking and approval.
 * 
 * Features:
 * - Baseline cost storage and retrieval
 * - Percentage change calculation
 * - Approval threshold checking (10%)
 * - Cost history tracking
 * - Baseline updates after approval
 */

import type { CostEstimate, CostChange, CostHistoryEntry } from '../types/cost';

// Threshold for requiring approval (10%)
const APPROVAL_THRESHOLD = 10;

/**
 * In-memory storage for cost baselines and history
 * In production, this would be replaced with Firebase storage
 */
class CostChangeTrackerService {
  private baselines: Map<string, CostEstimate> = new Map();
  private history: Map<string, CostHistoryEntry[]> = new Map();

  /**
   * Store baseline cost when recommendation is created
   * Validates: Requirements 1.1
   * 
   * @param recommendationId - Unique identifier for the recommendation
   * @param costEstimate - Initial cost estimate to store as baseline
   */
  setBaseline(recommendationId: string, costEstimate: CostEstimate): void {
    if (!recommendationId) {
      throw new Error('Recommendation ID is required');
    }

    if (!this.isValidCostEstimate(costEstimate)) {
      throw new Error('Invalid cost estimate: all values must be non-negative numbers');
    }

    // Store the baseline
    this.baselines.set(recommendationId, { ...costEstimate });

    // Initialize history if not exists
    if (!this.history.has(recommendationId)) {
      this.history.set(recommendationId, []);
    }
  }

  /**
   * Calculate percentage change from baseline
   * Validates: Requirements 1.2
   * 
   * @param recommendationId - Unique identifier for the recommendation
   * @param newCostEstimate - New cost estimate to compare against baseline
   * @param changedBy - User ID who made the change
   * @returns CostChange object with percentage change and approval requirement
   */
  calculateChange(
    recommendationId: string,
    newCostEstimate: CostEstimate,
    changedBy: string
  ): CostChange {
    const baseline = this.baselines.get(recommendationId);

    if (!baseline) {
      throw new Error(`No baseline found for recommendation ${recommendationId}`);
    }

    if (!this.isValidCostEstimate(newCostEstimate)) {
      throw new Error('Invalid cost estimate: all values must be non-negative numbers');
    }

    // Calculate percentage change based on total cost
    const percentageChange = this.calculatePercentageChange(
      baseline.total,
      newCostEstimate.total
    );

    // Check if approval is required
    const requiresApproval = this.requiresApproval({ percentageChange } as CostChange);

    const costChange: CostChange = {
      recommendationId,
      baseline: { ...baseline },
      current: { ...newCostEstimate },
      percentageChange,
      changedBy,
      timestamp: new Date(),
      requiresApproval,
    };

    return costChange;
  }

  /**
   * Check if change exceeds threshold requiring approval
   * Validates: Requirements 1.3
   * 
   * @param change - CostChange object to check
   * @returns true if absolute percentage change exceeds 10%
   */
  requiresApproval(change: CostChange): boolean {
    return Math.abs(change.percentageChange) > APPROVAL_THRESHOLD;
  }

  /**
   * Get cost history for a recommendation
   * Validates: Requirements 1.5
   * 
   * @param recommendationId - Unique identifier for the recommendation
   * @returns Array of cost history entries in chronological order
   */
  getHistory(recommendationId: string): CostHistoryEntry[] {
    const history = this.history.get(recommendationId);
    return history ? [...history] : [];
  }

  /**
   * Update baseline after approval
   * Validates: Requirements 2.3
   * 
   * @param recommendationId - Unique identifier for the recommendation
   * @param approvedCost - Approved cost estimate to set as new baseline
   * @param approvedBy - User ID who approved the change
   */
  updateBaseline(
    recommendationId: string,
    approvedCost: CostEstimate,
    approvedBy: string
  ): void {
    const currentBaseline = this.baselines.get(recommendationId);

    if (!currentBaseline) {
      throw new Error(`No baseline found for recommendation ${recommendationId}`);
    }

    if (!this.isValidCostEstimate(approvedCost)) {
      throw new Error('Invalid cost estimate: all values must be non-negative numbers');
    }

    // Calculate percentage change for history
    const percentageChange = this.calculatePercentageChange(
      currentBaseline.total,
      approvedCost.total
    );

    // Add to history
    const historyEntry: CostHistoryEntry = {
      timestamp: new Date(),
      user: approvedBy,
      previousCost: { ...currentBaseline },
      newCost: { ...approvedCost },
      percentageChange,
      approved: true,
      approvedBy,
      approvalTimestamp: new Date(),
    };

    const history = this.history.get(recommendationId) || [];
    history.push(historyEntry);
    this.history.set(recommendationId, history);

    // Update baseline
    this.baselines.set(recommendationId, { ...approvedCost });
  }

  /**
   * Add a cost change to history (without approval)
   * Used for tracking all cost modifications
   * 
   * @param recommendationId - Unique identifier for the recommendation
   * @param previousCost - Previous cost estimate
   * @param newCost - New cost estimate
   * @param user - User ID who made the change
   */
  addToHistory(
    recommendationId: string,
    previousCost: CostEstimate,
    newCost: CostEstimate,
    user: string
  ): void {
    const percentageChange = this.calculatePercentageChange(
      previousCost.total,
      newCost.total
    );

    const historyEntry: CostHistoryEntry = {
      timestamp: new Date(),
      user,
      previousCost: { ...previousCost },
      newCost: { ...newCost },
      percentageChange,
      approved: false,
    };

    const history = this.history.get(recommendationId) || [];
    history.push(historyEntry);
    this.history.set(recommendationId, history);
  }

  /**
   * Get current baseline for a recommendation
   * 
   * @param recommendationId - Unique identifier for the recommendation
   * @returns Current baseline cost estimate or undefined if not set
   */
  getBaseline(recommendationId: string): CostEstimate | undefined {
    const baseline = this.baselines.get(recommendationId);
    return baseline ? { ...baseline } : undefined;
  }

  /**
   * Clear all data (for testing purposes)
   */
  clear(): void {
    this.baselines.clear();
    this.history.clear();
  }

  /**
   * Calculate percentage change between two values
   * Formula: ((new - old) / old) * 100
   * 
   * @param baseline - Original value
   * @param current - New value
   * @returns Percentage change (positive for increase, negative for decrease)
   */
  private calculatePercentageChange(baseline: number, current: number): number {
    if (baseline === 0) {
      // If baseline is 0, any non-zero current value is infinite change
      // Return 100% if current > 0, 0% if current === 0
      return current > 0 ? 100 : 0;
    }

    return ((current - baseline) / baseline) * 100;
  }

  /**
   * Validate that a cost estimate has all required fields with valid values
   * 
   * @param cost - Cost estimate to validate
   * @returns true if valid, false otherwise
   */
  private isValidCostEstimate(cost: CostEstimate): boolean {
    if (!cost) return false;

    const { infrastructure, compute, storage, networking, total } = cost;

    // Check all fields exist and are numbers
    if (
      typeof infrastructure !== 'number' ||
      typeof compute !== 'number' ||
      typeof storage !== 'number' ||
      typeof networking !== 'number' ||
      typeof total !== 'number'
    ) {
      return false;
    }

    // Check all values are non-negative
    if (
      infrastructure < 0 ||
      compute < 0 ||
      storage < 0 ||
      networking < 0 ||
      total < 0
    ) {
      return false;
    }

    // Check total is approximately correct (allow small floating point errors)
    const calculatedTotal = infrastructure + compute + storage + networking;
    const tolerance = 0.01; // Allow 1 cent difference
    if (Math.abs(total - calculatedTotal) > tolerance) {
      return false;
    }

    return true;
  }
}

// Export singleton instance
export const costChangeTracker = new CostChangeTrackerService();

// Export class for testing
export { CostChangeTrackerService };
