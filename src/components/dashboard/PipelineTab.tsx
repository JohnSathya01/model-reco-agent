import React, { useState } from 'react';
import { Download, Maximize2, Info } from 'lucide-react';
import ArchitectureFlow from '../pipeline/ArchitectureFlow';
import NodeDetailsPanel from '../pipeline/NodeDetailsPanel';
import PipelineVisualization from '../pipeline/PipelineVisualization';
import { CostCalculator } from './CostCalculator';
import type { ArchitecturePipeline, PipelineNode } from '../../utils/architectureGenerator';
import type { FormData } from '../../types';

interface PipelineTabProps {
  pipeline?: ArchitecturePipeline;
  formData?: FormData;
  className?: string;
}

const PipelineTab: React.FC<PipelineTabProps> = ({
  pipeline,
  formData,
  className = ''
}) => {
  const [selectedNode, setSelectedNode] = useState<PipelineNode | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleNodeClick = (node: PipelineNode) => {
    setSelectedNode(node);
  };

  const handleExport = () => {
    const exportData = {
      pipeline,
      exportedAt: new Date().toISOString(),
      nodes: pipeline?.nodes.length || 0,
      connections: pipeline?.connections.length || 0
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ml-pipeline-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Check if we have the simple ML pipeline
  const hasSimplePipeline = formData?.projectDescription?.generatedPipeline && 
                           formData.projectDescription.generatedPipeline.length > 0;
  
  // Check if we have the detailed architecture pipeline
  const hasArchitecturePipeline = pipeline && pipeline.nodes.length > 0;

  // If neither pipeline exists, show empty state
  if (!hasSimplePipeline && !hasArchitecturePipeline) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pipeline Generated Yet</h3>
          <p className="text-sm text-gray-600 mb-4">
            Generate an ML pipeline from your project description to see the workflow, or generate full recommendations to see the detailed cloud architecture.
          </p>
          <div className="space-y-2 text-xs text-gray-500">
            <p>💡 <strong>Quick Pipeline:</strong> Click "Generate ML Pipeline" in the left panel</p>
            <p>🚀 <strong>Full Architecture:</strong> Fill the form and click "Generate Recommendation"</p>
          </div>
        </div>
      </div>
    );
  }

  const trainingNodes = pipeline?.nodes.filter(n => n.lane === 'training') || [];
  const servingNodes = pipeline?.nodes.filter(n => n.lane === 'serving') || [];
  const bothNodes = pipeline?.nodes.filter(n => n.lane === 'both') || [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Simple ML Pipeline Section */}
      {hasSimplePipeline && (
        <div className="flex-shrink-0">
          <PipelineVisualization 
            steps={formData!.projectDescription.generatedPipeline!}
          />
        </div>
      )}

      {/* Detailed Architecture Pipeline Section */}
      {hasArchitecturePipeline && (
        <>
          {/* Pipeline Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {hasSimplePipeline ? 'Cloud Architecture Pipeline' : 'ML Pipeline Architecture'}
                </h2>
                <p className="text-sm text-gray-600">
                  Interactive visualization of your end-to-end machine learning pipeline with cloud services and deployment topology
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Toggle fullscreen"
                >
                  <Maximize2 className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Export</span>
                </button>
              </div>
            </div>

            {/* Pipeline Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="text-xs text-purple-600 font-medium mb-1">Training Nodes</div>
                <div className="text-2xl font-bold text-purple-900">{trainingNodes.length}</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-xs text-green-600 font-medium mb-1">Serving Nodes</div>
                <div className="text-2xl font-bold text-green-900">{servingNodes.length}</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-xs text-blue-600 font-medium mb-1">Shared Services</div>
                <div className="text-2xl font-bold text-blue-900">{bothNodes.length}</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="text-xs text-gray-600 font-medium mb-1">Total Connections</div>
                <div className="text-2xl font-bold text-gray-900">{pipeline!.connections.length}</div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">How to use this diagram</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Click on any node to view detailed configuration, costs, and security notes</li>
                  <li>• Use mouse wheel to zoom in/out, drag to pan around the diagram</li>
                  <li>• Nodes are color-coded: Blue (Data), Green (Service), Purple (Model), Yellow (API), Gray (Monitoring)</li>
                  <li>• Arrows show data flow direction between services</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Architecture Flow Diagram */}
          <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${
            isFullscreen ? 'fixed inset-0 z-50' : 'h-[600px]'
          }`}>
            <ArchitectureFlow
              pipeline={pipeline!}
              onNodeClick={handleNodeClick}
              className="w-full h-full"
            />
          </div>

          {/* Lane Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🏗️</span>
                <h3 className="text-lg font-semibold text-gray-900">Training Lane</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Services responsible for data processing, model training, and artifact management
              </p>
              <div className="space-y-2">
                {trainingNodes.map((node, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <span>{node.icon}</span>
                    <span className="text-gray-700">{node.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🚀</span>
                <h3 className="text-lg font-semibold text-gray-900">Serving Lane</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Services responsible for model deployment, inference, and API exposure
              </p>
              <div className="space-y-2">
                {servingNodes.map((node, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <span>{node.icon}</span>
                    <span className="text-gray-700">{node.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AWS Cost Calculator */}
          <div className="animate-fadeIn">
            <CostCalculator />
          </div>

          {/* Node Details Panel */}
          {selectedNode && (
            <NodeDetailsPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PipelineTab;
