import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  onShare?: () => void;
  showCollaboration?: boolean;
  leftPanelCollapsed?: boolean;
  onLeftPanelToggle?: (collapsed: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({
  leftPanel,
  rightPanel,
  showAvatar = false,
  className = '',
  selectedModel = 'gpt-4',
  onModelChange = () => {},
  activityLog = [],
  onShare = () => {},
  showCollaboration = false,
  leftPanelCollapsed: externalCollapsed,
  onLeftPanelToggle
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const setCollapsed = onLeftPanelToggle || setInternalCollapsed;

  const togglePanel = () => {
    setCollapsed(!isCollapsed);
  };

  return (
    <div className={`h-screen flex flex-col bg-gray-50 overflow-hidden ${className}`}>
      {/* Fixed Header with Collaboration */}
      <Header 
        showAvatar={showAvatar} 
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        activityLog={activityLog}
        onShare={onShare}
        showCollaboration={showCollaboration}
      />
      
      {/* Main Content Area - Full height below header */}
      <main 
        className="flex-1 overflow-hidden"
        role="main"
        aria-label="Main application content"
      >
        <div className="h-full flex relative">
          {/* Left Panel - Collapsible Form */}
          <section 
            className={`flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed ? 'w-0' : 'w-full lg:w-[440px]'
            }`}
            aria-label="Model recommendation form"
            role="form"
            aria-hidden={isCollapsed}
          >
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {leftPanel}
              </div>
            </div>
          </section>

          {/* Toggle Button */}
          <button
            onClick={togglePanel}
            className={`absolute top-4 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all duration-300 ${
              isCollapsed ? 'left-4' : 'left-[424px] lg:left-[424px]'
            }`}
            aria-label={isCollapsed ? 'Show input panel' : 'Hide input panel'}
            title={isCollapsed ? 'Show input panel' : 'Hide input panel'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
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