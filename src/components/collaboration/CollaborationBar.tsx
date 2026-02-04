import React, { useState } from 'react';
import { Users, Share2, Eye, Edit3, Clock } from 'lucide-react';

interface CollaboratorPresence {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'viewing' | 'editing' | 'idle';
  color: string;
  lastActive: Date;
  currentSection?: string;
}

interface CollaborationBarProps {
  projectId?: string;
  onShare?: () => void;
}

export const CollaborationBar: React.FC<CollaborationBarProps> = ({ onShare }) => {
  const [showCollaborators, setShowCollaborators] = useState(false);
  
  // Mock collaborators - in real app, this would come from WebSocket/Firebase
  const collaborators: CollaboratorPresence[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      role: 'ML Engineer',
      status: 'editing',
      color: '#3B82F6', // blue
      lastActive: new Date(),
      currentSection: 'Project Details'
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john@company.com',
      role: 'Solution Architect',
      status: 'viewing',
      color: '#10B981', // green
      lastActive: new Date(Date.now() - 2 * 60000),
      currentSection: 'Pipeline'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: 'Project Manager',
      status: 'viewing',
      color: '#F59E0B', // amber
      lastActive: new Date(Date.now() - 5 * 60000),
      currentSection: 'Cost Analysis'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'editing':
        return <Edit3 className="w-3 h-3" />;
      case 'viewing':
        return <Eye className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'editing':
        return 'Editing';
      case 'viewing':
        return 'Viewing';
      default:
        return 'Idle';
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-2.5">
      <div className="flex items-center justify-end space-x-3">
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
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white cursor-pointer transition-transform hover:scale-110 hover:z-10"
                style={{ backgroundColor: collaborator.color }}
                title={collaborator.name}
              >
                {collaborator.name.split(' ').map(n => n[0]).join('')}
              </div>
              {/* Status indicator */}
              <div
                className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${
                  collaborator.status === 'editing' ? 'bg-green-500' :
                  collaborator.status === 'viewing' ? 'bg-blue-500' :
                  'bg-gray-400'
                }`}
              />
            </div>
          ))}
          {collaborators.length > 3 && (
            <div
              className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold border-2 border-white cursor-pointer"
              onMouseEnter={() => setShowCollaborators(true)}
            >
              +{collaborators.length - 3}
            </div>
          )}
        </div>

        {/* Live Indicator */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700">Live</span>
        </div>

        {/* Share button */}
        <button
          onClick={onShare}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>

        {/* Collaborators Dropdown */}
        {showCollaborators && (
          <div
            className="absolute right-6 mt-2 top-[52px] w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
            onMouseEnter={() => setShowCollaborators(true)}
            onMouseLeave={() => setShowCollaborators(false)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Active Collaborators</h3>
                <div className="flex items-center space-x-1 text-xs text-gray-600">
                  <Users className="w-3.5 h-3.5" />
                  <span>{collaborators.length}</span>
                </div>
              </div>
              <div className="space-y-3">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                        style={{ backgroundColor: collaborator.color }}
                      >
                        {collaborator.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          collaborator.status === 'editing' ? 'bg-green-500' :
                          collaborator.status === 'viewing' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {collaborator.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {getTimeAgo(collaborator.lastActive)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{collaborator.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          collaborator.status === 'editing' ? 'bg-green-100 text-green-700' :
                          collaborator.status === 'viewing' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {getStatusIcon(collaborator.status)}
                          <span>{getStatusText(collaborator.status)}</span>
                        </div>
                        {collaborator.currentSection && (
                          <span className="text-xs text-gray-500">
                            • {collaborator.currentSection}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 rounded-b-lg">
              <button
                onClick={onShare}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Invite more collaborators
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
