import React from 'react';
import { ArrowUpDown, TrendingUp, Clock, DollarSign, BarChart3 } from 'lucide-react';
import { Card } from '../ui';
import type { AlternativeModel } from '../../types';

interface AlternativesTableProps {
  alternatives: AlternativeModel[];
  className?: string;
}

const AlternativesTable: React.FC<AlternativesTableProps> = ({
  alternatives,
  className = ''
}) => {
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScalabilityIcon = (scalability: string) => {
    switch (scalability.toLowerCase()) {
      case 'high':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'medium':
        return <BarChart3 className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <BarChart3 className="w-4 h-4 text-red-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card title="Ranked Alternatives" className={className}>
      <div className="overflow-x-auto -mx-4 lg:mx-0">
        <div className="min-w-full inline-block align-middle">
          <table 
            className="w-full min-w-[600px]"
            role="table"
            aria-label="Alternative AI models ranked by performance"
          >
            <thead>
              <tr className="border-b border-gray-200">
                <th 
                  className="text-left py-2 lg:py-3 px-2 lg:px-4 font-semibold text-gray-900 text-sm lg:text-base"
                  scope="col"
                  aria-label="Model ranking position"
                >
                  <div className="flex items-center space-x-1">
                    <span>Rank</span>
                  </div>
                </th>
                <th 
                  className="text-left py-2 lg:py-3 px-2 lg:px-4 font-semibold text-gray-900 text-sm lg:text-base"
                  scope="col"
                  aria-label="AI model name"
                >
                  <div className="flex items-center space-x-1">
                    <span>Model Name</span>
                    <ArrowUpDown className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" aria-hidden="true" />
                  </div>
                </th>
                <th 
                  className="text-left py-2 lg:py-3 px-2 lg:px-4 font-semibold text-gray-900 text-sm lg:text-base"
                  scope="col"
                  aria-label="Performance score percentage"
                >
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" aria-hidden="true" />
                    <span className="hidden sm:inline">Performance</span>
                    <span className="sm:hidden">Perf</span>
                  </div>
                </th>
                <th 
                  className="text-left py-2 lg:py-3 px-2 lg:px-4 font-semibold text-gray-900 text-sm lg:text-base"
                  scope="col"
                  aria-label="Response latency in milliseconds"
                >
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" aria-hidden="true" />
                    <span>Latency</span>
                  </div>
                </th>
                <th 
                  className="text-left py-2 lg:py-3 px-2 lg:px-4 font-semibold text-gray-900 text-sm lg:text-base"
                  scope="col"
                  aria-label="Cost level"
                >
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" aria-hidden="true" />
                    <span>Cost</span>
                  </div>
                </th>
                <th 
                  className="text-left py-2 lg:py-3 px-2 lg:px-4 font-semibold text-gray-900 text-sm lg:text-base"
                  scope="col"
                  aria-label="Scalability rating"
                >
                  <div className="flex items-center space-x-1">
                    <BarChart3 className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" aria-hidden="true" />
                    <span className="hidden sm:inline">Scalability</span>
                    <span className="sm:hidden">Scale</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {alternatives.map((model, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-3 lg:py-4 px-2 lg:px-4">
                    <div 
                      className="flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 bg-primary-100 text-primary-700 rounded-full text-xs lg:text-sm font-semibold"
                      aria-label={`Rank ${model.rank}`}
                    >
                      {model.rank}
                    </div>
                  </td>
                  <td className="py-3 lg:py-4 px-2 lg:px-4">
                    <div className="font-medium text-gray-900 text-sm lg:text-base truncate max-w-[120px] lg:max-w-none">
                      {model.name}
                    </div>
                  </td>
                  <td className="py-3 lg:py-4 px-2 lg:px-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full text-xs font-medium ${getPerformanceColor(
                          model.performanceScore
                        )}`}
                        aria-label={`Performance score: ${model.performanceScore} percent`}
                      >
                        {model.performanceScore}%
                      </div>
                    </div>
                  </td>
                  <td className="py-3 lg:py-4 px-2 lg:px-4">
                    <div 
                      className="text-xs lg:text-sm text-gray-900"
                      aria-label={`${model.latency} milliseconds latency`}
                    >
                      {model.latency}ms
                    </div>
                  </td>
                  <td className="py-3 lg:py-4 px-2 lg:px-4">
                    <div 
                      className="text-xs lg:text-sm text-gray-900"
                      aria-label={`Cost level: ${model.cost}`}
                    >
                      {model.cost}
                    </div>
                  </td>
                  <td className="py-3 lg:py-4 px-2 lg:px-4">
                    <div 
                      className="flex items-center space-x-1"
                      aria-label={`Scalability: ${model.scalability}`}
                    >
                      {getScalabilityIcon(model.scalability)}
                      <span className="text-xs lg:text-sm text-gray-700 capitalize hidden sm:inline">
                        {model.scalability}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {alternatives.length === 0 && (
        <div 
          className="text-center py-8 text-gray-500"
          role="status"
          aria-label="No alternative models available"
        >
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" aria-hidden="true" />
          <p>No alternative models available</p>
        </div>
      )}
    </Card>
  );
};

export default AlternativesTable;