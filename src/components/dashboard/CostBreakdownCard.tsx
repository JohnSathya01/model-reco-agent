import React from 'react';
import { DollarSign, TrendingUp, Lightbulb } from 'lucide-react';
import { Card } from '../ui';
import type { CostBreakdown } from '../../types';

interface CostBreakdownCardProps {
  costBreakdown: CostBreakdown;
  className?: string;
}

const CostBreakdownCard: React.FC<CostBreakdownCardProps> = ({
  costBreakdown,
  className = ''
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'training': return 'bg-blue-500';
      case 'inference': return 'bg-green-500';
      case 'storage': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card title="💰 Cost Breakdown" className={className}>
      <div className="space-y-6">
        {/* Monthly Cost Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(costBreakdown.monthlyTrainingCost)}
            </div>
            <div className="text-xs text-blue-600 font-medium">Training</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(costBreakdown.monthlyInferenceCost)}
            </div>
            <div className="text-xs text-green-600 font-medium">Inference</div>
          </div>
          
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(costBreakdown.storageCost)}
            </div>
            <div className="text-xs text-yellow-600 font-medium">Storage</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(costBreakdown.totalMonthlyCost)}
            </div>
            <div className="text-xs text-gray-600 font-medium">Total/Month</div>
          </div>
        </div>

        {/* Cost Breakdown Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
            Monthly Cost Distribution
          </h4>
          <div className="space-y-3">
            {costBreakdown.breakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900">{formatCurrency(item.amount)}</span>
                    <span className="text-gray-500">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getCategoryColor(item.category)}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Annual Projection */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                Annual Projection
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                Based on current monthly usage patterns
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(costBreakdown.annualProjection)}
              </div>
              <div className="text-xs text-gray-500">per year</div>
            </div>
          </div>
        </div>

        {/* Cost Savings Suggestions */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
            Cost Optimization Suggestions
          </h4>
          <ul className="space-y-2">
            {costBreakdown.savingsSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                <span className="text-yellow-500 mt-1">💡</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default CostBreakdownCard;