import React, { useState } from 'react';
import { Layers, DollarSign, Plus, Search, Clock, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ArchitectureDetailModal from '../components/ui/ArchitectureDetailModal';
import { ApprovalStatusBadge } from '../components/approval';

const ArchitectDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArchitecture, setSelectedArchitecture] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data
  const pendingApprovals = [
    {
      id: 'rec-001',
      title: 'Image Classification Model',
      submittedBy: 'John Doe',
      submittedAt: '2 hours ago',
      estimatedCost: '$8,500/month',
      priority: 'high',
      type: 'Computer Vision',
      requiresBudgetApproval: true,
    },
    {
      id: 'rec-002',
      title: 'Customer Support Chatbot',
      submittedBy: 'Jane Smith',
      submittedAt: '5 hours ago',
      estimatedCost: '$12,450/month',
      priority: 'medium',
      type: 'LLM',
      requiresBudgetApproval: true,
    },
    {
      id: 'rec-003',
      title: 'Sentiment Analysis Pipeline',
      submittedBy: 'Mike Johnson',
      submittedAt: '1 day ago',
      estimatedCost: '$3,200/month',
      priority: 'low',
      type: 'NLP',
      requiresBudgetApproval: false,
    },
  ];

  const myArchitectures = [
    {
      id: 1,
      name: 'E-commerce Recommendation System',
      type: 'LLM',
      platform: 'AWS SageMaker',
      status: 'Active',
      cost: '$2,450/mo',
      created: '2 days ago',
      complexity: 'High',
    },
    {
      id: 2,
      name: 'Real-time Object Detection',
      type: 'Computer Vision',
      platform: 'Azure ML',
      status: 'In Review',
      cost: '$1,850/mo',
      created: '5 days ago',
      complexity: 'Medium',
    },
    {
      id: 3,
      name: 'Customer Support Chatbot',
      type: 'LLM',
      platform: 'GCP Vertex AI',
      status: 'Active',
      cost: '$3,200/mo',
      created: '1 week ago',
      complexity: 'High',
    },
  ];

  const teamArchitectures = [
    {
      id: 4,
      name: 'Image Classification Pipeline',
      type: 'Computer Vision',
      owner: 'Sarah Chen',
      platform: 'AWS SageMaker',
      status: 'Active',
      cost: '$1,200/mo',
    },
    {
      id: 5,
      name: 'Document Summarization',
      type: 'LLM',
      owner: 'Mike Johnson',
      platform: 'Azure ML',
      status: 'Draft',
      cost: '$980/mo',
    },
  ];

  const handleNewArchitecture = () => {
    // Navigate to the main app (recommendation generator)
    navigate('/generate');
  };

  const handleReviewApproval = (recId: string) => {
    // Navigate to the recommendation for review
    console.log('Review approval:', recId);
    navigate('/generate'); // In production, would navigate to specific recommendation
  };

  const handleViewDetails = (archId: number) => {
    // Find the architecture and open modal
    const arch = [...myArchitectures, ...teamArchitectures].find(a => a.id === archId);
    if (arch) {
      setSelectedArchitecture(arch);
      setIsDetailModalOpen(true);
    }
  };

  const handleEdit = (archId: number) => {
    // Navigate to edit page or open edit modal
    console.log('Edit architecture:', archId);
    navigate('/generate'); // For now, navigate to generator
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Solution Architect Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Design and manage ML architectures and deployment strategies</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleNewArchitecture}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Architecture</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Pending Approvals - Priority Section */}
          {pendingApprovals.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
                  <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                    {pendingApprovals.length} waiting
                  </span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-6">
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div 
                      key={approval.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{approval.title}</h3>
                            <ApprovalStatusBadge status="pending_review" size="sm" />
                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                              approval.priority === 'high' 
                                ? 'bg-red-100 text-red-700' 
                                : approval.priority === 'medium'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {approval.priority.toUpperCase()} PRIORITY
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Submitted by:</span>
                              <p className="font-medium text-gray-900">{approval.submittedBy}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Type:</span>
                              <p className="font-medium text-gray-900">{approval.type}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Estimated Cost:</span>
                              <p className="font-medium text-gray-900">{approval.estimatedCost}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Submitted:</span>
                              <p className="font-medium text-gray-900">{approval.submittedAt}</p>
                            </div>
                          </div>

                          {approval.requiresBudgetApproval && (
                            <div className="mt-3 flex items-center space-x-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-orange-600" />
                              <span className="text-orange-700 font-medium">
                                Budget approval will be required after technical review
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleReviewApproval(approval.id)}
                          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          Review Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-orange-200">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-orange-700">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Action Required: Review pending recommendations</span>
                    </div>
                    <span className="text-orange-600 text-xs">
                      {pendingApprovals.length} pending review{pendingApprovals.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{pendingApprovals.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-orange-600 font-medium">
              Action required
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">My Architectures</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved This Month</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$7.5K</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
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
              placeholder="Search architectures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* My Architectures */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Architectures</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {myArchitectures.map((arch) => (
              <div key={arch.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{arch.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          {arch.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          arch.status === 'Active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {arch.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform:</span>
                      <span className="font-medium text-gray-900">{arch.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Cost:</span>
                      <span className="font-medium text-gray-900">{arch.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Complexity:</span>
                      <span className={`font-medium ${
                        arch.complexity === 'High' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {arch.complexity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">{arch.created}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                    <button 
                      onClick={() => handleViewDetails(arch.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleEdit(arch.id)}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Architectures */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Architectures</h2>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Architecture
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamArchitectures.map((arch) => (
                    <tr key={arch.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{arch.name}</div>
                          <div className="text-sm text-gray-500">{arch.type}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {arch.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {arch.platform}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          arch.status === 'Active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {arch.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {arch.cost}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => handleViewDetails(arch.id)}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View
                        </button>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Architecture Detail Modal */}
      <ArchitectureDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        architecture={selectedArchitecture}
      />
    </div>
  );
};

export default ArchitectDashboard;
