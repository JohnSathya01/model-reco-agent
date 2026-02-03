import React from 'react';
import Header from './Header';
import type { ActivityLogEntry } from '../../types';

interface LayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  showAvatar?: boolean;
  className?: string;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  activityLog?: ActivityLogEntry[];
}

const Layout: React.FC<LayoutProps> = ({
  leftPanel,
  rightPanel,
  showAvatar = false,
  className = '',
  selectedModel = 'gpt-4',
  onModelChange = () => {},
  activityLog = []
}) => {
  return (
    <div className={`h-screen flex flex-col bg-gray-50 overflow-hidden ${className}`}>
      {/* Fixed Header - 64px height */}
      <Header 
        showAvatar={showAvatar} 
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        activityLog={activityLog}
      />
      
      {/* Main Content Area - Full height below header */}
      <main 
        className="flex-1 overflow-hidden"
        role="main"
        aria-label="Main application content"
      >
        <div className="h-full flex">
          {/* Left Panel - Fixed Width Form */}
          <section 
            className="w-full lg:w-[440px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden"
            aria-label="Model recommendation form"
            role="form"
          >
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {leftPanel}
              </div>
            </div>
          </section>
          
          {/* Right Panel - Flexible Width Results */}
          <section 
            className="flex-1 overflow-y-auto"
            aria-label="Recommendation results"
            role="region"
            aria-live="polite"
            aria-atomic="false"
          >
            <div className="min-h-full p-8">
              <div className="max-w-[1200px] mx-auto">
                {rightPanel}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Layout;