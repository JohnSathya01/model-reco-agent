/**
 * Unit tests for CostChangeTracker service
 * Tests specific examples, edge cases, and error conditions
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CostChangeTrackerService } from './costChangeTracker';
import type { CostEstimate } from '../types/cost';

describe('CostChangeTracker', () => {
  let tracker: CostChangeTrackerService;

  beforeEach(() => {
    tracker = new CostChangeTrackerService();
  });

  describe('setBaseline', () => {
    it('should store baseline cost estimate', () => {
      const recommendationId = 'rec-001';
      const costEstimate: CostEstimate = {
        infrastructure: 1000,
        compute: 2000,
        storage: 500,
        networking: 300,
        total: 3800,
      };

      tracker.setBaseline(recommendationId, costEstimate);
      const baseline = tracker.getBaseline(recommendationId);

      expect(baseline).toEqual(costEstimate);
    });

    it('should throw error for empty recommendation ID', () => {
      const costEstimate: CostEstimate = {
        infrastructure: 1000,
        compute: 2000,
        storage: 500,
        networking: 300,
        total: 3800,
      };

      expect(() => tracker.setBaseline('', costEstimate)).toThrow(
        'Recommendation ID is required'
      );
    });

    it('should throw error for invalid cost estimate with negative values', () => {
      const recommendationId = 'rec-001';
      const invalidCost: CostEstimate = {
        infrastructure: -100,
        compute: 2000,
        storage: 500,
        networking: 300,
        total: 2700,
      };

      expect(() => tracker.setBaseline(recommendationId, invalidCost)).toThrow(
        'Invalid cost estimate'
      );
    });

    it('should throw error for cost estimate with incorrect total', () => {
      const recommendationId = 'rec-001';
      const invalidCost: CostEstimate = {
        infrastructure: 1000,
        compute: 2000,
        storage: 500,
        networking: 300,
        total: 5000, // Should be 3800
      };

      expect(() => tracker.setBaseline(recommendationId, invalidCost)).toThrow(
        'Invalid cost estimate'
      );
    });

    it('should initialize empty history for new recommendation', () => {
      const recommendationId = 'rec-001';
      const costEstimate: CostEstimate = {
        infrastructure: 1000,
        compute: 2000,
        storage: 500,
        networking: 300,
        total: 3800,
      };

      tracker.setBaseline(recommendationId, costEstimate);
      const history = tracker.getHistory(recommendationId);

      expect(history).toEqual([]);
    });
  });

  describe('calculateChange', () => {
    beforeEach(() => {
      const baseline: CostEstimate = {
        infrastructure: 1000,
        compute: 2000,
        storage: 500,
        networking: 300,
        total: 3800,
      };
      tracker.setBaseline('rec-001', baseline);
    });

    it('should calculate positive percentage change correctly', () => {
      const newCost: CostEstimate = {
        infrastructure: 1100,
        compute: 2200,
        storage: 550,
        networking: 330,
        total: 4180, // 10% increase
      };

      const change = tracker.calculateChange('rec-001', newCost, 'user-123');

      expect(change.percentageChange).toBeCloseTo(10, 2);
      expect(change.requiresApproval).toBe(false); // Exactly 10% doesn't require approval
    });

    it('should calculate negative percentage change correctly', () => {
      const newCost: CostEstimate = {
        infrastructure: 900,
        compute: 1800,
        storage: 450,
        networking: 270,
        total: 3420, // 10% decrease
      };

      const change = tracker.calculateChange('rec-001', newCost, 'user-123');

      expect(change.percentageChange).toBeCloseTo(-10, 2);
      expect(change.requiresApproval).toBe(false); // Exactly 10% doesn't require approval
    });

    it('should flag changes exceeding 10% threshold', () => {
      const newCost: CostEstimate = {
        infrastructure: 1200,
        compute: 2400,
        storage: 600,
        networking: 360,
        total: 4560, // 20% increase
      };

      const change = tracker.calculateChange('rec-001', newCost, 'user-123');

      expect(change.percentageChange).toBeCloseTo(20, 2);
      expect(change.requiresApproval).toBe(true);
    });

    it('should not flag changes below 10% threshold', () => {
      const newCost: CostEstimate = {
        infrastructure: 1050,
        compute: 2100,
        storage: 525,
        networking: 315,
        total: 3990, // 5% increase
      };

      const change = tracker.calculateChange('rec-001', newCost, 'user-123');

      expect(change.percentageChange).toBeCloseTo(5, 2);
      expect(change.requiresApproval).toBe(false);
    });

    it('should include all required fields in CostChange', () => {
      const newCost: CostEstimate = {
        infrastructure: 1100,
        compute: 2200,
        storage: 550,
        networking: 330,
        total: 4180,
      };

      const change = tracker.calculateChange('rec-001', newCost, 'user-123');

      expect(change).toHaveProperty('recommendationId', 'rec-001');
      expect(change).toHaveProperty('baseline');
      expect(change).toHaveProperty('current');
      expect(change).toHaveProperty('percentageChange');
      expect(change).toHaveProperty('changedBy', 'user-123');
      expect(change).toHaveProperty('timestamp');
      expect(change).toHaveProperty('requiresApproval');
      expect(change.timestamp).toBeInstanceOf(Date);
    });

    it('should throw error when baseline not found', () => {
      const newCost: CostEstimate = {
        infrastructure: 1100,
        compute: 2200,
        storage: 550,
        networking: 330,
        total: 4180,
      };

      expect(() =>
        tracker.calculateChange('non-existent', newCost, 'user-123')
      ).toThrow('No baseline found');
    });
  });

  describe('requiresApproval', () => {
    it('should return true for changes exceeding 10%', () => {
      const change = {
        percentageChange: 15,
      } as any;

      expect(tracker.requiresApproval(change)).toBe(true);
    });

    it('should return true for negative changes exceeding -10%', () => {
      const change = {
        percentageChange: -15,
      } as any;

      expect(tracker.requiresApproval(change)).toBe(true);
    });

    it('should return false for changes at exactly 10%', () => {
      const change = {
        percentageChange: 10,
      } as any;

      expect(tracker.requiresApproval(change)).toBe(false);
    });

    it('should return false for changes below 10%', () => {
      const change = {
        percentageChange: 5,
      } as any;

      expect(tracker.requiresApproval(change)).toBe(false);
    });

    it('should return false for zero change', () => {
      const change = {
        percentageChange: 0,
      } as any;

      expect(tracker.requiresApproval(change)).toBe(false);
    });
  });

  describe('getHistory', () => {
    it('should return empty array for recommendation with no history', () => {
      const history = tracker.getHistory('rec-001');
      expect(history).toEqual([]);
    });

    it('should return empty array for non-existent recommendation', () => {
      const history = tracker.getHistory('non-existent');
      expect(history).toEqual([]);
    });

    it('should return copy of history array', () => {
      const baseline: CostEstimate = {
        infrastructure: 1000,
        compute: 2000,
        storage: 500,
        networking: 300,
        total: 3800,
      };
      tracker.setBaseline('rec-001', baseline);

      const newCost: CostEstimate = {
        infrastructure: 1100,
        compute: 2200,
        storage: 550,
        networking: 330,
        total: 4180,
      };
      tracker.addToHistory('rec-001', baseline, newCost, 'user-123');

      const history1 = tracker.getHistory('rec-001');
      const history2 = tracker.getHistory('rec-001');

      expect(history1).toEqual(history2);
      expect(history1).not.toBe(history2); // Different array instances
    });
  });

  describe('updateBaseline', () => {
    beforeEach(() => {
      const baseline: CostEstimate = {
        infrastructure: 1000,
        compute: 2000,
        storage: 500,
        networking: 300,
        total: 3800,
      };
      tracker.setBaseline('rec-001', baseline);
    });

    it('should update baseline to approved cost', () => {
      const approvedCost: CostEstimate = {
        infrastructure: 1200,
        compute: 2400,
        storage: 600,
        networking: 360,
        total: 4560,
      };

      tracker.updateBaseline('rec-001', approvedCost, 'approver-123');
      const newBaseline = tracker.getBaseline('rec-001');

      expect(newBaseline).toEqual(approvedCost);
    });

    it('should add entry to history with approval metadata', () => {
      const approvedCost: CostEstimate = {
        infrastructure: 1200,
        compute: 2400,
        storage: 600,
        networking: 360,
        total: 4560,
      };

      tracker.updateBaseline('rec-001', approvedCost, 'approver-123');
      const history = tracker.getHistory('rec-001');

      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject({
        user: 'approver-123',
        approved: true,
        approvedBy: 'approver-123',
      });
      expect(history[0].approvalTimestamp).toBeInstanceOf(Date);
    });

    it('should calculate correct percentage change in history', () => {
      const approvedCost: CostEstimate = {
        infrastructure: 1200,
        compute: 2400,
        storage: 600,
        networking: 360,
        total: 4560, // 20% increase
      };

      tracker.updateBaseline('rec-001', approvedCost, 'approver-123');
      const history = tracker.getHistory('rec-001');

      expect(history[0].percentageChange).toBeCloseTo(20, 2);
    });

    it('should throw error when baseline not found', () => {
      const approvedCost: CostEstimate = {
        infrastructure: 1200,
        compute: 2400,
        storage: 600,
        networking: 360,
        total: 4560,
      };

      expect(() =>
        tracker.updateBaseline('non-existent', approvedCost, 'approver-123')
      ).toThrow('No baseline found');
    });

    it('should throw error for invalid approved cost', () => {
      const invalidCost: CostEstimate = {
        infrastructure: -100,
        compute: 2400,
        storage: 600,
        networking: 360,
        total: 3260,
      };

      expect(() =>
        tracker.updateBaseline('rec-001', invalidCost, 'approver-123')
      ).toThrow('Invalid cost estimate');
    });
  });

  describe('addToHistory', () => {
    it('should add cost change to history without approval', () => {
      const previousCost: CostEstimate = {
        infrastructure: 1000,
        compute: 2000,
        storage: 500,
        networking: 300,
        total: 3800,
      };

      const newCost: CostEstimate = {
        infrastructure: 1100,
        compute: 2200,
        storage: 550,
        networking: 330,
        total: 4180,
      };

      tracker.addToHistory('rec-001', previousCost, newCost, 'user-123');
      const history = tracker.getHistory('rec-001');

      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject({
        user: 'user-123',
        approved: false,
      });
      expect(history[0].approvedBy).toBeUndefined();
      expect(history[0].approvalTimestamp).toBeUndefined();
    });

    it('should maintain chronological order in history', () => {
      const cost1: CostEstimate = {
        infrastructure: 1000,
        compute: 2000,
        storage: 500,
        networking: 300,
        total: 3800,
      };

      const cost2: CostEstimate = {
        infrastructure: 1100,
        compute: 2200,
        storage: 550,
        networking: 330,
        total: 4180,
      };

      const cost3: CostEstimate = {
        infrastructure: 1200,
        compute: 2400,
        storage: 600,
        networking: 360,
        total: 4560,
      };

      tracker.addToHistory('rec-001', cost1, cost2, 'user-123');
      tracker.addToHistory('rec-001', cost2, cost3, 'user-456');

      const history = tracker.getHistory('rec-001');

      expect(history).toHaveLength(2);
      expect(history[0].user).toBe('user-123');
      expect(history[1].user).toBe('user-456');
      expect(history[0].timestamp.getTime()).toBeLessThanOrEqual(
        history[1].timestamp.getTime()
      );
    });
  });

  describe('edge cases', () => {
    it('should handle zero baseline cost', () => {
      const baseline: CostEstimate = {
        infrastructure: 0,
        compute: 0,
        storage: 0,
        networking: 0,
        total: 0,
      };
      tracker.setBaseline('rec-001', baseline);

      const newCost: CostEstimate = {
        infrastructure: 100,
        compute: 200,
        storage: 50,
        networking: 30,
        total: 380,
      };

      const change = tracker.calculateChange('rec-001', newCost, 'user-123');

      // When baseline is 0, any positive value is 100% increase
      expect(change.percentageChange).toBe(100);
      expect(change.requiresApproval).toBe(true);
    });

    it('should handle very small cost changes', () => {
      const baseline: CostEstimate = {
        infrastructure: 1000,
        compute: 2000,
        storage: 500,
        networking: 300,
        total: 3800,
      };
      tracker.setBaseline('rec-001', baseline);

      const newCost: CostEstimate = {
        infrastructure: 1000,
        compute: 2000,
        storage: 500,
        networking: 301, // 1 unit increase
        total: 3801,
      };

      const change = tracker.calculateChange('rec-001', newCost, 'user-123');

      expect(change.percentageChange).toBeCloseTo(0.026, 2);
      expect(change.requiresApproval).toBe(false);
    });

    it('should handle very large cost values', () => {
      const baseline: CostEstimate = {
        infrastructure: 1000000,
        compute: 2000000,
        storage: 500000,
        networking: 300000,
        total: 3800000,
      };
      tracker.setBaseline('rec-001', baseline);

      const newCost: CostEstimate = {
        infrastructure: 1200000,
        compute: 2400000,
        storage: 600000,
        networking: 360000,
        total: 4560000, // 20% increase
      };

      const change = tracker.calculateChange('rec-001', newCost, 'user-123');

      expect(change.percentageChange).toBeCloseTo(20, 2);
      expect(change.requiresApproval).toBe(true);
    });

    it('should handle floating point precision', () => {
      const baseline: CostEstimate = {
        infrastructure: 1000.33,
        compute: 2000.67,
        storage: 500.25,
        networking: 300.15,
        total: 3801.40,
      };
      tracker.setBaseline('rec-001', baseline);

      const newCost: CostEstimate = {
        infrastructure: 1100.36,
        compute: 2200.74,
        storage: 550.28,
        networking: 330.17,
        total: 4181.55,
      };

      const change = tracker.calculateChange('rec-001', newCost, 'user-123');

      expect(change.percentageChange).toBeCloseTo(10, 1);
    });
  });

  describe('clear', () => {
    it('should clear all baselines and history', () => {
      const baseline: CostEstimate = {
        infrastructure: 1000,
        compute: 2000,
        storage: 500,
        networking: 300,
        total: 3800,
      };
      tracker.setBaseline('rec-001', baseline);
      tracker.setBaseline('rec-002', baseline);

      tracker.clear();

      expect(tracker.getBaseline('rec-001')).toBeUndefined();
      expect(tracker.getBaseline('rec-002')).toBeUndefined();
      expect(tracker.getHistory('rec-001')).toEqual([]);
      expect(tracker.getHistory('rec-002')).toEqual([]);
    });
  });
});
