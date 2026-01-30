import React, { useState } from 'react';
import { X, Settings, Sparkles, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const AI_MODELS = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Most capable model with advanced reasoning',
    icon: '🤖',
    features: ['Best for complex analysis', 'High accuracy', 'Detailed explanations']
  },
  {
    id: 'claude-3',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Excellent for technical analysis and architecture',
    icon: '🧠',
    features: ['Strong technical reasoning', 'Architecture design', 'Cost optimization']
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Fast and efficient for recommendations',
    icon: '✨',
    features: ['Quick responses', 'Multi-modal support', 'Good for CV tasks']
  },
  {
    id: 'gpt-3.5',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Fast and cost-effective option',
    icon: '⚡',
    features: ['Fastest response', 'Cost-effective', 'Good for simple tasks']
  }
];

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedModel,
  onModelChange 
}) => {
  const [tempSelectedModel, setTempSelectedModel] = useState(selectedModel);

  if (!isOpen) return null;

  const handleSave = () => {
    onModelChange(tempSelectedModel);
    onClose();
  };

  const handleCancel = () => {
    setTempSelectedModel(selectedModel);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity backdrop-blur-sm"
        onClick={handleCancel}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-gray-200 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 rounded-t-2xl border-b border-gray-200">
            <button
              onClick={handleCancel}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg p-2 transition-colors"
              aria-label="Close settings"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm border border-gray-300">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 
                  id="settings-modal-title"
                  className="text-2xl font-bold text-gray-900"
                >
                  Settings
                </h2>
                <p className="text-sm text-gray-600 mt-1">Configure your recommendation preferences</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* AI Model Selection Section */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  AI Model for Recommendations
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Select which AI model to use for generating ML model recommendations, architecture designs, and cost estimates.
              </p>

              {/* Model Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setTempSelectedModel(model.id)}
                    className={`relative text-left p-5 rounded-xl border-2 transition-all ${
                      tempSelectedModel === model.id
                        ? 'border-gray-900 bg-gray-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Selected Indicator */}
                    {tempSelectedModel === model.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Model Info */}
                    <div className="flex items-start space-x-3 mb-3">
                      <span className="text-3xl">{model.icon}</span>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-gray-900">{model.name}</h4>
                        <p className="text-xs text-gray-500 font-medium">{model.provider}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{model.description}</p>

                    {/* Features */}
                    <div className="space-y-1.5">
                      {model.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    Multi-Model Support
                  </h4>
                  <p className="text-xs text-blue-800">
                    Different AI models excel at different tasks. GPT-4 provides the most comprehensive analysis, 
                    Claude excels at technical architecture, Gemini is optimized for speed, and GPT-3.5 offers 
                    the fastest responses for simpler recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 rounded-b-2xl border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
