import React from 'react';
import { 
  Database, 
  CheckCircle, 
  Settings, 
  Target, 
  Wrench, 
  BarChart3, 
  Cloud, 
  Activity,
  ArrowRight,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Card } from '../ui';
import type { PipelineStep } from '../../types';

interface PipelineVisualizationProps {
  steps: PipelineStep[];
  className?: string;
}

const PipelineVisualization: React.FC<PipelineVisualizationProps> = ({
  steps,
  className = ''
}) => {
  const getStepIcon = (stepName: string) => {
    const name = stepName.toLowerCase();
    if (name.includes('ingestion')) return Database;
    if (name.includes('validation')) return CheckCircle;
    if (name.includes('preprocessing')) return Settings;
    if (name.includes('selection')) return Target;
    if (name.includes('finetuning')) return Wrench;
    if (name.includes('evaluation')) return BarChart3;
    if (name.includes('deployment')) return Cloud;
    if (name.includes('monitoring')) return Activity;
    return Settings;
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'active': return <Clock className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (steps.length === 0) {
    return null;
  }

  return (
    <Card title="🎯 Generated ML Pipeline" className={className}>
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Based on your project description, here's the recommended ML pipeline with automated tool selection and compute optimization.
        </p>

        {/* Pipeline Flow */}
        <div className="relative">
          {/* Desktop View */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-4 overflow-x-auto pb-4">
              {steps.map((step, index) => {
                const IconComponent = getStepIcon(step.name);
                const isLast = index === steps.length - 1;
                
                return (
                  <div key={step.id} className="flex items-center space-x-4 flex-shrink-0">
                    <div className={`relative p-4 rounded-xl border-2 min-w-[200px] ${getStepColor(step.status)}`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium text-sm">{step.name}</span>
                        </div>
                        {getStatusIcon(step.status)}
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-medium text-gray-700">Tools:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {step.tools.map((tool, toolIndex) => (
                              <span key={toolIndex} className="px-2 py-1 bg-white bg-opacity-60 rounded text-xs">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700">Compute:</span>
                          <span className="ml-1">{step.computeNeeds}</span>
                        </div>
                        
                        {step.riskNotes.length > 0 && (
                          <div className="flex items-start space-x-1">
                            <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-amber-700">{step.riskNotes[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!isLast && (
                      <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden space-y-4">
            {steps.map((step, index) => {
              const IconComponent = getStepIcon(step.name);
              const isLast = index === steps.length - 1;
              
              return (
                <div key={step.id} className="space-y-3">
                  <div className={`p-4 rounded-xl border-2 ${getStepColor(step.status)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-5 h-5" />
                        <span className="font-medium text-sm">{step.name}</span>
                      </div>
                      {getStatusIcon(step.status)}
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-medium text-gray-700">Tools:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {step.tools.map((tool, toolIndex) => (
                            <span key={toolIndex} className="px-2 py-1 bg-white bg-opacity-60 rounded text-xs">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Compute:</span>
                        <span className="ml-1">{step.computeNeeds}</span>
                      </div>
                      
                      {step.riskNotes.length > 0 && (
                        <div className="flex items-start space-x-1">
                          <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span className="text-amber-700">{step.riskNotes[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!isLast && (
                    <div className="flex justify-center">
                      <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Pipeline Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Steps:</span>
              <span className="ml-2 font-medium text-gray-900">{steps.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Estimated Duration:</span>
              <span className="ml-2 font-medium text-gray-900">2-4 weeks</span>
            </div>
            <div>
              <span className="text-gray-600">Complexity:</span>
              <span className="ml-2 font-medium text-gray-900">
                {steps.length <= 4 ? 'Low' : steps.length <= 6 ? 'Medium' : 'High'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PipelineVisualization;