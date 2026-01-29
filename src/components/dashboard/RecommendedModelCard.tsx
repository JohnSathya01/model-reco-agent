import React from 'react';
import { Star, Zap, DollarSign, Target } from 'lucide-react';
import { Card } from '../ui';
import type { ModelRecommendation } from '../../types';

interface RecommendedModelCardProps {
  model: ModelRecommendation;
  className?: string;
}

const RecommendedModelCard: React.FC<RecommendedModelCardProps> = ({
  model,
  className = ''
}) => {
  const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'speed':
        return <Zap className="w-4 h-4" />;
      case 'accuracy':
        return <Target className="w-4 h-4" />;
      case 'cost':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'speed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accuracy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cost':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card title="Recommended Model" variant="elevated" className={className}>
      <div className="space-y-4">
        {/* Model Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{model.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{model.type}</p>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">Recommended</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {model.tags.map((tag, index) => (
            <div
              key={index}
              className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getTagColor(tag)}`}
            >
              {getTagIcon(tag)}
              <span>{tag}</span>
            </div>
          ))}
        </div>

        {/* Rationale */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Why this model?</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{model.rationale}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">A+</div>
            <div className="text-xs text-gray-600">Performance</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">Fast</div>
            <div className="text-xs text-gray-600">Inference</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">Low</div>
            <div className="text-xs text-gray-600">Cost</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RecommendedModelCard;