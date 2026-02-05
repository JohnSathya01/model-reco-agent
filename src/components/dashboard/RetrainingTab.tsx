import React from 'react';
import { RefreshCw, Database, Cpu, Cloud, TestTube } from 'lucide-react';

// Environment-aware Daggr URL
const DAGGR_URL = import.meta.env.VITE_DAGGR_URL || 'http://127.0.0.1:7865';

export const RetrainingTab: React.FC = () => {
  return (
    <div className="w-full h-full p-6">
      {/* Header Section */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <RefreshCw className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Model Retraining Workflow
            </h2>
            <p className="text-gray-600 mt-2">
              Use this interactive workflow to retrain your recommended model with custom data.
              The workflow guides you through dataset preparation, training, deployment, and testing.
            </p>
            
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Daggr Server Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">4 Workflow Stages</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Visual Pipeline</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Steps Overview */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-2">
            <Database className="w-5 h-5 text-blue-600" />
            <div className="text-sm font-semibold text-gray-900">1. Dataset Prep</div>
          </div>
          <div className="text-xs text-gray-500">
            Configure S3 URI and validation split
          </div>
        </div>
        
        <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-2">
            <Cpu className="w-5 h-5 text-green-600" />
            <div className="text-sm font-semibold text-gray-900">2. Training</div>
          </div>
          <div className="text-xs text-gray-500">
            Set epochs, batch size, and LoRA options
          </div>
        </div>
        
        <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-2">
            <Cloud className="w-5 h-5 text-purple-600" />
            <div className="text-sm font-semibold text-gray-900">3. Deployment</div>
          </div>
          <div className="text-xs text-gray-500">
            Deploy to endpoint with autoscaling
          </div>
        </div>
        
        <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-2">
            <TestTube className="w-5 h-5 text-orange-600" />
            <div className="text-sm font-semibold text-gray-900">4. Inference</div>
          </div>
          <div className="text-xs text-gray-500">
            Test the deployed model
          </div>
        </div>
      </div>

      {/* Daggr Workflow Iframe */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-4 text-sm text-gray-600 font-medium">
                Daggr Workflow Canvas
              </span>
            </div>
            <a
              href={DAGGR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Open in new window →
            </a>
          </div>
        </div>
        
        <iframe
          src={DAGGR_URL}
          className="w-full h-[calc(100vh-450px)] min-h-[600px] border-0 bg-black"
          title="Daggr Retraining Workflow"
          allow="clipboard-write"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />
      </div>

      {/* Help Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            💡 How to Use
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Run each stage sequentially from left to right</li>
            <li>• Click "Run" button on each node to execute</li>
            <li>• Orange connections = fresh data flow</li>
            <li>• Gray connections = stale, needs rerun</li>
          </ul>
        </div>
        
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="text-sm font-semibold text-purple-900 mb-2">
            🎯 Quick Tips
          </h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Use ◀ ▶ arrows to browse result history</li>
            <li>• Zoom with mouse wheel or controls</li>
            <li>• Click and drag to pan the canvas</li>
            <li>• Each sheet saves independent state</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
