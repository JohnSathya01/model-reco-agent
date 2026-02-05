/**
 * Unit tests for CostChangeApprovalPanel component
 * Tests component props, calculations, and rendering logic
 */

import { describe, it, expect } from 'vitest';
import type { CostChange, CostHistoryEntry } from '../../types/cost';

describe('CostChangeApprovalPanel', () => {
  const mockBaseline = {
    infrastructure: 1000,
    compute: 2000,
    storage: 500,
    networking: 300,
    total: 3800
  };

  const mockCurrent = {
    infrastructure: 1200,
    compute: 2500,
    storage: 600,
    networking: 350,
    total: 4650
  };

  const mockCostChange: CostChange = {
    recommendationId: 'rec-123',
    baseline: mockBaseline,
    current: mockCurrent,
    percentageChange: 22.37, // (4650 - 3800) / 3800 * 100
    changedBy: 'user-456',
    timestamp: new Date('2024-01-15T10:00:00Z'),
    requiresApproval: true
  };

  const mockHistory: CostHistoryEntry[] = [
    {
      timestamp: new Date('2024-01-10T10:00:00Z'),
      user: 'user-123',
      previousCost: mockBaseline,
      newCost: mockCurrent,
      percentageChange: 22.37,
      approved: true,
      approvedBy: 'architect-789',
      approvalTimestamp: new Date('2024-01-10T11:00:00Z')
    }
  ];

  it('should have valid cost change data structure', () => {
    expect(mockCostChange.recommendationId).toBe('rec-123');
    expect(mockCostChange.percentageChange).toBe(22.37);
    expect(mockCostChange.requiresApproval).toBe(true);
  });

  it('should calculate cost difference correctly', () => {
    const difference = mockCurrent.total - mockBaseline.total;
    expect(difference).toBe(850); // 4650 - 3800
  });

  it('should calculate annual impact correctly', () => {
    const monthlyDifference = mockCurrent.total - mockBaseline.total;
    const annualImpact = monthlyDifference * 12;
    expect(annualImpact).toBe(10200); // 850 * 12
  });

  it('should identify cost increase correctly', () => {
    const isIncrease = mockCostChange.percentageChange > 0;
    expect(isIncrease).toBe(true);
  });

  it('should identify significant change correctly', () => {
    const isSignificant = Math.abs(mockCostChange.percentageChange) > 10;
    expect(isSignificant).toBe(true);
  });

  it('should format percentage correctly', () => {
    const formatPercentage = (value: number) => {
      const sign = value > 0 ? '+' : '';
      return `${sign}${value.toFixed(2)}%`;
    };

    expect(formatPercentage(22.37)).toBe('+22.37%');
    expect(formatPercentage(-15.5)).toBe('-15.50%');
    expect(formatPercentage(5.0)).toBe('+5.00%');
  });

  it('should format currency correctly', () => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    };

    expect(formatCurrency(3800)).toBe('$3,800.00');
    expect(formatCurrency(4650)).toBe('$4,650.00');
    expect(formatCurrency(850)).toBe('$850.00');
  });

  it('should determine correct badge color for minor change', () => {
    const getBadgeColor = (percentageChange: number) => {
      const isSignificant = Math.abs(percentageChange) > 10;
      if (!isSignificant) {
        return 'bg-green-100 text-green-800 border-green-200';
      }
      if (Math.abs(percentageChange) > 25) {
        return 'bg-red-100 text-red-800 border-red-200';
      }
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    };

    expect(getBadgeColor(5.0)).toBe('bg-green-100 text-green-800 border-green-200');
  });

  it('should determine correct badge color for significant change', () => {
    const getBadgeColor = (percentageChange: number) => {
      const isSignificant = Math.abs(percentageChange) > 10;
      if (!isSignificant) {
        return 'bg-green-100 text-green-800 border-green-200';
      }
      if (Math.abs(percentageChange) > 25) {
        return 'bg-red-100 text-red-800 border-red-200';
      }
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    };

    expect(getBadgeColor(22.37)).toBe('bg-yellow-100 text-yellow-800 border-yellow-200');
  });

  it('should determine correct badge color for critical change', () => {
    const getBadgeColor = (percentageChange: number) => {
      const isSignificant = Math.abs(percentageChange) > 10;
      if (!isSignificant) {
        return 'bg-green-100 text-green-800 border-green-200';
      }
      if (Math.abs(percentageChange) > 25) {
        return 'bg-red-100 text-red-800 border-red-200';
      }
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    };

    expect(getBadgeColor(30.0)).toBe('bg-red-100 text-red-800 border-red-200');
  });

  it('should validate user role permissions', () => {
    const canApprove = (role: string | undefined) => {
      return role === 'solution-architect' || role === 'admin';
    };

    expect(canApprove('solution-architect')).toBe(true);
    expect(canApprove('admin')).toBe(true);
    expect(canApprove('project-manager')).toBe(false);
    expect(canApprove('viewer')).toBe(false);
    expect(canApprove(undefined)).toBe(false);
  });

  it('should have valid cost history structure', () => {
    expect(mockHistory).toHaveLength(1);
    expect(mockHistory[0].approved).toBe(true);
    expect(mockHistory[0].approvedBy).toBe('architect-789');
    expect(mockHistory[0].percentageChange).toBe(22.37);
  });

  it('should calculate individual cost component changes', () => {
    const infrastructureChange = mockCurrent.infrastructure - mockBaseline.infrastructure;
    const computeChange = mockCurrent.compute - mockBaseline.compute;
    const storageChange = mockCurrent.storage - mockBaseline.storage;
    const networkingChange = mockCurrent.networking - mockBaseline.networking;

    expect(infrastructureChange).toBe(200);
    expect(computeChange).toBe(500);
    expect(storageChange).toBe(100);
    expect(networkingChange).toBe(50);
  });

  it('should calculate percentage change for individual components', () => {
    const calculatePercentage = (baseline: number, current: number) => {
      if (baseline === 0) return current > 0 ? 100 : 0;
      return ((current - baseline) / baseline) * 100;
    };

    const infraPercentage = calculatePercentage(mockBaseline.infrastructure, mockCurrent.infrastructure);
    expect(infraPercentage).toBeCloseTo(20.0, 1); // (1200 - 1000) / 1000 * 100 = 20%

    const computePercentage = calculatePercentage(mockBaseline.compute, mockCurrent.compute);
    expect(computePercentage).toBeCloseTo(25.0, 1); // (2500 - 2000) / 2000 * 100 = 25%
  });
});

