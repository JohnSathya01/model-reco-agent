export type RecommendationStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'approved' 
  | 'changes_requested'
  | 'in_progress' 
  | 'deployed';

export interface Approval {
  id: string;
  type: 'technical' | 'budget';
  approver: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  comment: string;
  timestamp: Date;
}

export interface ChangeRequest {
  id: string;
  requestedBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  reason: string;
  changes: string[];
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedNotes?: string;
}

export interface ResubmissionHistory {
  id: string;
  resubmittedBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  timestamp: Date;
  notes: string;
  addressedChangeRequests: string[]; // IDs of change requests addressed
  previousStatus: RecommendationStatus;
}

export interface RecommendationMetadata {
  id: string;
  title: string;
  status: RecommendationStatus;
  createdBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvals: {
    technical: Approval | null;
    budget: Approval | null;
  };
  changeRequests: ChangeRequest[];
  resubmissionHistory: ResubmissionHistory[];
  requiresBudgetApproval: boolean;
  estimatedCost: string;
}
