import React, { useState } from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Select } from '../ui';
import { DEPLOYMENT_PLATFORM_OPTIONS } from '../../types';
import type { ProjectDescription } from '../../types';

interface ProjectDescriptionFormProps {
  value: ProjectDescription;
  onChange: (description: ProjectDescription) => void;
  className?: string;
  deploymentPlatform?: string;
  onDeploymentPlatformChange?: (platform: string) => void;
}

const ProjectDescriptionForm: React.FC<ProjectDescriptionFormProps> = ({
  value,
  onChange,
  className = '',
  deploymentPlatform = 'AWS SageMaker',
  onDeploymentPlatformChange
}) => {
  const [focused, setFocused] = useState(false);

  const exampleDescriptions = [
    "We need to detect damaged power poles from drone images deployed on edge devices with low latency.",
    "Build a customer support chatbot that can handle 1000+ concurrent users with context-aware responses.",
    "Create a document summarization system for legal contracts with high accuracy requirements.",
    "Develop real-time object detection for autonomous vehicles with sub-100ms latency."
  ];

  const handleDescriptionChange = (description: string) => {
    onChange({
      ...value,
      description
    });
  };

  const handleExampleClick = (example: string) => {
    handleDescriptionChange(example);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-5 ${className}`}>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900">Project Description</h3>
            <p className="text-sm text-gray-600 mt-1">
              Describe your business problem in plain English. Our AI will analyze your description and generate an optimized ML pipeline with recommendations.
            </p>
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <label htmlFor="project-description" className="block text-sm font-medium text-gray-700">
            Business Problem Description <span className="text-red-500">*</span>
          </label>
          
          <textarea
            id="project-description"
            value={value.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Describe your business problem, requirements, and constraints..."
            rows={4}
            className={`
              w-full px-4 py-3 border rounded-lg resize-none transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${focused ? 'border-blue-300' : 'border-gray-300'}
              ${value.description ? 'bg-white' : 'bg-gray-50'}
            `}
            aria-describedby="description-help"
          />

          <p id="description-help" className="text-xs text-gray-500">
            Include details about your data, performance requirements, deployment constraints, and business goals.
          </p>
        </div>

        {/* Deployment Platform Dropdown */}
        <div className="space-y-2">
          <Select
            label="Deployment Platform"
            name="deploymentPlatform"
            options={DEPLOYMENT_PLATFORM_OPTIONS}
            placeholder="Select deployment platform"
            required
            value={deploymentPlatform}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onDeploymentPlatformChange?.(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Choose your preferred cloud platform for ML deployment
          </p>
        </div>

        {/* Example Descriptions */}
        {!value.description && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Example Descriptions:</h4>
            <div className="space-y-2">
              {exampleDescriptions.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 text-sm text-gray-700 hover:text-blue-700"
                >
                  <div className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-gray-400 hover:text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{example}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDescriptionForm;