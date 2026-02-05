/**
 * Example usage of CostChangeApprovalPanel component
 * 
 * This file demonstrates how to integrate the CostChangeApprovalPanel
 * into your application with the CostChangeTracker service.
 */

import React, { useState, useEffect } from 'react';
import { CostChangeApprovalPanel } from './CostChangeApprovalPanel';
import { costChangeTracker } from '../../utils/costChangeTracker';
import type { CostChange, CostHistoryEntry } from '../../types/cost';

/**
 * Example: Basic usage with cost change data
 */
export const BasicExample: React.FC = () => {
  const mockCostChange: CostChange = {
    recommendationId: 'rec-123',
    baseline: {
      infrastructure: 1000,
      compute: 2000,
      storage: 500,
      networking: 300,
      total: 3800
    },
    current: {
      infrastructure: 1200,
      compute: 2500,
      storage: 600,
      networking: 350,
      total: 4650
    },
    percentageChange: 22.37,
    changedBy: 'user-456',
    timestamp: new Date(),
    requiresApproval: true
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Basic Cost Change Approval</h2>
      <CostChangeApprovalPanel
        costChange={mockCostChange}
        currentUserRole="solution-architect"
        onApprove={() => console.log('Approved!')}
        onReject={() => console.log('Rejected!')}
      />
    </div>
  );
};

/**
 * Example: Integration with CostChangeTracker service
 */
export const IntegratedExample: React.FC<{ recommendationId: string }> = ({ recommendationId }) => {
  const [costChange, setCostChange] = useState<CostChange | null>(null);
  const [history, setHistory] = useState<CostHistoryEntry[]>([]);

  useEffect(() => {
    // Get baseline and calculate change
    const baseline = costChangeTracker.getBaseline(recommendationId);
    if (baseline) {
      // Simulate a cost change
      const newCost = {
        infrastructure: baseline.infrastructure * 1.15,
        compute: baseline.compute * 1.20,
        storage: baseline.storage * 1.10,
        networking: baseline.networking * 1.05,
        total: 0
      };
      newCost.total = newCost.infrastructure + newCost.compute + newCost.storage + newCost.networking;

      const change = costChangeTracker.calculateChange(recommendationId, newCost, 'current-user');
      setCostChange(change);

      // Get history
      const historyData = costChangeTracker.getHistory(recommendationId);
      setHistory(historyData);
    }
  }, [recommendationId]);

  const handleApprove = () => {
    if (costChange) {
      costChangeTracker.updateBaseline(
        recommendationId,
        costChange.current,
        'solution-architect-123'
      );
      console.log('Cost change approved and baseline updated');
    }
  };

  const handleReject = () => {
    console.log('Cost change rejected');
  };

  if (!costChange) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Integrated Cost Change Approval</h2>
      <CostChangeApprovalPanel
        costChange={costChange}
        costHistory={history}
        currentUserRole="solution-architect"
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

/**
 * Example: With cost history
 */
export const WithHistoryExample: React.FC = () => {
  const mockCostChange: CostChange = {
    recommendationId: 'rec-456',
    baseline: {
      infrastructure: 2000,
      compute: 3000,
      storage: 1000,
      networking: 500,
      total: 6500
    },
    current: {
      infrastructure: 2200,
      compute: 3300,
      storage: 1100,
      networking: 550,
      total: 7150
    },
    percentageChange: 10.0,
    changedBy: 'user-789',
    timestamp: new Date(),
    requiresApproval: true
  };

  const mockHistory: CostHistoryEntry[] = [
    {
      timestamp: new Date('2024-01-01T10:00:00Z'),
      user: 'user-123',
      previousCost: {
        infrastructure: 1800,
        compute: 2800,
        storage: 900,
        networking: 450,
        total: 5950
      },
      newCost: {
        infrastructure: 2000,
        compute: 3000,
        storage: 1000,
        networking: 500,
        total: 6500
      },
      percentageChange: 9.24,
      approved: true,
      approvedBy: 'architect-456',
      approvalTimestamp: new Date('2024-01-01T11:00:00Z')
    },
    {
      timestamp: new Date('2024-01-10T14:00:00Z'),
      user: 'user-456',
      previousCost: {
        infrastructure: 2000,
        compute: 3000,
        storage: 1000,
        networking: 500,
        total: 6500
      },
      newCost: {
        infrastructure: 2100,
        compute: 3200,
        storage: 1050,
        networking: 525,
        total: 6875
      },
      percentageChange: 5.77,
      approved: false
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Cost Change with History</h2>
      <CostChangeApprovalPanel
        costChange={mockCostChange}
        costHistory={mockHistory}
        currentUserRole="solution-architect"
        onApprove={() => console.log('Approved!')}
        onReject={() => console.log('Rejected!')}
      />
    </div>
  );
};

/**
 * Example: Non-approval scenario (change within threshold)
 */
export const NoApprovalRequiredExample: React.FC = () => {
  const mockCostChange: CostChange = {
    recommendationId: 'rec-789',
    baseline: {
      infrastructure: 1000,
      compute: 2000,
      storage: 500,
      networking: 300,
      total: 3800
    },
    current: {
      infrastructure: 1050,
      compute: 2100,
      storage: 520,
      networking: 310,
      total: 3980
    },
    percentageChange: 4.74, // Less than 10%
    changedBy: 'user-999',
    timestamp: new Date(),
    requiresApproval: false
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">No Approval Required</h2>
      <CostChangeApprovalPanel
        costChange={mockCostChange}
        currentUserRole="solution-architect"
      />
    </div>
  );
};

/**
 * Example: Different user roles
 */
export const RoleBasedExample: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('solution-architect');

  const mockCostChange: CostChange = {
    recommendationId: 'rec-role',
    baseline: {
      infrastructure: 1000,
      compute: 2000,
      storage: 500,
      networking: 300,
      total: 3800
    },
    current: {
      infrastructure: 1300,
      compute: 2600,
      storage: 650,
      networking: 390,
      total: 4940
    },
    percentageChange: 30.0,
    changedBy: 'user-role',
    timestamp: new Date(),
    requiresApproval: true
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Role-Based Approval</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select User Role:
        </label>
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="solution-architect">Solution Architect</option>
          <option value="admin">Admin</option>
          <option value="project-manager">Project Manager</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      <CostChangeApprovalPanel
        costChange={mockCostChange}
        currentUserRole={userRole}
        onApprove={() => console.log('Approved by', userRole)}
        onReject={() => console.log('Rejected by', userRole)}
      />
    </div>
  );
};

/**
 * Example: Complete workflow in a dashboard
 */
export const DashboardIntegrationExample: React.FC = () => {
  const [recommendations] = useState([
    {
      id: 'rec-001',
      title: 'ML Model Deployment',
      costChange: {
        recommendationId: 'rec-001',
        baseline: { infrastructure: 1000, compute: 2000, storage: 500, networking: 300, total: 3800 },
        current: { infrastructure: 1200, compute: 2500, storage: 600, networking: 350, total: 4650 },
        percentageChange: 22.37,
        changedBy: 'user-001',
        timestamp: new Date(),
        requiresApproval: true
      }
    },
    {
      id: 'rec-002',
      title: 'Data Pipeline Setup',
      costChange: {
        recommendationId: 'rec-002',
        baseline: { infrastructure: 500, compute: 1000, storage: 300, networking: 200, total: 2000 },
        current: { infrastructure: 550, compute: 1100, storage: 330, networking: 220, total: 2200 },
        percentageChange: 10.0,
        changedBy: 'user-002',
        timestamp: new Date(),
        requiresApproval: true
      }
    }
  ]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Pending Cost Approvals</h2>
      
      {recommendations.map((rec) => (
        <div key={rec.id} className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
          <CostChangeApprovalPanel
            costChange={rec.costChange}
            currentUserRole="solution-architect"
            onApprove={() => console.log(`Approved ${rec.id}`)}
            onReject={() => console.log(`Rejected ${rec.id}`)}
          />
        </div>
      ))}
    </div>
  );
};
