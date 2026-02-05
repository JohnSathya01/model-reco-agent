// AI Copilot types
export type TabContext = 'overview' | 'pipeline' | 'analysis' | 'api' | 'activity' | 'retraining';

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  proposedChanges?: ProposedChange[];
}

export interface ProposedChange {
  id: string;
  type: 'model' | 'finetuning' | 'deployment' | 'instance' | 'pipeline' | 'cost' | 'api' | 'architecture';
  description: string;
  impact: ChangeImpact;
  changes: ChangeDetail[];
}

export interface ChangeImpact {
  cost?: string;
  latency?: string;
  complexity?: string;
  accuracy?: string;
  scalability?: string;
}

export interface ChangeDetail {
  field: string;
  from: string;
  to: string;
  icon?: string;
}

export interface CopilotState {
  isOpen: boolean;
  messages: CopilotMessage[];
  currentContext: TabContext;
  pendingChanges: ProposedChange | null;
  conversationHistory: CopilotMessage[];
}

export interface CopilotContextData {
  activeTab: TabContext;
  formData: any;
  recommendations: any;
  activityLog: any[];
}
