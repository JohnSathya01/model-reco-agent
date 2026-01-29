import React, { useState } from 'react';
import { Server, Zap, DollarSign, Clock } from 'lucide-react';
import { Card, Button } from '../ui';
import type { InstanceRecommendation } from '../../types';

interface InstanceRecommendationsCardProps {
  instances: InstanceRecommendation[];
  className?: string;
}

const InstanceRecommendationsCard: React.FC<InstanceRecommendationsCardProps> = ({
  instances,
  className = ''
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('AWS');
  
  const providers = [...new Set(instances.map(instance => instance.provider))];
  const filteredInstances = instances.filter(instance => instance.provider === selectedProvider);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(amount);
  };

  const calculateMonthlyCost = (hourlyCost: number) => {
    return hourlyCost * 24 * 30; // 24 hours * 30 days
  };

  const calculateSavings = (hourlyCost: number, spotPrice?: number) => {
    if (!spotPrice) return 0;
    return Math.round(((hourlyCost - spotPrice) / hourlyCost) * 100);
  };

  return (
    <Card title="🖥️ Instance Recommendations" className={className}>
      <div className="space-y-6">
        {/* Provider Selection */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Cloud Provider</h4>
          <div className="flex flex-wrap gap-2">
            {providers.map((provider) => (
              <Button
                key={provider}
                variant={selectedProvider === provider ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedProvider(provider)}
                className="text-xs"
              >
                {provider}
              </Button>
            ))}
          </div>
        </div>

        {/* Instance Recommendations */}
        <div className="space-y-4">
          {filteredInstances.map((instance, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Server className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">{instance.instanceType}</h5>
                    <p className="text-sm text-gray-600">{instance.gpuType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(instance.hourlyCost)}/hr
                  </div>
                  {instance.spotPrice && (
                    <div className="text-sm text-green-600">
                      Spot: {formatCurrency(instance.spotPrice)}/hr
                    </div>
                  )}
                </div>
              </div>
              
              {/* Instance Specs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">{instance.vCPU}</div>
                  <div className="text-xs text-gray-500">vCPUs</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">{instance.memory}</div>
                  <div className="text-xs text-gray-500">Memory</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    ${Math.round(calculateMonthlyCost(instance.hourlyCost))}
                  </div>
                  <div className="text-xs text-gray-500">Monthly (On-Demand)</div>
                </div>
                {instance.spotPrice && (
                  <div className="text-center">
                    <div className="text-sm font-semibold text-green-600">
                      {calculateSavings(instance.hourlyCost, instance.spotPrice)}% off
                    </div>
                    <div className="text-xs text-gray-500">Spot Savings</div>
                  </div>
                )}
              </div>

              {/* Cost Comparison */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>On-Demand</span>
                  </span>
                  <span className="font-medium">${Math.round(calculateMonthlyCost(instance.hourlyCost))}/month</span>
                </div>
                
                {instance.spotPrice && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>Spot Instance</span>
                    </span>
                    <span className="font-medium text-green-600">
                      ${Math.round(calculateMonthlyCost(instance.spotPrice))}/month
                    </span>
                  </div>
                )}
              </div>

              {/* Recommendation Badge */}
              {index === 0 && (
                <div className="mt-3 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Recommended
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cost Calculator Note */}
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Costs are estimates based on current pricing. 
            Actual costs may vary based on usage patterns, data transfer, and additional services.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default InstanceRecommendationsCard;