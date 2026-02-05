import type { Notification, NotificationType } from '../types/notification';
import type { RecommendationMetadata } from '../types/approval';

/**
 * Notification Service
 * Handles creation and management of approval notifications
 * In production, this would integrate with a backend notification system
 */

export class NotificationService {
  private static notifications: Notification[] = [];
  private static listeners: ((notifications: Notification[]) => void)[] = [];

  /**
   * Create a notification
   */
  static createNotification(
    type: NotificationType,
    from: { id: string; name: string; email: string; role: string },
    to: string[],
    recommendationId: string,
    metadata: RecommendationMetadata
  ): Notification {
    const notification: Notification = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      type,
      title: this.getNotificationTitle(type, from.name),
      message: this.getNotificationMessage(type, from.name, metadata),
      from,
      to,
      recommendationId,
      timestamp: new Date(),
      read: false,
      actionUrl: '/generate'
    };

    this.notifications.push(notification);
    this.notifyListeners();
    
    console.log('📬 Notification created:', notification);
    return notification;
  }

  /**
   * Get notification title based on type
   */
  private static getNotificationTitle(type: NotificationType, _fromName: string): string {
    switch (type) {
      case 'approval_request':
        return '🔔 New Approval Request';
      case 'approval_granted':
        return '✅ Recommendation Approved';
      case 'approval_rejected':
        return '❌ Recommendation Rejected';
      case 'changes_requested':
        return '📝 Changes Requested';
      case 'budget_approval_request':
        return '💰 Budget Approval Needed';
      case 'budget_approved':
        return '✅ Budget Approved';
      case 'resubmitted':
        return '🔄 Recommendation Resubmitted';
      default:
        return '🔔 New Notification';
    }
  }

  /**
   * Get notification message based on type
   */
  private static getNotificationMessage(
    type: NotificationType,
    fromName: string,
    metadata: RecommendationMetadata
  ): string {
    switch (type) {
      case 'approval_request':
        return `${fromName} submitted "${metadata.title}" for your technical review.`;
      case 'approval_granted':
        return `${fromName} approved your recommendation "${metadata.title}".`;
      case 'approval_rejected':
        return `${fromName} rejected your recommendation "${metadata.title}".`;
      case 'changes_requested':
        return `${fromName} requested changes to "${metadata.title}".`;
      case 'budget_approval_request':
        return `"${metadata.title}" needs your budget approval as Specialisation Head (${metadata.estimatedCost}).`;
      case 'budget_approved':
        return `${fromName} approved the budget for "${metadata.title}".`;
      case 'resubmitted':
        return `${fromName} resubmitted "${metadata.title}" for review.`;
      default:
        return `New update on "${metadata.title}".`;
    }
  }

  /**
   * Get notifications for a specific user
   */
  static getNotificationsForUser(userId: string): Notification[] {
    return this.notifications
      .filter(n => n.to.includes(userId))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get unread count for a user
   */
  static getUnreadCount(userId: string): number {
    return this.notifications.filter(n => n.to.includes(userId) && !n.read).length;
  }

  /**
   * Mark notification as read
   */
  static markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static markAllAsRead(userId: string): void {
    this.notifications
      .filter(n => n.to.includes(userId))
      .forEach(n => n.read = true);
    this.notifyListeners();
  }

  /**
   * Subscribe to notification updates
   */
  static subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of changes
   */
  private static notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  /**
   * Clear all notifications (for testing)
   */
  static clearAll(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  /**
   * Get all notifications (for debugging)
   */
  static getAll(): Notification[] {
    return [...this.notifications];
  }
}

/**
 * Helper function to determine who should be notified based on action
 */
export function getNotificationRecipients(
  action: 'submit' | 'approve' | 'reject' | 'request_changes' | 'budget_request',
  metadata: RecommendationMetadata
): string[] {
  switch (action) {
    case 'submit':
      // Notify all Solution Architects
      return ['architect@company.com']; // In production, fetch from user database
    
    case 'approve':
    case 'reject':
    case 'request_changes':
      // Notify the creator
      return [metadata.createdBy.id];
    
    case 'budget_request':
      // Notify Admin (Specialisation Head) for budget approval
      return ['admin@company.com']; // In production, fetch from user database
    
    default:
      return [];
  }
}
