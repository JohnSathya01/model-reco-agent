import React, { useState } from 'react';
import { Brain, User, Settings } from 'lucide-react';
import { ProfileModal, SettingsModal } from '../ui';
import type { ActivityLogEntry } from '../../types';

interface HeaderProps {
  showAvatar?: boolean;
  className?: string;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  activityLog?: ActivityLogEntry[];
}

const Header: React.FC<HeaderProps> = ({ 
  showAvatar = false, 
  className = '',
  selectedModel = 'gpt-4',
  onModelChange = () => {},
  activityLog = []
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  return (
    <header 
      className={`h-16 flex-shrink-0 bg-white border-b border-gray-200 shadow-sm ${className}`}
      role="banner"
      aria-label="Application header"
    >
      <div className="h-full px-6 flex items-center justify-between">
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

        {/* Right side - Settings and User Avatar */}
        {showAvatar && (
          <div className="flex items-center space-x-2 flex-shrink-0">
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
          </div>
        )}
      </div>
      
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