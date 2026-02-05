/**
 * Cost tracking types for Phase 2: Advanced Approval Flows
 * Supports cost change tracking, baseline storage, and approval triggering
 */

export interface CostEstimate {
  infrastructure: number;
  compute: number;
  storage: number;
  networking: number;
  total: number;
}

export interface CostChange {
  recommendationId: string;
  baseline: CostEstimate;
  current: CostEstimate;
  percentageChange: number;
  changedBy: string;
  timestamp: Date;
  requiresApproval: boolean;
}

export interface CostHistoryEntry {
  timestamp: Date;
  user: string;
  previousCost: CostEstimate;
  newCost: CostEstimate;
  percentageChange: number;
  approved: boolean;
  approvedBy?: string;
  approvalTimestamp?: Date;
}

export interface LockStatus {
  isLocked: boolean;
  lockedAt?: Date;
  lockedBy?: string;
  unlockedAt?: Date;
  unlockedBy?: string;
  unlockReason?: string;
}
