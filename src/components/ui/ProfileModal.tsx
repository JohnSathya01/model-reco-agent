import React, { useState } from 'react';
import { X, User, Briefcase, Building2, Mail, TrendingUp, Target, DollarSign, Github, Linkedin, Activity } from 'lucide-react';
import type { ActivityLogEntry } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityLog?: ActivityLogEntry[];
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, activityLog = [] }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile');
  
  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal - Landscape Professional Card */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 rounded-t-2xl border-b border-gray-200">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg p-2 transition-colors"
              aria-label="Close profile"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm border border-gray-300">
                <User className="w-10 h-10 text-gray-600" />
              </div>
              <div>
                <h2 
                  id="profile-modal-title"
                  className="text-2xl font-bold text-gray-900"
                >
                  John Sathya
                </h2>
                <p className="text-sm text-gray-600 mt-1">Member since January 2026</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6 flex space-x-1 bg-white rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium text-sm transition-all ${
                  activeTab === 'profile'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium text-sm transition-all ${
                  activeTab === 'activity'
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Activity Log</span>
                {activityLog.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    {activityLog.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Content - Two Column Layout */}
          <div className="p-8">
            {activeTab === 'profile' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column - Professional Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Professional Information
                  </h3>
                  
                  {/* Role */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Role</p>
                      <p className="text-base font-semibold text-gray-900 mt-0.5">AI/ML Solutions Architect</p>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Company</p>
                      <p className="text-base font-semibold text-gray-900 mt-0.5">zeb</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Email</p>
                      <p className="text-base font-semibold text-gray-900 mt-0.5">john.sathya@zeb.co</p>
                    </div>
                  </div>
                </div>

                {/* Expertise */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Areas of Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200">
                      Computer Vision
                    </span>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200">
                      LLM/NLP
                    </span>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200">
                      Cloud Architecture
                    </span>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200">
                      MLOps
                    </span>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200">
                      Cost Optimization
                    </span>
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200">
                      AWS SageMaker
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Connect
                  </h3>
                  <div className="flex space-x-3">
                    <a
                      href="https://github.com/JohnSathya01"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200"
                      aria-label="GitHub profile"
                    >
                      <Github className="w-4 h-4 text-gray-700" />
                      <span className="text-sm font-medium text-gray-700">GitHub</span>
                    </a>
                    <a
                      href="https://linkedin.com/in/johnsathya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200"
                      aria-label="LinkedIn profile"
                    >
                      <Linkedin className="w-4 h-4 text-gray-700" />
                      <span className="text-sm font-medium text-gray-700">LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats & Metrics */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Performance Metrics
                  </h3>
                  
                  {/* Stats Cards */}
                  <div className="space-y-3">
                    {/* Projects */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <Target className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Total Projects</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            +3 this month
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <TrendingUp className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Recommendations Generated</p>
                            <p className="text-2xl font-bold text-gray-900">156</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            +12 this week
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cost Saved */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <DollarSign className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Total Cost Optimized</p>
                            <p className="text-2xl font-bold text-gray-900">$3.2M</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            32% savings
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Recent Activity
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Generated CV model recommendation</span>
                        <span className="text-xs text-gray-400">2 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Exported architecture diagram</span>
                        <span className="text-xs text-gray-400">5 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Completed LLM cost analysis</span>
                        <span className="text-xs text-gray-400">1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ) : (
              /* Activity Log Tab */
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Activity History</h3>
                  <span className="text-sm text-gray-600">{activityLog.length} total activities</span>
                </div>

                {activityLog.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No activity recorded yet</p>
                    <p className="text-sm text-gray-500 mt-2">Generate recommendations to see your activity here</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {activityLog.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.exportStatus)}`}>
                                {activity.exportStatus}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(activity.timestamp)}
                              </span>
                            </div>
                            
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {activity.userAction}
                            </h4>
                            
                            <p className="text-sm text-gray-600 mb-2">
                              {activity.inputSummary}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-500">Recommendation:</span>
                                <span className="text-gray-900 font-medium">{activity.recommendationSummary}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-500">Cost:</span>
                                <span className="text-blue-600 font-semibold">{activity.costEstimate}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
