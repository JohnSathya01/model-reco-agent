import React from 'react';
import { CheckCircle, Scale, AlertTriangle, Lightbulb } from 'lucide-react';
import { Card } from '../ui';
import type { DecisionRationale } from '../../types';

interface DecisionRationaleCardProps {
  rationale: DecisionRationale;
  className?: string;
}

const DecisionRationaleCard: React.FC<DecisionRationaleCardProps> = ({
  rationale,
  className = ''
}) => {
  const sections = [
    {
      title: 'Constraint Fit',
      items: rationale.constraintFit,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Tradeoffs',
      items: rationale.tradeoffs,
      icon: Scale,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Risks',
      items: rationale.risks,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Assumptions',
      items: rationale.assumptions,
      icon: Lightbulb,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <Card title="Decision Rationale" className={className}>
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Understanding the reasoning behind our recommendation helps you make informed decisions
          about your AI model selection and implementation strategy.
        </p>

        <div className="space-y-4">
          {sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className={`border rounded-lg p-4 ${section.bgColor} ${section.borderColor}`}
            >
              <div className="flex items-center space-x-2 mb-3">
                <section.icon className={`w-5 h-5 ${section.color}`} />
                <h4 className={`text-sm font-semibold ${section.color}`}>
                  {section.title}
                </h4>
              </div>

              {section.items.length > 0 ? (
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${section.color.replace('text-', 'bg-')} mt-2 flex-shrink-0`} />
                      <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No specific {section.title.toLowerCase()} identified for this recommendation.
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary-500">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Summary</h4>
          <p className="text-sm text-gray-700">
            This recommendation balances your specified requirements with industry best practices.
            The selected model and strategy provide an optimal combination of performance, cost-effectiveness,
            and implementation feasibility for your use case.
          </p>
        </div>

        {/* Confidence Score */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-900">Recommendation Confidence</span>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <CheckCircle
                  key={star}
                  className={`w-4 h-4 ${
                    star <= 4 ? 'text-green-500' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">4/5</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DecisionRationaleCard;