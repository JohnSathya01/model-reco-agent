export type NotificationType = 
  | 'approval_request'
  | 'approval_granted'
  | 'approval_rejected'
  | 'changes_requested'
  | 'budget_approval_request'
  | 'budget_approved'
  | 'resubmitted';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  from: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  to: string[]; // User IDs who should receive this
  recommendationId: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}
