import React from 'react';
import { X, Layers, DollarSign, Calendar, TrendingUp } from 'lucide-react';

interface Architecture {
  id: number;
  name: string;
  type: string;
  platform: string;
  status: string;
  cost: string;
  complexity?: string;
  created?: string;
}

interface ArchitectureDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  architecture: Architecture | null;
}

const ArchitectureDetailModal: React.FC<ArchitectureDetailModalProps> = ({
  isOpen,
  onClose,
  architecture,
}) => {
  if (!isOpen || !architecture) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{architecture.name}</h3>
                  <p className="text-sm text-blue-100">{architecture.type}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Status Badge */}
            <div className="mb-6">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                architecture.status === 'Active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {architecture.status}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Monthly Cost</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{architecture.cost}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Layers className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Platform</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{architecture.platform}</p>
              </div>

              {architecture.complexity && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Complexity</span>
                  </div>
                  <p className={`text-2xl font-bold ${
                    architecture.complexity === 'High' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {architecture.complexity}
                  </p>
                </div>
              )}

              {architecture.created && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Created</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{architecture.created}</p>
                </div>
              )}
            </div>

            {/* Architecture Description */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Architecture Overview</h4>
              <p className="text-gray-600 leading-relaxed">
                This {architecture.type} architecture is deployed on {architecture.platform} with a monthly operational cost of {architecture.cost}. 
                The system is currently {architecture.status.toLowerCase()} and serving production traffic.
              </p>
            </div>

            {/* Components Section */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Components</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Model Serving</span>
                  <span className="text-sm text-gray-600">SageMaker Endpoint</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Data Storage</span>
                  <span className="text-sm text-gray-600">S3 Bucket</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-900">Monitoring</span>
                  <span className="text-sm text-gray-600">CloudWatch</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit Architecture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDetailModal;
