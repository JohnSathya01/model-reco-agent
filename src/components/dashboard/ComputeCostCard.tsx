import React from 'react';
import { Cpu, Clock, DollarSign, Zap } from 'lucide-react';
import { Card, ProgressBar } from '../ui';
import type { ComputeEstimate } from '../../types';

interface ComputeCostCardProps {
  estimate: ComputeEstimate;
  className?: string;
}

const ComputeCostCard: React.FC<ComputeCostCardProps> = ({
  estimate,
  className = ''
}) => {
  // Calculate relative cost levels for progress bars
  const getCostLevel = (cost: string) => {
    const numericCost = parseFloat(cost.replace(/[^0-9.]/g, ''));
    if (numericCost < 100) return { value: 25, variant: 'success' as const };
    if (numericCost < 500) return { value: 50, variant: 'warning' as const };
    if (numericCost < 1000) return { value: 75, variant: 'warning' as const };
    return { value: 90, variant: 'error' as const };
  };

  const getGpuLevel = (count: number) => {
    if (count <= 1) return { value: 20, variant: 'success' as const };
    if (count <= 4) return { value: 50, variant: 'warning' as const };
    if (count <= 8) return { value: 75, variant: 'warning' as const };
    return { value: 100, variant: 'error' as const };
  };

  const monthlyCostLevel = getCostLevel(estimate.monthlyCost);
  const inferenceCostLevel = getCostLevel(estimate.inferenceCost);
  const gpuLevel = getGpuLevel(estimate.gpuCount);

  return (
    <Card title="Compute & Cost Estimation" className={className}>
      <div className="space-y-6">
        {/* Resource Requirements */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Cpu className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">GPU Count</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{estimate.gpuCount}</div>
            <ProgressBar
              value={gpuLevel.value}
              variant={gpuLevel.variant}
              size="sm"
              showValue={false}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Training Time</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{estimate.trainingTime}</div>
            <div className="text-xs text-gray-600 mt-1">Estimated duration</div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Cost Breakdown</h4>
          
          {/* Monthly Cost */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Monthly Cost</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{estimate.monthlyCost}</span>
            </div>
            <ProgressBar
              value={monthlyCostLevel.value}
              variant={monthlyCostLevel.variant}
              size="sm"
              showValue={false}
            />
            <div className="text-xs text-gray-600 mt-1">
              Includes training and infrastructure costs
            </div>
          </div>

          {/* Inference Cost */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Inference Cost</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{estimate.inferenceCost}</span>
            </div>
            <ProgressBar
              value={inferenceCostLevel.value}
              variant={inferenceCostLevel.variant}
              size="sm"
              showValue={false}
            />
            <div className="text-xs text-gray-600 mt-1">
              Per 1,000 requests
            </div>
          </div>
        </div>

        {/* Cost Optimization Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Cost Optimization Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use spot instances for training to reduce costs by up to 70%</li>
            <li>• Consider batch inference for higher throughput</li>
            <li>• Monitor usage patterns to optimize resource allocation</li>
          </ul>
        </div>

        {/* Resource Utilization */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 mb-1">Efficiency</div>
            <div className="text-xs text-green-600 font-medium">High</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 mb-1">Scalability</div>
            <div className="text-xs text-blue-600 font-medium">Good</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900 mb-1">ROI</div>
            <div className="text-xs text-purple-600 font-medium">Positive</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ComputeCostCard;