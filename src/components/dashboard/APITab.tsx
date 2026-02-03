import React, { useState } from 'react';
import { Copy, Check, Code, Globe, Shield, Zap, ArrowRight, Download, FileCode, FolderTree, Play } from 'lucide-react';
import type { APISpecification, APIEndpoint } from '../../utils/apiGenerator';
import { generateMLCode, type CodeType, type GeneratedCode } from '../../utils/mlCodeGenerator';
import type { RecommendationResult, FormData } from '../../types';
import yaml from 'js-yaml';

interface APITabProps {
  apiSpec: APISpecification;
  recommendations: RecommendationResult;
  formData: FormData;
  className?: string;
}

const APITab: React.FC<APITabProps> = ({
  apiSpec,
  recommendations,
  formData,
  className = ''
}) => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint>(apiSpec.endpoints[0]);
  const [activeSubTab, setActiveSubTab] = useState<'specification' | 'code-generator'>('specification');
  const [selectedCodeType, setSelectedCodeType] = useState<CodeType>('training');
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([]);
  const [selectedFile, setSelectedFile] = useState<number>(0);

  // Generate ML code when code type changes
  React.useEffect(() => {
    if (activeSubTab === 'code-generator') {
      const codes = generateMLCode(selectedCodeType, recommendations, formData);
      setGeneratedCodes(codes);
      setSelectedFile(0);
    }
  }, [selectedCodeType, activeSubTab, recommendations, formData]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const downloadAPISpec = (format: 'json' | 'yaml') => {
    const spec = {
      openapi: '3.0.0',
      info: {
        title: 'ML Model Inference API',
        version: apiSpec.version,
        description: 'REST API for machine learning model inference'
      },
      servers: [
        {
          url: apiSpec.baseUrl,
          description: 'Production server'
        }
      ],
      paths: apiSpec.endpoints.reduce((acc, endpoint) => {
        acc[endpoint.path] = {
          [endpoint.method.toLowerCase()]: {
            summary: endpoint.description,
            security: [{ bearerAuth: [] }],
            requestBody: {
              required: true,
              content: {
                [endpoint.request.contentType]: {
                  schema: endpoint.request.schema,
                  example: endpoint.request.example
                }
              }
            },
            responses: {
              '200': {
                description: 'Successful response',
                content: {
                  [endpoint.response.contentType]: {
                    schema: endpoint.response.schema,
                    example: endpoint.response.example
                  }
                }
              }
            }
          }
        };
        return acc;
      }, {} as any),
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer'
          }
        }
      }
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(spec, null, 2);
      filename = `api-spec-${Date.now()}.json`;
      mimeType = 'application/json';
    } else {
      content = yaml.dump(spec);
      filename = `api-spec-${Date.now()}.yaml`;
      mimeType = 'application/x-yaml';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              API Integration & Code Generation
            </h2>
            <p className="text-sm text-gray-600">
              REST API specification and ready-to-use client code for model inference
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              v{apiSpec.version}
            </span>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="mt-6 flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveSubTab('specification')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
              activeSubTab === 'specification'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>API Specification</span>
          </button>
          <button
            onClick={() => setActiveSubTab('code-generator')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
              activeSubTab === 'code-generator'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Code Generator</span>
          </button>
        </div>
      </div>

      {/* API Specification Tab */}
      {activeSubTab === 'specification' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Base URL */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
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
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Available Endpoints</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadAPISpec('json')}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span>JSON</span>
                </button>
                <button
                  onClick={() => downloadAPISpec('yaml')}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span>YAML</span>
                </button>
              </div>
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
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-700">Schema</div>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(selectedEndpoint.request.schema, null, 2), 'request-schema')}
                    className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedEndpoint === 'request-schema' ? (
                      <>
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono">
                    {JSON.stringify(selectedEndpoint.request.schema, null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-700">Example</div>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(selectedEndpoint.request.example, null, 2), 'request-example')}
                    className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedEndpoint === 'request-example' ? (
                      <>
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">Copy</span>
                      </>
                    )}
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-700">Schema</div>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(selectedEndpoint.response.schema, null, 2), 'response-schema')}
                    className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedEndpoint === 'response-schema' ? (
                      <>
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono">
                    {JSON.stringify(selectedEndpoint.response.schema, null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-700">Example</div>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(selectedEndpoint.response.example, null, 2), 'response-example')}
                    className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedEndpoint === 'response-example' ? (
                      <>
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">Copy</span>
                      </>
                    )}
                  </button>
                </div>
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
      )}

      {/* Code Generator Tab */}
      {activeSubTab === 'code-generator' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Code Type Selector - Professional Card Style */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Code Type</h3>
              <p className="text-sm text-gray-600 mt-1">Choose the type of code you want to generate for your ML workflow</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    type: 'training' as CodeType, 
                    label: 'Training Scripts', 
                    icon: Play, 
                    desc: 'Complete SageMaker training scripts with model definition and training loop'
                  },
                  { 
                    type: 'inference' as CodeType, 
                    label: 'Inference Code', 
                    icon: Code, 
                    desc: 'Model serving scripts for real-time predictions and batch processing'
                  },
                  { 
                    type: 'deployment' as CodeType, 
                    label: 'Deployment Scripts', 
                    icon: Zap, 
                    desc: 'Endpoint deployment automation with cost optimization settings'
                  },
                  { 
                    type: 'api-client' as CodeType, 
                    label: 'API Client', 
                    icon: Globe, 
                    desc: 'Python client library for seamless integration with your application'
                  },
                  { 
                    type: 'folder-structure' as CodeType, 
                    label: 'Project Setup', 
                    icon: FolderTree, 
                    desc: 'Complete project structure with setup guide and best practices'
                  }
                ].map(({ type, label, icon: Icon, desc }) => (
                  <button
                    key={type}
                    onClick={() => setSelectedCodeType(type)}
                    className={`text-left p-5 rounded-lg border-2 transition-all ${
                      selectedCodeType === type
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedCodeType === type
                          ? 'bg-green-100'
                          : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          selectedCodeType === type
                            ? 'text-green-600'
                            : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold mb-1 ${
                          selectedCodeType === type
                            ? 'text-green-900'
                            : 'text-gray-900'
                        }`}>
                          {label}
                        </div>
                        <p className={`text-xs ${
                          selectedCodeType === type
                            ? 'text-green-700'
                            : 'text-gray-600'
                        }`}>
                          {desc}
                        </p>
                      </div>
                      {selectedCodeType === type && (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Files */}
          {generatedCodes.length > 0 && (
            <>
              {/* File Tabs - Professional Style */}
              {generatedCodes.length > 1 && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900">Generated Files</h3>
                    <p className="text-sm text-gray-600 mt-1">Select a file to view and copy its contents</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                      {generatedCodes.map((code, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedFile(index)}
                          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all border ${
                            selectedFile === index
                              ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                          }`}
                        >
                          <FileCode className="w-4 h-4" />
                          <span>{code.filename}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Code Display - Professional Style */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FileCode className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {generatedCodes[selectedFile].filename}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {generatedCodes[selectedFile].description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(
                        generatedCodes[selectedFile].content,
                        `ml-code-${selectedFile}`
                      )}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm"
                    >
                      {copiedEndpoint === `ml-code-${selectedFile}` ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-sm font-medium">Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Code Content */}
                <div className="p-6">
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-[600px] overflow-y-auto border border-gray-700">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre">
                      {generatedCodes[selectedFile].content}
                    </pre>
                  </div>
                </div>

                {/* Implementation Guide */}
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Implementation Guide</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <p className="text-xs text-gray-700">
                            Generated for <strong>{recommendations.recommendedModel.name}</strong>
                          </p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <p className="text-xs text-gray-700">
                            Update AWS credentials before running
                          </p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <p className="text-xs text-gray-700">
                            Estimated cost: <strong>{recommendations.computeEstimate.monthlyCost || 'N/A'}</strong>
                          </p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                          <p className="text-xs text-gray-700">
                            Follow PROJECT_STRUCTURE.md for setup
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default APITab;
