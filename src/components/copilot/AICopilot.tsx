import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Minus,
  Lightbulb
} from 'lucide-react';
import type { CopilotMessage, ProposedChange, TabContext, CopilotContextData } from '../../types/copilot';
import { generateCopilotResponse } from '../../utils/copilotEngine';

interface AICopilotProps {
  context: CopilotContextData;
  onApplyChanges: (change: ProposedChange) => void;
  isVisible: boolean; // Control visibility based on recommendations
}

export const AICopilot: React.FC<AICopilotProps> = ({ context, onApplyChanges, isVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [pendingChange, setPendingChange] = useState<ProposedChange | null>(null);
  const [selectedActions, setSelectedActions] = useState<Set<number>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const hasRecommendations = context.recommendations !== null;
      
      const welcomeContent = hasRecommendations
        ? `👋 Hello! I've reviewed your current setup.\n\nI can provide suggestions to help you:\n- Optimize costs\n- Improve performance\n- Refine deployment strategy\n- Adjust model selection\n\nWhat would you like to explore?`
        : `👋 Hello! I'm here to help once you generate recommendations.\n\nFill out the form and click "Generate Recommendation" to get started.`;

      const welcomeMessage: CopilotMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: welcomeContent,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, context.recommendations]);

  // Don't render anything if not visible
  if (!isVisible) {
    return null;
  }

  const getContextLabel = (tab: TabContext): string => {
    const labels: Record<TabContext, string> = {
      overview: 'Overview',
      pipeline: 'Pipeline Architecture',
      analysis: 'Risk & Cost Analysis',
      api: 'API Specification',
      activity: 'Activity Log',
      retraining: 'Model Retraining'
    };
    return labels[tab];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    // Add user message
    const userMessage: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate AI response
    const response = generateCopilotResponse(inputValue, context);

    const assistantMessage: CopilotMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      proposedChanges: response.proposedChanges
    };

    setMessages(prev => [...prev, assistantMessage]);
    
    // Set pending change if there are proposed changes
    if (response.proposedChanges && response.proposedChanges.length > 0) {
      setPendingChange(response.proposedChanges[0]);
    }
    
    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    // Auto-send the message
    setTimeout(() => {
      const input = inputRef.current;
      if (input) {
        input.value = suggestion;
        handleSendMessage();
      }
    }, 100);
  };

  const handleAcceptChanges = () => {
    if (!pendingChange || selectedActions.size === 0) return;

    onApplyChanges(pendingChange);

    // Add confirmation message
    const selectedChanges = pendingChange.changes
      .filter((_, idx) => selectedActions.has(idx))
      .map(c => `${c.field}: ${c.from} → ${c.to}`)
      .join('\n');

    const confirmMessage: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `✅ Changes applied successfully!\n\n${selectedChanges}\n\nThe updates are now reflected in your pipeline. You can review them in the Activity tab.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, confirmMessage]);
    setPendingChange(null);
    setSelectedActions(new Set());
  };

  const handleRejectChanges = () => {
    if (!pendingChange) return;

    const rejectMessage: CopilotMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `No changes were applied. Your current configuration remains unchanged.\n\nFeel free to ask for alternative suggestions or explore other options.`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, rejectMessage]);
    setPendingChange(null);
    setSelectedActions(new Set());
  };

  const toggleActionSelection = (index: number) => {
    setSelectedActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <>
      {/* Floating Toggle Button - Subtle Design */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-6 bottom-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full p-3.5 shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50 group"
          aria-label="Open AI Copilot"
        >
          <Sparkles className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
            AI
          </span>
        </button>
      )}

      {/* Copilot Drawer - Increased width */}
      {isOpen && (
        <div className="fixed right-0 top-0 h-full w-[480px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col animate-slideInRight">
          {/* Header - Smaller, Softer */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <div>
                <h3 className="font-semibold text-sm">AI Copilot</h3>
                <span className="inline-block bg-white/20 text-xs px-2 py-0.5 rounded-full mt-0.5">
                  {getContextLabel(context.activeTab)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded p-1 transition-colors"
              aria-label="Close AI Copilot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area - More White Space */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
            {/* Quick Suggestion Chips - Show when no messages or only welcome */}
            {messages.length <= 1 && !isTyping && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick suggestions</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSuggestionClick("How can I reduce costs?")}
                    className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                  >
                    💰 Reduce costs
                  </button>
                  <button
                    onClick={() => handleSuggestionClick("How can I improve performance?")}
                    className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                  >
                    ⚡ Improve performance
                  </button>
                  <button
                    onClick={() => handleSuggestionClick("What are my deployment options?")}
                    className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                  >
                    🚀 Deployment options
                  </button>
                  <button
                    onClick={() => handleSuggestionClick("Can we use Spot instances?")}
                    className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                  >
                    💡 Use Spot instances
                  </button>
                  <button
                    onClick={() => handleSuggestionClick("Add API Gateway with authentication")}
                    className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                  >
                    🔐 Configure API
                  </button>
                  <button
                    onClick={() => handleSuggestionClick("Optimize for latency")}
                    className="inline-flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                  >
                    ⏱️ Optimize latency
                  </button>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-4 ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  
                  {/* Proposed Changes */}
                  {message.proposedChanges && message.proposedChanges.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {message.proposedChanges.map((change) => (
                        <ProposedChangeCard
                          key={change.id}
                          change={change}
                          selectedActions={selectedActions}
                          onToggleAction={toggleActionSelection}
                        />
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs mt-3 opacity-60">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Confirmation Actions (Sticky) - Only show if actions selected */}
          {pendingChange && selectedActions.size > 0 && (
            <div className="bg-amber-50 border-t border-amber-200 p-4">
              <div className="flex items-start space-x-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-900 font-medium">
                    Apply selected changes?
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    {selectedActions.size} change{selectedActions.size !== 1 ? 's' : ''} selected
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAcceptChanges}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Apply Changes</span>
                </button>
                <button
                  onClick={handleRejectChanges}
                  className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Input Box */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask for suggestions..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-colors"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Proposed Change Card Component - Suggestion-First Design
interface ProposedChangeCardProps {
  change: ProposedChange;
  selectedActions: Set<number>;
  onToggleAction: (index: number) => void;
}

const ProposedChangeCard: React.FC<ProposedChangeCardProps> = ({ change, selectedActions, onToggleAction }) => {
  const getImpactIcon = (value: string) => {
    if (value.includes('-') || value.includes('reduce') || value.includes('lower') || value.includes('↓')) {
      return <TrendingDown className="w-4 h-4 text-green-600" />;
    }
    if (value.includes('+') || value.includes('increase') || value.includes('higher') || value.includes('↑')) {
      return <TrendingUp className="w-4 h-4 text-orange-600" />;
    }
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="space-y-4">
      {/* Suggestions Section - Primary */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-indigo-600" />
          <h4 className="font-semibold text-sm text-indigo-900">Suggestions</h4>
        </div>

        <div className="space-y-2.5">
          {change.changes.map((detail, idx) => (
            <div key={idx} className="text-sm text-gray-700 leading-relaxed">
              <span className="text-gray-600">One option is to </span>
              <span className="font-medium text-gray-900">
                change {detail.field.toLowerCase()}
              </span>
              <span className="text-gray-600"> from </span>
              <span className="font-medium">{detail.from}</span>
              <span className="text-gray-600"> to </span>
              <span className="font-medium text-indigo-700">{detail.to}</span>
              <span className="text-gray-600">.</span>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Summary - Secondary */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2.5">
        <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Impact Summary</h5>
        <div className="space-y-2">
          {change.impact.cost && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getImpactIcon(change.impact.cost)}
                <span className="text-sm text-gray-700">Cost</span>
              </div>
              <span className="text-sm font-medium text-gray-900 bg-gray-50 px-2.5 py-1 rounded-md">
                {change.impact.cost}
              </span>
            </div>
          )}
          {change.impact.latency && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getImpactIcon(change.impact.latency)}
                <span className="text-sm text-gray-700">Latency</span>
              </div>
              <span className="text-sm font-medium text-gray-900 bg-gray-50 px-2.5 py-1 rounded-md">
                {change.impact.latency}
              </span>
            </div>
          )}
          {change.impact.complexity && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Minus className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Complexity</span>
              </div>
              <span className="text-sm font-medium text-gray-900 bg-gray-50 px-2.5 py-1 rounded-md">
                {change.impact.complexity}
              </span>
            </div>
          )}
          {change.impact.accuracy && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getImpactIcon(change.impact.accuracy)}
                <span className="text-sm text-gray-700">Accuracy</span>
              </div>
              <span className="text-sm font-medium text-gray-900 bg-gray-50 px-2.5 py-1 rounded-md">
                {change.impact.accuracy}
              </span>
            </div>
          )}
          {change.impact.scalability && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getImpactIcon(change.impact.scalability)}
                <span className="text-sm text-gray-700">Scalability</span>
              </div>
              <span className="text-sm font-medium text-gray-900 bg-gray-50 px-2.5 py-1 rounded-md">
                {change.impact.scalability}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Optional Actions - Explicit */}
      <div className="bg-white border-2 border-gray-300 rounded-xl p-4 space-y-3">
        <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Would you like to apply any of these changes?
        </h5>
        <div className="space-y-2">
          {change.changes.map((detail, idx) => (
            <label
              key={idx}
              className="flex items-start space-x-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  checked={selectedActions.has(idx)}
                  onChange={() => onToggleAction(idx)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
              </div>
              <div className="flex-1 text-sm">
                <span className="text-gray-700">Apply </span>
                <span className="font-medium text-gray-900">{detail.field}</span>
                <span className="text-gray-700"> change</span>
                <div className="text-xs text-gray-500 mt-1">
                  {detail.from} → {detail.to}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
