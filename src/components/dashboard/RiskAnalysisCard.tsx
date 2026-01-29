import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { Card } from '../ui';
import type { RiskAnalysis } from '../../types';

interface RiskAnalysisCardProps {
  riskAnalysis: RiskAnalysis;
  className?: string;
}

const RiskAnalysisCard: React.FC<RiskAnalysisCardProps> = ({
  riskAnalysis,
  className = ''
}) => {
  const getRiskLevel = (risk: number): { level: string; color: string; bgColor: string } => {
    if (risk <= 0.2) return { level: 'Low', color: 'text-green-700', bgColor: 'bg-green-100' };
    if (risk <= 0.4) return { level: 'Medium', color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
    if (risk <= 0.6) return { level: 'High', color: 'text-orange-700', bgColor: 'bg-orange-100' };
    return { level: 'Critical', color: 'text-red-700', bgColor: 'bg-red-100' };
  };

  const riskCategories = [
    { name: 'Accuracy Risk', value: riskAnalysis.accuracyRisk, key: 'accuracy' },
    { name: 'Cost Risk', value: riskAnalysis.costRisk, key: 'cost' },
    { name: 'Latency Risk', value: riskAnalysis.latencyRisk, key: 'latency' },
    { name: 'Scalability Risk', value: riskAnalysis.scalabilityRisk, key: 'scalability' },
    { name: 'Maintenance Risk', value: riskAnalysis.maintenanceRisk, key: 'maintenance' }
  ];

  return (
    <Card title="⚠️ Risk Analysis" className={className}>
      <div className="space-y-6">
        {/* Risk Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {riskCategories.map((category) => {
            const riskInfo = getRiskLevel(category.value);
            return (
              <div key={category.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${riskInfo.bgColor} ${riskInfo.color}`}>
                    {riskInfo.level}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      category.value <= 0.2 ? 'bg-green-500' :
                      category.value <= 0.4 ? 'bg-yellow-500' :
                      category.value <= 0.6 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(category.value * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{Math.round(category.value * 100)}%</span>
              </div>
            );
          })}
        </div>
        {/* Risk Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center">
            <Info className="w-4 h-4 mr-2 text-blue-600" />
            Risk Details & Mitigation
          </h4>
          
          {Object.entries(riskAnalysis.notes).map(([key, note]) => {
            const category = riskCategories.find(c => c.key === key);
            const riskInfo = getRiskLevel(category?.value || 0);
            
            return (
              <div key={key} className="p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className={`w-4 h-4 ${
                    category && category.value > 0.4 ? 'text-orange-500' : 'text-gray-400'
                  }`} />
                  <span className="font-medium text-sm text-gray-900 capitalize">
                    {key} Risk
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${riskInfo.bgColor} ${riskInfo.color}`}>
                    {riskInfo.level}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{note}</p>
              </div>
            );
          })}
        </div>

        {/* Overall Risk Assessment */}
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Overall Assessment</h4>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-1">Average Risk Level</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    riskCategories.reduce((sum, cat) => sum + cat.value, 0) / riskCategories.length <= 0.3 
                      ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                  style={{ 
                    width: `${Math.min((riskCategories.reduce((sum, cat) => sum + cat.value, 0) / riskCategories.length) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {Math.round((riskCategories.reduce((sum, cat) => sum + cat.value, 0) / riskCategories.length) * 100)}%
              </div>
              <div className="text-xs text-gray-500">Risk Score</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RiskAnalysisCard;