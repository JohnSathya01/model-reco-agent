import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { CostChange, CostHistoryEntry } from '../../types/cost';

interface CostChangeApprovalPanelProps {
  costChange: CostChange;
  costHistory?: CostHistoryEntry[];
  currentUserRole?: string;
  onApprove?: () => void;
  onReject?: () => void;
  className?: string;
}

export const CostChangeApprovalPanel: React.FC<CostChangeApprovalPanelProps> = ({
  costChange,
  costHistory = [],
  currentUserRole,
  onApprove,
  onReject,
  className = ''
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showComparison, setShowComparison] = useState(true);

  const { baseline, current, percentageChange, requiresApproval, timestamp } = costChange;

  // Check if user can approve (Solution Architect or Admin)
  const canApprove = currentUserRole === 'solution-architect' || currentUserRole === 'admin';

  // Determine if this is an increase or decrease
  const isIncrease = percentageChange > 0;
  const isSignificant = Math.abs(percentageChange) > 10;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // Get badge color based on percentage change
  const getBadgeColor = () => {
    if (!isSignificant) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (Math.abs(percentageChange) > 25) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  // Render cost breakdown comparison
  const renderCostComparison = (label: string, baselineValue: number, currentValue: number) => {
    const change = currentValue - baselineValue;
    const changePercent = baselineValue > 0 ? ((change / baselineValue) * 100) : 0;
    const hasChange = Math.abs(change) > 0.01;

    return (
      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{formatCurrency(baselineValue)}</span>
          <span className="text-gray-400">→</span>
          <span className={`text-sm font-medium ${hasChange ? (change > 0 ? 'text-red-600' : 'text-green-600') : 'text-gray-900'}`}>
            {formatCurrency(currentValue)}
          </span>
          {hasChange && (
            <span className={`text-xs ${change > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ({formatPercentage(changePercent)})
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${isSignificant ? 'bg-yellow-100' : 'bg-blue-100'}`}>
              <DollarSign className={`w-5 h-5 ${isSignificant ? 'text-yellow-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Cost Change Review</h3>
              <p className="text-sm text-gray-600 mt-1">
                Cost estimate modified on {new Date(timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Percentage Change Badge */}
          <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${getBadgeColor()}`}>
            {isIncrease ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-bold">{formatPercentage(percentageChange)}</span>
            {isSignificant && <AlertTriangle className="w-4 h-4" />}
          </div>
        </div>

        {/* Approval Required Alert */}
        {requiresApproval && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900">Approval Required</p>
                <p className="text-sm text-yellow-700 mt-1">
                  This cost change exceeds the 10% threshold and requires Solution Architect approval before proceeding.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cost Comparison Section */}
      <div className="p-6">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full flex items-center justify-between mb-4 text-left"
        >
          <h4 className="text-sm font-semibold text-gray-900">Cost Breakdown Comparison</h4>
          {showComparison ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {showComparison && (
          <div className="space-y-1">
            {renderCostComparison('Infrastructure', baseline.infrastructure, current.infrastructure)}
            {renderCostComparison('Compute', baseline.compute, current.compute)}
            {renderCostComparison('Storage', baseline.storage, current.storage)}
            {renderCostComparison('Networking', baseline.networking, current.networking)}
            
            {/* Total with emphasis */}
            <div className="flex items-center justify-between py-3 mt-2 pt-3 border-t-2 border-gray-300 bg-gray-50 px-3 rounded-lg">
              <span className="text-base font-bold text-gray-900">Total Monthly Cost</span>
              <div className="flex items-center space-x-4">
                <span className="text-base text-gray-600">{formatCurrency(baseline.total)}</span>
                <span className="text-gray-400">→</span>
                <span className={`text-lg font-bold ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(current.total)}
                </span>
              </div>
            </div>

            {/* Change Summary */}
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {isIncrease ? 'Cost Increase' : 'Cost Decrease'}
                </span>
                <span className={`text-sm font-bold ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(Math.abs(current.total - baseline.total))}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-blue-700">Annual Impact</span>
                <span className={`text-xs font-semibold ${isIncrease ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(Math.abs(current.total - baseline.total) * 12)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cost History Timeline */}
      {costHistory.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between mb-4 text-left"
          >
            <h4 className="text-sm font-semibold text-gray-900">
              Cost History ({costHistory.length} {costHistory.length === 1 ? 'change' : 'changes'})
            </h4>
            {showHistory ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {showHistory && (
            <div className="space-y-3">
              {costHistory.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    entry.approved ? 'bg-green-100' : 'bg-gray-200'
                  }`}>
                    {entry.approved ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(entry.previousCost.total)} → {formatCurrency(entry.newCost.total)}
                      </p>
                      <span className={`text-xs font-semibold ${
                        entry.percentageChange > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatPercentage(entry.percentageChange)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Modified by {entry.user} on {new Date(entry.timestamp).toLocaleString()}
                    </p>
                    {entry.approved && entry.approvedBy && (
                      <p className="text-xs text-green-700 mt-1">
                        ✓ Approved by {entry.approvedBy} on {entry.approvalTimestamp ? new Date(entry.approvalTimestamp).toLocaleString() : 'N/A'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {requiresApproval && canApprove && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              As a Solution Architect, you can approve or reject this cost change.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={onReject}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
              <button
                onClick={onApprove}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Non-approval state message */}
      {!requiresApproval && (
        <div className="border-t border-gray-200 p-6 bg-green-50">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">No Approval Required</p>
              <p className="text-sm text-green-700 mt-1">
                This cost change is within the acceptable threshold (±10%) and does not require additional approval.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
