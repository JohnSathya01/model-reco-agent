import React, { useState } from 'react';
import { Copy, Check, Code, Globe, Shield, Zap, ArrowRight } from 'lucide-react';
import type { APISpecification, APIEndpoint } from '../../utils/apiGenerator';

interface APITabProps {
  apiSpec: APISpecification;
  className?: string;
}

const APITab: React.FC<APITabProps> = ({
  apiSpec,
  className = ''
}) => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint>(apiSpec.endpoints[0]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const generateCurlCommand = (endpoint: APIEndpoint) => {
    const exampleBody = JSON.stringify(endpoint.request.example, null, 2);
    return `curl -X ${endpoint.method} "${apiSpec.baseUrl}${endpoint.path}" \\
  -H "Content-Type: ${endpoint.request.contentType}" \\
  -H "Authorization: ${endpoint.authentication}" \\
  -d '${exampleBody}'`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* API Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Inference API Specification
            </h2>
            <p className="text-sm text-gray-600">
              REST API endpoints for model inference with request/response schemas and examples
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              v{apiSpec.version}
            </span>
          </div>
        </div>

        {/* Base URL */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-xs text-gray-600 font-medium mb-1">Base URL</div>
                <code className="text-sm text-gray-900 font-mono">{apiSpec.baseUrl}</code>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(apiSpec.baseUrl, 'base-url')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copiedEndpoint === 'base-url' ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* API Flow Visualization */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Request Flow</h3>
        <div className="flex items-center justify-between overflow-x-auto pb-4">
          {apiSpec.flow.steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex-shrink-0 text-center min-w-[140px]">
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-2">
                  <div className="text-sm font-semibold text-blue-900 mb-1">{step.name}</div>
                  <div className="text-xs text-blue-700">{step.description}</div>
                  <div className="text-xs font-medium text-blue-600 mt-2">{step.latency}</div>
                </div>
              </div>
              {index < apiSpec.flow.steps.length - 1 && (
                <ArrowRight className="w-6 h-6 text-blue-400 flex-shrink-0 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Endpoints List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900">Available Endpoints</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {apiSpec.endpoints.map((endpoint, index) => (
            <button
              key={index}
              onClick={() => setSelectedEndpoint(endpoint)}
              className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                selectedEndpoint === endpoint ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    endpoint.method === 'POST' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-gray-900">{endpoint.path}</code>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mt-2">{endpoint.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Endpoint Details */}
      {selectedEndpoint && (
        <div className="space-y-6">
          {/* Endpoint Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`px-3 py-1 rounded text-sm font-bold ${
                    selectedEndpoint.method === 'POST' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedEndpoint.method}
                  </span>
                  <code className="text-lg font-mono text-gray-900">{selectedEndpoint.path}</code>
                </div>
                <p className="text-sm text-gray-600">{selectedEndpoint.description}</p>
              </div>
            </div>

            {/* Authentication & Rate Limit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-600 font-medium mb-1">Authentication</div>
                  <div className="text-sm text-gray-900">{selectedEndpoint.authentication}</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-xs text-gray-600 font-medium mb-1">Rate Limit</div>
                  <div className="text-sm text-gray-900">{selectedEndpoint.rateLimit}</div>
                </div>
              </div>
            </div>

            {/* SLA */}
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-gray-900 mb-3">Service Level Agreement (SLA)</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Latency:</span>
                  <span className="ml-2 font-medium text-gray-900">{selectedEndpoint.sla.latency}</span>
                </div>
                <div>
                  <span className="text-gray-600">Availability:</span>
                  <span className="ml-2 font-medium text-gray-900">{selectedEndpoint.sla.availability}</span>
                </div>
                <div>
                  <span className="text-gray-600">Throughput:</span>
                  <span className="ml-2 font-medium text-gray-900">{selectedEndpoint.sla.throughput}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Request Schema */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Request</h4>
              <span className="text-xs text-gray-600 font-mono">{selectedEndpoint.request.contentType}</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Schema</div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono">
                    {JSON.stringify(selectedEndpoint.request.schema, null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Example</div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-blue-400 font-mono">
                    {JSON.stringify(selectedEndpoint.request.example, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Response Schema */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Response</h4>
              <span className="text-xs text-gray-600 font-mono">{selectedEndpoint.response.contentType}</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Schema</div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono">
                    {JSON.stringify(selectedEndpoint.response.schema, null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Example</div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-purple-400 font-mono">
                    {JSON.stringify(selectedEndpoint.response.example, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* cURL Example */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-gray-500" />
                <h4 className="text-lg font-semibold text-gray-900">cURL Example</h4>
              </div>
              <button
                onClick={() => copyToClipboard(generateCurlCommand(selectedEndpoint), 'curl')}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {copiedEndpoint === 'curl' ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600 font-medium">Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                {generateCurlCommand(selectedEndpoint)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APITab;
