import React, { useState } from 'react';
import { Users, Settings, BarChart3, FileText, TrendingUp, Shield, Database, Activity, Upload, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EditUserModal from '../components/ui/EditUserModal';
import AddUserModal from '../components/ui/AddUserModal';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'analytics' | 'settings'>('overview');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [usersList, setUsersList] = useState([
    { name: 'John Doe', role: 'Engineer', email: 'john@company.com', status: 'Active', projects: 8 },
    { name: 'Sarah Smith', role: 'Solution Architect', email: 'sarah@company.com', status: 'Active', projects: 12 },
    { name: 'Mike Johnson', role: 'Project Manager', email: 'mike@company.com', status: 'Active', projects: 15 },
    { name: 'Lisa Chen', role: 'Engineer', email: 'lisa@company.com', status: 'Active', projects: 6 },
    { name: 'Tom Wilson', role: 'Viewer', email: 'tom@company.com', status: 'Active', projects: 3 },
  ]);

  // Mock data
  const stats = {
    totalUsers: 24,
    activeProjects: 18,
    totalRecommendations: 156,
    monthlyCost: '$12,450',
  };

  const recentActivity = [
    { user: 'Engineer John', action: 'Generated recommendation', time: '5 min ago', project: 'CV Detection Model' },
    { user: 'Architect Sarah', action: 'Created architecture', time: '15 min ago', project: 'LLM Chat System' },
    { user: 'PM Mike', action: 'Exported cost report', time: '1 hour ago', project: 'Image Classification' },
    { user: 'Engineer Lisa', action: 'Generated code', time: '2 hours ago', project: 'Object Detection' },
  ];

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = (updatedUser: any) => {
    setUsersList(prev => 
      prev.map(u => u.email === selectedUser.email ? updatedUser : u)
    );
  };

  const handleAddUser = (newUser: any) => {
    setUsersList(prev => [...prev, newUser]);
  };

  const handleDeleteUser = (userEmail: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsersList(prev => prev.filter(u => u.email !== userEmail));
    }
  };

  const handleImportExcel = () => {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        alert(`File "${file.name}" selected. Excel import functionality will be implemented with backend.`);
        // TODO: Implement Excel parsing and user import
      }
    };
    input.click();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Specialisation Head Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Manage users, monitor activity, and oversee all projects</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Admin Access
            </span>
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as any)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeSection === id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-4">↑ 12% from last month</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Projects</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeProjects}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-4">↑ 8% from last month</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Recommendations</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRecommendations}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-4">↑ 24% from last month</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Cost</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.monthlyCost}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-red-600 mt-4">↑ 5% from last month</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{activity.user}</span>
                          <span className="text-gray-600">{activity.action}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.project}</p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleImportExcel}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import from Excel</span>
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add New User
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projects
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usersList.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.projects}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-700 mr-3 font-medium"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.email)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">Detailed analytics and reporting features coming soon</p>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Organization Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Acme Corporation"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default AI Model
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>GPT-4</option>
                    <option>Claude 3</option>
                    <option>Gemini Pro</option>
                  </select>
                </div>
                <div className="pt-4">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />
    </div>
  );
};

export default AdminDashboard;
