import React, { useState } from 'react';
import { Download, Copy, Check, FileText, Eye, EyeOff } from 'lucide-react';
import { Card, Button } from '../ui';
import { formatJSON } from '../../utils/formatters';
import type { RecommendationResult, FormData as AppFormData } from '../../types';

interface ConfigurationExportCardProps {
  recommendation: RecommendationResult;
  formData: AppFormData;
  className?: string;
}

const ConfigurationExportCard: React.FC<ConfigurationExportCardProps> = ({
  recommendation,
  formData,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Create comprehensive configuration object
  const configuration = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    userInputs: formData,
    recommendation: {
      model: recommendation.recommendedModel,
      finetuningStrategy: recommendation.finetuningStrategy,
      computeEstimate: recommendation.computeEstimate,
      alternatives: recommendation.alternatives.slice(0, 3), // Top 3 alternatives
    },
    rationale: recommendation.rationale,
    metadata: {
      generatedBy: 'AI Model & Finetuning Decision Intelligence Platform',
      confidenceScore: 0.85,
      reviewRequired: false
    }
  };

  const jsonString = formatJSON(configuration);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleDownload = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-model-recommendation-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const previewLines = jsonString.split('\n').slice(0, 8);
  const displayJson = isExpanded ? jsonString : previewLines.join('\n') + '\n  ...';

  return (
    <Card title="Configuration Export" className={className}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Export your recommendation configuration for implementation, sharing, or future reference.
        </p>

        {/* JSON Preview */}
        <div className="relative">
          <div 
            className="bg-gray-900 rounded-lg p-4 overflow-x-auto"
            role="region"
            aria-label="JSON configuration preview"
          >
            <pre 
              className="text-sm text-gray-300 font-mono whitespace-pre-wrap"
              aria-label="Configuration JSON content"
            >
              {displayJson}
            </pre>
          </div>
          
          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute top-2 right-2 flex items-center space-x-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label={isExpanded ? 'Collapse JSON preview' : 'Expand JSON preview'}
            aria-expanded={isExpanded}
          >
            {isExpanded ? <EyeOff className="w-3 h-3" aria-hidden="true" /> : <Eye className="w-3 h-3" aria-hidden="true" />}
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={handleDownload}
            variant="primary"
            size="md"
            className="flex-1 text-sm"
            aria-describedby="download-help"
          >
            <Download className="w-4 h-4 mr-2" aria-hidden="true" />
            Download Config
          </Button>
          
          <Button
            onClick={handleCopy}
            variant="outline"
            size="md"
            className="flex-1 text-sm"
            aria-describedby="copy-help"
            aria-live="polite"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-600" aria-hidden="true" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
                Copy JSON
              </>
            )}
          </Button>
        </div>
        
        {/* Hidden help text for screen readers */}
        <div className="sr-only">
          <p id="download-help">Downloads the configuration as a JSON file to your device</p>
          <p id="copy-help">Copies the JSON configuration to your clipboard</p>
        </div>

        {/* Configuration Details */}
        <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Configuration Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-sm">
            <div>
              <span className="text-gray-600">Format:</span>
              <span className="ml-2 font-medium text-gray-900">JSON</span>
            </div>
            <div>
              <span className="text-gray-600">Size:</span>
              <span className="ml-2 font-medium text-gray-900">
                {(new Blob([jsonString]).size / 1024).toFixed(1)} KB
              </span>
            </div>
            <div>
              <span className="text-gray-600">Version:</span>
              <span className="ml-2 font-medium text-gray-900">1.0.0</span>
            </div>
            <div>
              <span className="text-gray-600">Generated:</span>
              <span className="ml-2 font-medium text-gray-900">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Usage Instructions</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use this configuration to reproduce the same recommendation</li>
                <li>• Share with your team for collaborative decision-making</li>
                <li>• Import into your ML pipeline or deployment tools</li>
                <li>• Keep as documentation for model selection rationale</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConfigurationExportCard;