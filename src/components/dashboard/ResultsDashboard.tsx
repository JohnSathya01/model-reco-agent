import React, { useState } from 'react';
import { AlertCircle, Loader2, BarChart3, Settings, GitBranch, Code } from 'lucide-react';
import {
  RecommendedModelCard,
  AlternativesTable,
  FinetuningStrategyCard,
  ComputeCostCard,
  ConfigurationExportCard,
  RiskAnalysisCard,
  InstanceRecommendationsCard
} from './index';
import PipelineTab from './PipelineTab';
import APITab from './APITab';
import type { RecommendationResult, FormData as AppFormData } from '../../types';

interface ResultsDashboardProps {
  recommendations: RecommendationResult | null;
  formData: AppFormData | null;
  loading: boolean;
  error: string | null;
  activeTab?: 'overview' | 'pipeline' | 'analysis' | 'api';
  onTabChange?: (tab: 'overview' | 'pipeline' | 'analysis' | 'api') => void;
  className?: string;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  recommendations,
  formData,
  loading,
  error,
  activeTab: externalActiveTab,
  onTabChange,
  className = ''
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<'overview' | 'pipeline' | 'analysis' | 'api'>('overview');
  
  // Use external tab if provided, otherwise use internal state
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const setActiveTab = onTabChange || setInternalActiveTab;

  // Check if API is required
  const isApiRequired = formData?.projectDetails?.apiRequired ?? true;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
    { id: 'analysis', label: 'Analysis', icon: Settings },
    ...(isApiRequired ? [{ id: 'api', label: 'Integration', icon: Code }] : [])
  ];
  // Loading state
  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div 
            className="flex flex-col items-center space-y-4"
            role="status"
            aria-live="polite"
            aria-label="Loading recommendations"
          >
            <Loader2 
              className="h-8 w-8 animate-spin text-blue-600" 
              aria-hidden="true"
            />
            <p className="text-gray-600">
              Analyzing your requirements and generating optimal model recommendations...
            </p>
            <div 
              className="w-full max-w-xs bg-gray-200 rounded-full h-2"
              role="progressbar"
              aria-label="Loading progress"
              aria-valuenow={60}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`${className}`}>
        <div className="bg-red-50 rounded-lg border border-red-200 p-6">
          <div 
            className="flex items-center space-x-3 text-red-700"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - but check if we have a generated pipeline
  if (!recommendations) {
    // Check if we have a generated pipeline in formData
    const hasGeneratedPipeline = formData?.projectDescription?.generatedPipeline && 
                                 formData.projectDescription.generatedPipeline.length > 0;
    
    if (hasGeneratedPipeline) {
      // Show tabs with Pipeline tab available
      return (
        <div className={`space-y-6 min-h-screen ${className}`}>
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg border border-gray-200 p-1">
            <nav className="flex space-x-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isDisabled = tab.id !== 'pipeline';
                return (
                  <button
                    key={tab.id}
                    onClick={() => !isDisabled && setActiveTab(tab.id as any)}
                    disabled={isDisabled}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Show Pipeline Tab */}
          {activeTab === 'pipeline' && (
            <div className="animate-fadeIn">
              <PipelineTab 
                formData={formData}
              />
            </div>
          )}

          {/* Show message for other tabs */}
          {activeTab !== 'pipeline' && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="space-y-4">
                <div 
                  className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"
                  role="img"
                  aria-label="Waiting for input"
                >
                  <svg 
                    className="w-8 h-8 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Generate Full Recommendations</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Fill out the complete form on the left and click "Generate Recommendation" to see detailed model recommendations, cost analysis, and more.
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Original empty state when no pipeline and no recommendations
    return (
      <div className={`${className}`}>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="space-y-4">
            <div 
              className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center"
              role="img"
              aria-label="Waiting for input"
            >
              <svg 
                className="w-8 h-8 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Ready to Generate Recommendations</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter your project requirements in the form on the left, then click “Generate Recommendation” to receive AI model suggestions tailored to your needs.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Results state with multi-tab interface
  return (
    <div className={`space-y-6 min-h-screen bg-gray-50 ${className}`}>
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-1">
        <nav className="flex space-x-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recommended Model Card */}
          <div className="animate-fadeIn">
            <RecommendedModelCard model={recommendations.recommendedModel} />
          </div>

          {/* Alternatives Table */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <AlternativesTable alternatives={recommendations.alternatives} />
          </div>

          {/* Finetuning Strategy */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <FinetuningStrategyCard strategy={recommendations.finetuningStrategy} />
          </div>

          {/* Compute Cost Estimation */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <ComputeCostCard estimate={recommendations.computeEstimate} />
          </div>

          {/* Instance Recommendations */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <InstanceRecommendationsCard instances={recommendations.instanceRecommendations} />
          </div>

          {/* Configuration Export */}
          {formData && (
            <div className="animate-fadeIn" style={{ animationDelay: '0.5s' }}>
              <ConfigurationExportCard 
                recommendation={recommendations} 
                formData={formData}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="animate-fadeIn">
          <PipelineTab 
            pipeline={recommendations.architecturePipeline} 
            formData={formData || undefined}
          />
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {/* Risk Analysis */}
          <div className="animate-fadeIn">
            <RiskAnalysisCard riskAnalysis={recommendations.riskAnalysis} />
          </div>
        </div>
      )}

      {activeTab === 'api' && isApiRequired && (
        <div className="animate-fadeIn">
          <APITab 
            apiSpec={recommendations.apiSpecification}
            recommendations={recommendations}
            formData={formData!}
          />
        </div>
      )}
    </div>
  );
};

export default ResultsDashboard;