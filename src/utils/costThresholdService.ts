/**
 * Cost Threshold Service
 * Determines if a recommendation requires budget approval based on cost thresholds
 */

export interface CostThreshold {
  amount: number;
  requiresApproval: boolean;
  approverRole: 'project-manager' | 'admin';
}

export class CostThresholdService {
  // Cost thresholds (in USD per month)
  private static readonly THRESHOLDS = {
    LOW: 5000,      // < $5,000/month - No budget approval needed
    MEDIUM: 10000,  // $5,000 - $10,000/month - PM approval needed
    HIGH: 25000,    // $10,000 - $25,000/month - PM approval needed
    CRITICAL: 50000 // > $25,000/month - PM + Admin approval needed
  };

  /**
   * Parse cost string to number
   * Handles formats like "$12,450/month", "$12450", "12450"
   */
  static parseCost(costString: string): number {
    // Remove currency symbols, commas, and text
    const cleanCost = costString
      .replace(/[$,]/g, '')
      .replace(/\/month/gi, '')
      .replace(/\/mo/gi, '')
      .trim();
    
    const cost = parseFloat(cleanCost);
    return isNaN(cost) ? 0 : cost;
  }

  /**
   * Format number as cost string
   */
  static formatCost(amount: number): string {
    return `$${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    })}/month`;
  }

  /**
   * Check if cost requires budget approval
   */
  static requiresBudgetApproval(costString: string): boolean {
    const cost = this.parseCost(costString);
    return cost >= this.THRESHOLDS.MEDIUM;
  }

  /**
   * Get cost threshold level
   */
  static getCostLevel(costString: string): 'low' | 'medium' | 'high' | 'critical' {
    const cost = this.parseCost(costString);
    
    if (cost < this.THRESHOLDS.LOW) return 'low';
    if (cost < this.THRESHOLDS.MEDIUM) return 'medium';
    if (cost < this.THRESHOLDS.HIGH) return 'high';
    return 'critical';
  }

  /**
   * Get required approvers based on cost
   */
  static getRequiredApprovers(costString: string): string[] {
    const cost = this.parseCost(costString);
    const approvers: string[] = [];
    
    // Always need technical approval
    approvers.push('solution-architect');
    
    // Budget approval for costs >= $5,000/month - Admin (Specialisation Head) approves
    if (cost >= this.THRESHOLDS.MEDIUM) {
      approvers.push('admin'); // Admin is the Specialisation Head
    }
    
    return approvers;
  }

  /**
   * Calculate percentage change between two costs
   */
  static calculateCostChange(originalCost: string, newCost: string): number {
    const original = this.parseCost(originalCost);
    const updated = this.parseCost(newCost);
    
    if (original === 0) return 0;
    
    const change = ((updated - original) / original) * 100;
    return Math.round(change * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Check if cost change requires re-approval
   * Returns true if cost increased by more than 10%
   */
  static requiresReapproval(originalCost: string, newCost: string): boolean {
    const changePercent = this.calculateCostChange(originalCost, newCost);
    return changePercent > 10;
  }

  /**
   * Get cost threshold message for UI
   */
  static getThresholdMessage(costString: string): string {
    const level = this.getCostLevel(costString);
    
    switch (level) {
      case 'low':
        return `Cost is below $${this.THRESHOLDS.LOW.toLocaleString()}/month. No budget approval required.`;
      case 'medium':
        return `Cost exceeds $${this.THRESHOLDS.LOW.toLocaleString()}/month. Specialisation Head (Admin) approval required.`;
      case 'high':
        return `Cost exceeds $${this.THRESHOLDS.MEDIUM.toLocaleString()}/month. Specialisation Head (Admin) approval required.`;
      case 'critical':
        return `⚠️ Critical cost exceeds $${this.THRESHOLDS.HIGH.toLocaleString()}/month. Specialisation Head (Admin) approval required.`;
      default:
        return '';
    }
  }

  /**
   * Get cost badge color based on level
   */
  static getCostBadgeColor(costString: string): string {
    const level = this.getCostLevel(costString);
    
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  /**
   * Get all thresholds (for settings/configuration)
   */
  static getThresholds() {
    return { ...this.THRESHOLDS };
  }
}
