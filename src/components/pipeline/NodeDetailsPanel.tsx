import React from 'react';
import { X, Server, DollarSign, Gauge, Shield, AlertTriangle, Cpu } from 'lucide-react';
import type { PipelineNode } from '../../utils/architectureGenerator';

interface NodeDetailsPanelProps {
  node: PipelineNode | null;
  onClose: () => void;
  className?: string;
}

const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({
  node,
  onClose,
  className = ''
}) => {
  if (!node) return null;

  return (
    <div className={`fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-gray-200 shadow-2xl overflow-y-auto z-50 ${className}`}>
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Node Details</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close panel"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start space-x-3">
          <span className="text-4xl">{node.icon}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-xl font-bold text-gray-900">{node.label}</h4>
            <p className="text-sm text-gray-600 mt-1">{node.service}</p>
          </div>
        </div>

        {/* Purpose */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Server className="w-4 h-4 text-gray-500" />
            <h5 className="text-sm font-semibold text-gray-900">Purpose</h5>
          </div>
          <p className="text-sm text-gray-700">{node.purpose}</p>
        </div>

        {/* Model Information */}
        {node.modelName && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-purple-900 mb-2">Model Information</h5>
            <div className="text-sm text-purple-800">
              <span className="font-medium">Model:</span> {node.modelName}
            </div>
          </div>
        )}

        {/* Instance Details */}
        {node.instanceType && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Cpu className="w-4 h-4 text-gray-500" />
              <h5 className="text-sm font-semibold text-gray-900">Instance Configuration</h5>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Instance Type:</span>
                <span className="font-medium text-gray-900">{node.instanceType}</span>
              </div>
              {node.vcpu && (
                <div className="flex justify-between">
                  <span className="text-gray-600">vCPU:</span>
                  <span className="font-medium text-gray-900">{node.vcpu}</span>
                </div>
              )}
              {node.memory && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory:</span>
                  <span className="font-medium text-gray-900">{node.memory}</span>
                </div>
              )}
              {node.gpu && (
                <div className="flex justify-between">
                  <span className="text-gray-600">GPU:</span>
                  <span className="font-medium text-green-700">{node.gpu}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cost */}
        {node.costPerHour && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <h5 className="text-sm font-semibold text-blue-900">Cost Estimate</h5>
            </div>
            <div className="text-lg font-bold text-blue-700">{node.costPerHour}</div>
            {node.instanceType && (
              <div className="text-xs text-blue-600 mt-2">
                Monthly estimate (24/7): ${calculateMonthlyCost(node.costPerHour)}
              </div>
            )}
          </div>
        )}

        {/* Scaling Behavior */}
        {node.scalingBehavior && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Gauge className="w-4 h-4 text-gray-500" />
              <h5 className="text-sm font-semibold text-gray-900">Scaling Behavior</h5>
            </div>
            <p className="text-sm text-gray-700">{node.scalingBehavior}</p>
          </div>
        )}

        {/* Risks */}
        {node.risks && node.risks.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h5 className="text-sm font-semibold text-gray-900">Potential Risks</h5>
            </div>
            <ul className="space-y-2">
              {node.risks.map((risk, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span className="text-gray-700">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Security Notes */}
        {node.securityNotes && node.securityNotes.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-4 h-4 text-green-500" />
              <h5 className="text-sm font-semibold text-gray-900">Security Considerations</h5>
            </div>
            <ul className="space-y-2">
              {node.securityNotes.map((note, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span className="text-gray-700">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lane Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h5 className="text-sm font-semibold text-gray-900 mb-2">Pipeline Lane</h5>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              node.lane === 'training' 
                ? 'bg-purple-100 text-purple-700'
                : node.lane === 'serving'
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {node.lane === 'training' ? '🏗️ Training' : node.lane === 'serving' ? '🚀 Serving' : '📊 Both'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function calculateMonthlyCost(costPerHour: string): string {
  // Extract numeric value from cost string (e.g., "$0.23/hour" -> 0.23)
  const match = costPerHour.match(/\$?([\d.]+)/);
  if (!match) return 'N/A';
  
  const hourlyRate = parseFloat(match[1]);
  const monthlyRate = hourlyRate * 24 * 30;
  
  return monthlyRate.toFixed(2);
}

export default NodeDetailsPanel;
