import React from 'react';
import { DollarSign, AlertTriangle } from 'lucide-react';
import { CostThresholdService } from '../../utils/costThresholdService';

interface CostThresholdBadgeProps {
  cost: string;
  showMessage?: boolean;
  className?: string;
}

export const CostThresholdBadge: React.FC<CostThresholdBadgeProps> = ({
  cost,
  showMessage = false,
  className = ''
}) => {
  const level = CostThresholdService.getCostLevel(cost);
  const requiresApproval = CostThresholdService.requiresBudgetApproval(cost);
  const message = CostThresholdService.getThresholdMessage(cost);
  const badgeColor = CostThresholdService.getCostBadgeColor(cost);

  return (
    <div className={`${className}`}>
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${badgeColor}`}>
        <DollarSign className="w-4 h-4" />
        <span className="text-sm font-medium">{cost}</span>
        {level === 'critical' && (
          <AlertTriangle className="w-4 h-4" />
        )}
      </div>
      
      {showMessage && (
        <div className={`mt-2 text-sm ${
          requiresApproval ? 'text-orange-700' : 'text-gray-600'
        }`}>
          {requiresApproval && (
            <span className="font-medium">⚠️ Budget Approval Required: </span>
          )}
          {message}
        </div>
      )}
    </div>
  );
};
