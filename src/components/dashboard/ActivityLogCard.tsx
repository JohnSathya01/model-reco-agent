import React from 'react';
import { Clock, User, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card } from '../ui';
import type { ActivityLogEntry } from '../../types';

interface ActivityLogCardProps {
  activities: ActivityLogEntry[];
  className?: string;
}

const ActivityLogCard: React.FC<ActivityLogCardProps> = ({
  activities,
  className = ''
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-50 border-green-200';
      case 'failed': return 'text-red-700 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Card title="📋 Activity Log" className={className}>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No activities yet</p>
            <p className="text-xs">Generate your first recommendation to see activity</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{activity.userAction}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                    {getStatusIcon(activity.exportStatus)}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Input: </span>
                    <span className="text-gray-600">{truncateText(activity.inputSummary)}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Result: </span>
                    <span className="text-gray-600">{truncateText(activity.recommendationSummary)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-700">Cost: </span>
                      <span className="text-gray-900 font-semibold">{activity.costEstimate}</span>
                    </div>
                    
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(activity.exportStatus)}`}>
                      <Download className="w-3 h-3 mr-1" />
                      {activity.exportStatus}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActivityLogCard;