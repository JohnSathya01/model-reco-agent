import React, { useState } from 'react';
import { Layers, FileText, DollarSign, TrendingUp, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ArchitectureDetailModal from '../components/ui/ArchitectureDetailModal';

const ArchitectDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArchitecture, setSelectedArchitecture] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data
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

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Solution Architect Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Design and manage ML architectures and deployment strategies</p>
          </div>
          <button 
            onClick={handleNewArchitecture}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Architecture</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
                <p className="text-sm text-gray-600">Team Projects</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
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

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Efficiency</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">94%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
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
