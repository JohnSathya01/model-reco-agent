import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, Rocket, Package } from 'lucide-react';
import type { RecommendationStatus } from '../../types/approval';

interface ApprovalStatusBadgeProps {
  status: RecommendationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const ApprovalStatusBadge: React.FC<ApprovalStatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'draft':
        return {
          icon: AlertCircle,
          label: 'Draft',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300'
        };
      case 'pending_review':
        return {
          icon: Clock,
          label: 'Pending Review',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-300'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          label: 'Approved',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          borderColor: 'border-green-300'
        };
      case 'changes_requested':
        return {
          icon: XCircle,
          label: 'Changes Requested',
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          borderColor: 'border-red-300'
        };
      case 'in_progress':
        return {
          icon: Rocket,
          label: 'In Progress',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-300'
        };
      case 'deployed':
        return {
          icon: Package,
          label: 'Deployed',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-700',
          borderColor: 'border-purple-300'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span 
      className={`inline-flex items-center space-x-1.5 ${sizeClasses[size]} ${config.bgColor} ${config.textColor} border ${config.borderColor} rounded-full font-medium`}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </span>
  );
};
