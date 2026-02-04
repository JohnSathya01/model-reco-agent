import React, { useState } from 'react';
import { Eye, FileText, Lock, Search } from 'lucide-react';

const ViewerDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - only assigned/shared recommendations
  const sharedRecommendations = [
    {
      id: 1,
      name: 'E-commerce Recommendation System',
      owner: 'Sarah Chen',
      type: 'LLM',
      model: 'GPT-4',
      platform: 'AWS SageMaker',
      sharedDate: '2 days ago',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Real-time Object Detection',
      owner: 'John Doe',
      type: 'Computer Vision',
      model: 'YOLOv8',
      platform: 'Azure ML',
      sharedDate: '5 days ago',
      status: 'In Review',
    },
    {
      id: 3,
      name: 'Customer Support Chatbot',
      owner: 'Mike Johnson',
      type: 'LLM',
      model: 'Claude 3',
      platform: 'GCP Vertex AI',
      sharedDate: '1 week ago',
      status: 'Active',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Viewer Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">View shared recommendations and reports</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Read-Only Access</span>
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Limited Access</p>
            <p className="text-sm text-blue-700 mt-1">
              You have read-only access to shared recommendations. Contact your administrator to request additional permissions.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shared With Me</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{sharedRecommendations.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">2</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recent Updates</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search shared recommendations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Shared Recommendations */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900">Shared Recommendations</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {sharedRecommendations.map((rec) => (
              <div key={rec.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{rec.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        rec.status === 'Active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-600">Owner</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{rec.owner}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Type</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{rec.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Model</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{rec.model}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Platform</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{rec.platform}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                      <span>Shared {rec.sharedDate}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>Read-only</span>
                      </span>
                    </div>
                  </div>

                  <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State (if no recommendations) */}
        {sharedRecommendations.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Shared Recommendations</h3>
            <p className="text-gray-600">
              You don't have access to any recommendations yet. Contact your team to get access.
            </p>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need More Access?</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you need to create recommendations or access additional features, please contact your administrator to upgrade your account.
          </p>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            Contact Administrator
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewerDashboard;
