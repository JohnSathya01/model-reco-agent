import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '../ui';
import type { FinetuningStrategy } from '../../types';

interface FinetuningStrategyCardProps {
  strategy: FinetuningStrategy;
  className?: string;
}

const FinetuningStrategyCard: React.FC<FinetuningStrategyCardProps> = ({
  strategy,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getApproachColor = (approach: string) => {
    switch (approach) {
      case 'Full Finetuning':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'LoRA':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Adapters':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'No Finetuning':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getApproachIcon = (approach: string) => {
    switch (approach) {
      case 'Full Finetuning':
        return <Settings className="w-4 h-4" />;
      case 'LoRA':
        return <Settings className="w-4 h-4" />;
      case 'Adapters':
        return <Settings className="w-4 h-4" />;
      case 'No Finetuning':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <Card title="Finetuning Strategy" className={className}>
      <div className="space-y-4">
        {/* Approach Badge */}
        <div className="flex items-center justify-between">
          <div
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border font-medium ${getApproachColor(
              strategy.approach
            )}`}
          >
            {getApproachIcon(strategy.approach)}
            <span>{strategy.approach}</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <span>Details</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Hyperparameters */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Suggested Hyperparameters</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(strategy.hyperparameters).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Notes */}
        {strategy.riskNotes.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">Risk Considerations</h4>
                <ul className="space-y-1">
                  {strategy.riskNotes.map((note, index) => (
                    <li key={index} className="text-sm text-yellow-700">
                      • {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Strategy Overview</h4>
              <p className="text-sm text-gray-700">
                {strategy.approach === 'Full Finetuning' &&
                  'Complete model retraining on your dataset. Provides maximum customization but requires significant computational resources.'}
                {strategy.approach === 'LoRA' &&
                  'Low-Rank Adaptation technique that fine-tunes only a small subset of parameters. Efficient and effective for most use cases.'}
                {strategy.approach === 'Adapters' &&
                  'Lightweight modules added to pre-trained models. Good balance between performance and efficiency.'}
                {strategy.approach === 'No Finetuning' &&
                  'Use the pre-trained model as-is. Fastest deployment with good general performance.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Training Time</div>
                <div className="text-sm font-medium text-gray-900">
                  {strategy.approach === 'Full Finetuning' && '2-5 days'}
                  {strategy.approach === 'LoRA' && '4-12 hours'}
                  {strategy.approach === 'Adapters' && '6-18 hours'}
                  {strategy.approach === 'No Finetuning' && 'Immediate'}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Resource Usage</div>
                <div className="text-sm font-medium text-gray-900">
                  {strategy.approach === 'Full Finetuning' && 'High'}
                  {strategy.approach === 'LoRA' && 'Low'}
                  {strategy.approach === 'Adapters' && 'Medium'}
                  {strategy.approach === 'No Finetuning' && 'None'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FinetuningStrategyCard;