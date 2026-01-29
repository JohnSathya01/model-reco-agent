import React from 'react';
import ReactFlow, {
  type Node,
  type Edge,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { ArchitecturePipeline, PipelineNode as ArchNode } from '../../utils/architectureGenerator';

interface ArchitectureFlowProps {
  pipeline: ArchitecturePipeline;
  onNodeClick?: (node: ArchNode) => void;
  className?: string;
}

const ArchitectureFlow: React.FC<ArchitectureFlowProps> = ({
  pipeline,
  onNodeClick,
  className = ''
}) => {
  // Convert architecture nodes to React Flow nodes
  const convertToFlowNodes = (): Node[] => {
    const flowNodes: Node[] = [];
    const xSpacing = 280;
    const ySpacing = 180;
    
    // Create a map to track node positions
    const nodePositions = new Map<string, { x: number; y: number }>();
    
    // First, organize nodes by their connections to create a proper flow
    const processedNodes = new Set<string>();
    const nodesByLevel = new Map<number, string[]>();
    
    // Find root nodes (nodes with no incoming connections)
    const hasIncoming = new Set(pipeline.connections.map(c => c.to));
    const rootNodes = pipeline.nodes.filter(n => !hasIncoming.has(n.id));
    
    // Build levels using BFS
    const queue: Array<{ nodeId: string; level: number }> = rootNodes.map(n => ({ nodeId: n.id, level: 0 }));
    const nodeLevels = new Map<string, number>();
    
    while (queue.length > 0) {
      const { nodeId, level } = queue.shift()!;
      
      if (processedNodes.has(nodeId)) continue;
      processedNodes.add(nodeId);
      nodeLevels.set(nodeId, level);
      
      if (!nodesByLevel.has(level)) {
        nodesByLevel.set(level, []);
      }
      nodesByLevel.get(level)!.push(nodeId);
      
      // Find children
      const children = pipeline.connections
        .filter(c => c.from === nodeId)
        .map(c => c.to);
      
      children.forEach(childId => {
        if (!processedNodes.has(childId)) {
          queue.push({ nodeId: childId, level: level + 1 });
        }
      });
    }
    
    // Add any remaining nodes that aren't connected
    pipeline.nodes.forEach(node => {
      if (!processedNodes.has(node.id)) {
        const level = nodesByLevel.size;
        if (!nodesByLevel.has(level)) {
          nodesByLevel.set(level, []);
        }
        nodesByLevel.get(level)!.push(node.id);
        nodeLevels.set(node.id, level);
      }
    });
    
    // Position nodes based on levels
    nodesByLevel.forEach((nodeIds, level) => {
      const startY = level * ySpacing + 100;
      
      nodeIds.forEach((nodeId, index) => {
        const x = 100 + (index * xSpacing);
        const y = startY;
        nodePositions.set(nodeId, { x, y });
      });
    });
    
    // Create React Flow nodes with positions
    pipeline.nodes.forEach(node => {
      const position = nodePositions.get(node.id) || { x: 100, y: 100 };
      
      flowNodes.push({
        id: node.id,
        type: 'custom',
        position,
        data: { 
          ...node,
          onClick: () => onNodeClick?.(node)
        }
      });
    });

    return flowNodes;
  };

  // Convert connections to React Flow edges
  const convertToFlowEdges = (): Edge[] => {
    return pipeline.connections.map((conn, index) => ({
      id: `edge-${index}`,
      source: conn.from,
      target: conn.to,
      label: conn.label,
      type: 'smoothstep',
      animated: true,
      style: { 
        stroke: '#3b82f6', 
        strokeWidth: 3
      },
      labelStyle: { 
        fill: '#1f2937', 
        fontSize: 12, 
        fontWeight: 600,
        backgroundColor: '#ffffff',
        padding: '4px 8px',
        borderRadius: '4px'
      },
      labelBgStyle: { 
        fill: '#ffffff', 
        fillOpacity: 0.95,
        rx: 4,
        ry: 4
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#3b82f6',
        width: 20,
        height: 20
      }
    }));
  };

  const [nodes] = useNodesState(convertToFlowNodes());
  const [edges] = useEdgesState(convertToFlowEdges());

  // Custom node component
  const CustomNode = ({ data }: { data: ArchNode & { onClick: () => void } }) => {
    const getNodeColor = () => {
      switch (data.type) {
        case 'data': return 'bg-blue-50 border-blue-400 hover:bg-blue-100';
        case 'service': return 'bg-green-50 border-green-400 hover:bg-green-100';
        case 'model': return 'bg-purple-50 border-purple-400 hover:bg-purple-100';
        case 'api': return 'bg-yellow-50 border-yellow-400 hover:bg-yellow-100';
        case 'monitoring': return 'bg-gray-50 border-gray-400 hover:bg-gray-100';
        default: return 'bg-white border-gray-300 hover:bg-gray-50';
      }
    };

    return (
      <div
        onClick={data.onClick}
        className={`px-4 py-3 rounded-lg border-2 ${getNodeColor()} cursor-pointer hover:shadow-lg transition-all duration-200 min-w-[220px] max-w-[220px]`}
      >
        <div className="flex items-start space-x-2 mb-2">
          <span className="text-2xl flex-shrink-0">{data.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 leading-tight">{data.label}</div>
            <div className="text-xs text-gray-600 mt-0.5 leading-tight">{data.service}</div>
          </div>
        </div>
        
        {data.modelName && (
          <div className="text-xs text-purple-700 font-medium mt-2 truncate">
            Model: {data.modelName}
          </div>
        )}
        
        {data.instanceType && (
          <div className="text-xs text-gray-600 mt-1 truncate">
            {data.instanceType}
          </div>
        )}
        
        {data.gpu && (
          <div className="text-xs text-green-700 font-medium mt-1 truncate">
            GPU: {data.gpu}
          </div>
        )}
        
        {data.costPerHour && (
          <div className="text-xs font-semibold text-blue-600 mt-2">
            {data.costPerHour}
          </div>
        )}
      </div>
    );
  };

  const nodeTypes = {
    custom: CustomNode
  };

  return (
    <div className={`h-full w-full bg-gray-50 rounded-lg ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 3 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 3 }
        }}
      >
        <Background color="#d1d5db" gap={20} size={1} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            const data = node.data as ArchNode;
            switch (data.type) {
              case 'data': return '#3b82f6';
              case 'service': return '#10b981';
              case 'model': return '#8b5cf6';
              case 'api': return '#f59e0b';
              case 'monitoring': return '#6b7280';
              default: return '#9ca3af';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Panel position="top-left" className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="space-y-2">
            <div className="text-sm font-bold text-gray-900">Pipeline Overview</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Deployment:</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {pipeline.deploymentType}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Inference:</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                  {pipeline.inferenceType}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Training:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  pipeline.trainingRequired 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {pipeline.trainingRequired ? 'Required' : 'Not Required'}
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  {pipeline.nodes.length} nodes • {pipeline.connections.length} connections
                </div>
              </div>
            </div>
          </div>
        </Panel>
        
        <Panel position="top-right" className="bg-white rounded-lg shadow-md border border-gray-200 p-3">
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-gray-900 mb-2">Legend</div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-200 border border-blue-400 rounded"></div>
              <span className="text-gray-700">Data Storage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-200 border border-green-400 rounded"></div>
              <span className="text-gray-700">Service</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-200 border border-purple-400 rounded"></div>
              <span className="text-gray-700">ML Model</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-200 border border-yellow-400 rounded"></div>
              <span className="text-gray-700">API Gateway</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-200 border border-gray-400 rounded"></div>
              <span className="text-gray-700">Monitoring</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

const ArchitectureFlowWrapper: React.FC<ArchitectureFlowProps> = (props) => {
  return (
    <ReactFlowProvider>
      <ArchitectureFlow {...props} />
    </ReactFlowProvider>
  );
};

export default ArchitectureFlowWrapper;
