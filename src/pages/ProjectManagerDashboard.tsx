import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Calendar, FileText, Download, Filter, Upload, LogOut, BarChart3, FolderKanban, Settings, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProjectManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'overview' | 'projects' | 'resources' | 'settings'>('overview');
  const [timeRange, setTimeRange] = useState('month');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Mock data with dates for filtering
  const allProjects = [
    {
      id: 1,
      name: 'E-commerce Recommendation',
      owner: 'Sarah Chen',
      status: 'On Track',
      budget: '$15,000',
      spent: '$8,450',
      progress: 56,
      deadline: '2026-03-15',
      createdDate: new Date('2026-01-15'),
    },
    {
      id: 2,
      name: 'Object Detection System',
      owner: 'John Doe',
      status: 'At Risk',
      budget: '$12,000',
      spent: '$9,200',
      progress: 68,
      deadline: '2026-02-28',
      createdDate: new Date('2025-12-20'),
    },
    {
      id: 3,
      name: 'Customer Support Bot',
      owner: 'Mike Johnson',
      status: 'On Track',
      budget: '$20,000',
      spent: '$6,800',
      progress: 34,
      deadline: '2026-04-10',
      createdDate: new Date('2026-01-25'),
    },
    {
      id: 4,
      name: 'Sentiment Analysis API',
      owner: 'Emily Davis',
      status: 'Completed',
      budget: '$8,000',
      spent: '$7,500',
      progress: 100,
      deadline: '2026-01-30',
      createdDate: new Date('2025-11-10'),
    },
    {
      id: 5,
      name: 'Image Classification Model',
      owner: 'Alex Turner',
      status: 'On Track',
      budget: '$18,000',
      spent: '$5,200',
      progress: 28,
      deadline: '2026-05-15',
      createdDate: new Date('2026-02-01'),
    },
  ];

  // Filter projects based on time range
  const filteredByTime = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return allProjects.filter(project => {
      switch (timeRange) {
        case 'week':
          return project.createdDate >= startOfWeek;
        case 'month':
          return project.createdDate >= startOfMonth;
        case 'quarter':
          return project.createdDate >= startOfQuarter;
        case 'year':
          return project.createdDate >= startOfYear;
        default:
          return true;
      }
    });
  }, [timeRange]);

  // Filter by status
  const projects = useMemo(() => {
    if (filterStatus === 'all') return filteredByTime;
    return filteredByTime.filter(p => p.status === filterStatus);
  }, [filteredByTime, filterStatus]);

  // Calculate stats based on filtered projects
  const stats = useMemo(() => {
    const totalBudget = projects.reduce((sum, p) => sum + parseFloat(p.budget.replace(/[$,]/g, '')), 0);
    const totalSpent = projects.reduce((sum, p) => sum + parseFloat(p.spent.replace(/[$,]/g, '')), 0);
    const avgProgress = projects.length > 0 
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
      : 0;
    const onTrack = projects.filter(p => p.status === 'On Track').length;
    const atRisk = projects.filter(p => p.status === 'At Risk').length;

    return {
      totalBudget: `$${(totalBudget / 1000).toFixed(0)}K`,
      totalSpent: `$${(totalSpent / 1000).toFixed(1)}K`,
      spentPercentage: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
      activeProjects: projects.length,
      avgProgress,
      onTrack,
      atRisk,
    };
  }, [projects]);

  const costBreakdown = [
    { category: 'Training Compute', amount: '$12,450', percentage: 42 },
    { category: 'Inference Compute', amount: '$8,200', percentage: 28 },
    { category: 'Storage', amount: '$4,500', percentage: 15 },
    { category: 'Data Transfer', amount: '$3,100', percentage: 10 },
    { category: 'Other', amount: '$1,450', percentage: 5 },
  ];

  const handleImportExcel = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        alert(`File "${file.name}" selected. Resource import functionality will be implemented with backend.`);
      }
    };
    input.click();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExportReport = () => {
    alert('Exporting report for ' + timeRange + '...');
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Manager Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Monitor projects, track costs, and manage resources</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              Project Manager
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
      <div className="bg-white border-b border-gray-200 px-6 flex-shrink-0">
        <div className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'projects', label: 'Project Management', icon: FolderKanban },
            { id: 'resources', label: 'Resource Management', icon: Users },
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

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Overview Tab */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Time Range Selector */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Project Overview</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Time Range:</span>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                    <option value="all">All Time</option>
                  </select>
                  <button
                    onClick={handleExportReport}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Budget</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">${stats.totalBudget}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">${stats.totalSpent}</p>
                      <p className="text-xs text-gray-500 mt-1">{stats.spentPercentage}% of budget</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Projects</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeProjects}</p>
                      <p className="text-xs text-gray-500 mt-1">{stats.onTrack} on track, {stats.atRisk} at risk</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FolderKanban className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Progress</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgProgress}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${stats.avgProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                <div className="space-y-4">
                  {costBreakdown.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">{item.category}</span>
                        <span className="text-sm font-semibold text-gray-900">{item.amount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Alerts */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Alerts</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Object Detection System</p>
                      <p className="text-xs text-red-700 mt-1">Budget exceeded by 15% - Immediate action required</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">E-commerce Recommendation</p>
                      <p className="text-xs text-yellow-700 mt-1">Approaching 80% budget threshold</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Customer Support Bot</p>
                      <p className="text-xs text-green-700 mt-1">Well within budget - 34% spent</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Projects Summary */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects Summary</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Project</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Budget</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.slice(0, 5).map((project) => (
                        <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">{project.name}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              project.status === 'On Track' ? 'bg-green-100 text-green-700' :
                              project.status === 'At Risk' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">{project.spent} / {project.budget}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600 w-10">{project.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Project Management Tab */}
          {activeSection === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Project Management</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Filter className="w-4 h-4" />
                      <span>Filter: {filterStatus === 'all' ? 'All' : filterStatus}</span>
                    </button>
                    {showFilterMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        {['all', 'On Track', 'At Risk', 'Completed'].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setFilterStatus(status);
                              setShowFilterMenu(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {status === 'all' ? 'All Projects' : status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <FileText className="w-4 h-4" />
                    <span>New Project</span>
                  </button>
                </div>
              </div>

              {/* Projects Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Project Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Owner</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Budget</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Spent</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Progress</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <FolderKanban className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-900">{project.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700">{project.owner}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              project.status === 'On Track' ? 'bg-green-100 text-green-700' :
                              project.status === 'At Risk' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">{project.budget}</td>
                          <td className="py-4 px-4 text-sm text-gray-700">{project.spent}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[80px]">
                                <div
                                  className={`h-2 rounded-full ${
                                    project.progress >= 75 ? 'bg-green-600' :
                                    project.progress >= 50 ? 'bg-blue-600' :
                                    project.progress >= 25 ? 'bg-yellow-600' :
                                    'bg-red-600'
                                  }`}
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600 w-10">{project.progress}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-700">
                              <Calendar className="w-4 h-4" />
                              <span>{project.deadline}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Resource Management Tab */}
          {activeSection === 'resources' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Resource Management</h2>
                <button
                  onClick={handleImportExcel}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import from Excel</span>
                </button>
              </div>

              {/* Resource Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Team Members</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Utilization</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">78%</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Available Resources</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">6</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Resources Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Team Resources</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Current Project</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Utilization</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Sarah Chen', role: 'ML Engineer', project: 'E-commerce Recommendation', utilization: 95, status: 'Busy' },
                        { name: 'John Doe', role: 'Data Scientist', project: 'Object Detection System', utilization: 88, status: 'Busy' },
                        { name: 'Mike Johnson', role: 'ML Engineer', project: 'Customer Support Bot', utilization: 72, status: 'Active' },
                        { name: 'Emily Davis', role: 'Data Engineer', project: 'Sentiment Analysis API', utilization: 100, status: 'Busy' },
                        { name: 'Alex Turner', role: 'ML Engineer', project: 'Image Classification Model', utilization: 65, status: 'Active' },
                        { name: 'Lisa Wang', role: 'Data Scientist', project: 'Unassigned', utilization: 0, status: 'Available' },
                        { name: 'David Kim', role: 'ML Engineer', project: 'E-commerce Recommendation', utilization: 80, status: 'Active' },
                        { name: 'Rachel Green', role: 'Data Engineer', project: 'Object Detection System', utilization: 90, status: 'Busy' },
                        { name: 'Tom Brown', role: 'ML Architect', project: 'Customer Support Bot', utilization: 75, status: 'Active' },
                        { name: 'Nina Patel', role: 'Data Scientist', project: 'Unassigned', utilization: 0, status: 'Available' },
                      ].map((resource, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">{resource.name}</td>
                          <td className="py-4 px-4 text-sm text-gray-700">{resource.role}</td>
                          <td className="py-4 px-4 text-sm text-gray-700">{resource.project}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[100px]">
                                <div
                                  className={`h-2 rounded-full ${
                                    resource.utilization >= 90 ? 'bg-red-600' :
                                    resource.utilization >= 70 ? 'bg-yellow-600' :
                                    resource.utilization >= 40 ? 'bg-green-600' :
                                    'bg-blue-600'
                                  }`}
                                  style={{ width: `${resource.utilization}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600 w-10">{resource.utilization}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              resource.status === 'Available' ? 'bg-green-100 text-green-700' :
                              resource.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {resource.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Project Management Settings</h2>

              {/* Budget Alert Settings */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Alert Thresholds</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Warning Threshold (% of budget)
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="70">70%</option>
                      <option value="75">75%</option>
                      <option value="80" selected>80%</option>
                      <option value="85">85%</option>
                      <option value="90">90%</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Critical Threshold (% of budget)
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="90">90%</option>
                      <option value="95" selected>95%</option>
                      <option value="100">100%</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Report Settings */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Report Format
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="pdf">PDF</option>
                      <option value="excel" selected>Excel</option>
                      <option value="csv">CSV</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Frequency
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="daily">Daily</option>
                      <option value="weekly" selected>Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Budget threshold alerts</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Project deadline reminders</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Weekly project status summary</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Resource allocation changes</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">New project assignments</span>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;
