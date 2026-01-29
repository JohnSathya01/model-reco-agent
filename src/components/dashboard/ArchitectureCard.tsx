import React from 'react';
import { Network, Shield, DollarSign, TrendingUp } from 'lucide-react';
import { Card } from '../ui';
import type { ArchitectureRecommendation } from '../../types';

interface ArchitectureCardProps {
  architecture: ArchitectureRecommendation;
  className?: string;
}

const ArchitectureCard: React.FC<ArchitectureCardProps> = ({
  architecture,
  className = ''
}) => {
  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'gateway': return '🚪';
      case 'endpoint': return '🎯';
      case 'storage': return '💾';
      case 'monitoring': return '📊';
      case 'client': return '💻';
      default: return '⚙️';
    }
  };

  return (
    <Card title="🏗️ Architecture Recommendation" className={className}>
      <div className="space-y-6">
        {/* Architecture Components */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Network className="w-4 h-4 mr-2 text-blue-600" />
            System Components
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {architecture.components.map((component, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getComponentIcon(component.type)}</span>
                  <span className="font-medium text-sm text-gray-900">{component.name}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{component.description}</p>
                {component.connections.length > 0 && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Connects to:</span> {component.connections.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scalability Notes */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
            Scalability Considerations
          </h4>
          <ul className="space-y-2">
            {architecture.scalabilityNotes.map((note, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                <span className="text-green-500 mt-1">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Security Notes */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-red-600" />
            Security Recommendations
          </h4>
          <ul className="space-y-2">
            {architecture.securityNotes.map((note, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                <span className="text-red-500 mt-1">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cost Implications */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-yellow-600" />
            Cost Implications
          </h4>
          <ul className="space-y-2">
            {architecture.costImplications.map((note, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                <span className="text-yellow-500 mt-1">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ArchitectureCard;