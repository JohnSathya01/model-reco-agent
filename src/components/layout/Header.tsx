import React, { useState } from 'react';
import { Brain, User, Settings, LogOut, Share2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfileModal, SettingsModal } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import type { ActivityLogEntry } from '../../types';

interface HeaderProps {
  showAvatar?: boolean;
  className?: string;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  activityLog?: ActivityLogEntry[];
  onShare?: () => void;
  showCollaboration?: boolean;
}

interface CollaboratorPresence {
  id: string;
  name: string;
  color: string;
  status: 'viewing' | 'editing' | 'idle';
}

const Header: React.FC<HeaderProps> = ({ 
  showAvatar = false, 
  className = '',
  selectedModel = 'gpt-4',
  onModelChange = () => {},
  activityLog = [],
  onShare = () => {},
  showCollaboration = false
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Mock collaborators
  const collaborators: CollaboratorPresence[] = [
    { id: '1', name: 'Sarah Chen', color: '#3B82F6', status: 'editing' },
    { id: '2', name: 'John Doe', color: '#10B981', status: 'viewing' },
    { id: '3', name: 'Mike Johnson', color: '#F59E0B', status: 'viewing' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header 
      className={`flex-shrink-0 bg-white border-b border-gray-200 shadow-sm ${className}`}
      role="banner"
      aria-label="Application header"
    >
      {/* Main Header Row */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100">
        {/* Left side - Logo and Title */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div 
            className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex-shrink-0 shadow-sm"
            role="img"
            aria-label="AI Brain Logo"
          >
            <Brain className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 
              className="text-lg font-bold text-gray-900 truncate"
              id="app-title"
            >
              AI Model Recommendation Agent
            </h1>
            <p 
              className="text-xs text-gray-600 truncate"
              aria-describedby="app-title"
            >
              Intelligent Model & Finetuning Strategy Platform
            </p>
          </div>
        </div>

        {/* Right side - User Controls */}
        {showAvatar && (
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* User Info */}
            {user && (
              <div className="hidden md:block text-right mr-2">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role.replace('-', ' ')}</p>
              </div>
            )}

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Settings"
              type="button"
            >
              <Settings className="w-5 h-5 text-gray-600" aria-hidden="true" />
            </button>

            {/* Profile Button */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="User profile menu"
              type="button"
            >
              <User className="w-5 h-5 text-gray-600" aria-hidden="true" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-9 h-9 bg-red-50 rounded-full hover:bg-red-100 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Logout"
              type="button"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-red-600" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Collaboration Row (Excel-style) */}
      {showCollaboration && (
        <div className="h-10 px-6 flex items-center justify-end space-x-3 bg-gray-50">
          {/* Avatar Stack */}
          <div className="flex -space-x-2 relative">
            {collaborators.slice(0, 3).map((collaborator) => (
              <div
                key={collaborator.id}
                className="relative group"
                onMouseEnter={() => setShowCollaborators(true)}
                onMouseLeave={() => setShowCollaborators(false)}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white cursor-pointer transition-transform hover:scale-110 hover:z-10"
                  style={{ backgroundColor: collaborator.color }}
                  title={collaborator.name}
                >
                  {collaborator.name.split(' ').map(n => n[0]).join('')}
                </div>
                {/* Status indicator */}
                <div
                  className={`absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full border border-white ${
                    collaborator.status === 'editing' ? 'bg-green-500' :
                    collaborator.status === 'viewing' ? 'bg-blue-500' :
                    'bg-gray-400'
                  }`}
                />
              </div>
            ))}
            {collaborators.length > 3 && (
              <div
                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold border-2 border-white cursor-pointer"
                onMouseEnter={() => setShowCollaborators(true)}
              >
                +{collaborators.length - 3}
              </div>
            )}
          </div>

          {/* Live Indicator */}
          <div className="flex items-center space-x-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-green-700">Live</span>
          </div>

          {/* Share button */}
          <button
            onClick={onShare}
            className="flex items-center space-x-1.5 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Collaborators Dropdown */}
          {showCollaborators && (
            <div
              className="absolute right-6 top-[104px] w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
              onMouseEnter={() => setShowCollaborators(true)}
              onMouseLeave={() => setShowCollaborators(false)}
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Active Now</h3>
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <Users className="w-3 h-3" />
                    <span>{collaborators.length}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {collaborators.map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                    >
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                          style={{ backgroundColor: collaborator.color }}
                        >
                          {collaborator.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div
                          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${
                            collaborator.status === 'editing' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{collaborator.name}</p>
                        <p className="text-xs text-gray-500">
                          {collaborator.status === 'editing' ? 'Editing' : 'Viewing'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-200 px-3 py-2 bg-gray-50 rounded-b-lg">
                <button
                  onClick={onShare}
                  className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Invite more people
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        activityLog={activityLog}
      />
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
      />
    </header>
  );
};

export default Header;