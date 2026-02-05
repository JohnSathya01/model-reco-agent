import React from 'react';
import { CheckCircle, Clock, XCircle, User, DollarSign, Calendar } from 'lucide-react';
import type { RecommendationMetadata } from '../../types/approval';

interface ApprovalPanelProps {
  metadata: RecommendationMetadata;
  onApprove?: (type: 'technical' | 'budget') => void;
  onReject?: () => void;
  onRequestChanges?: () => void;
  currentUserRole?: string;
}

export const ApprovalPanel: React.FC<ApprovalPanelProps> = ({
  metadata,
  onApprove,
  onReject,
  onRequestChanges,
  currentUserRole
}) => {
  const { approvals, status, requiresBudgetApproval } = metadata;

  const canApproveTechnical = currentUserRole === 'solution-architect' || currentUserRole === 'admin';
  const canApproveBudget = currentUserRole === 'admin'; // Only Admin (Specialisation Head) can approve budget
  
  const showTechnicalApproval = status === 'pending_review' || approvals.technical;
  const showBudgetApproval = requiresBudgetApproval && (status === 'approved' || approvals.budget);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Approval Status</h3>
        {status === 'pending_review' && !approvals.technical && canApproveTechnical && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onRequestChanges}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Request Changes
            </button>
            <button
              onClick={() => onApprove?.('technical')}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Technical Approval */}
        {showTechnicalApproval && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  approvals.technical?.status === 'approved' ? 'bg-green-100' :
                  approvals.technical?.status === 'rejected' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  {approvals.technical?.status === 'approved' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : approvals.technical?.status === 'rejected' ? (
                    <XCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">Technical Review</h4>
                  {approvals.technical ? (
                    <>
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {approvals.technical.status === 'approved' ? 'Approved' : 'Rejected'} by {approvals.technical.approver.name}
                        </span>
                      </div>
                      {approvals.technical.comment && (
                        <p className="text-sm text-gray-700 mt-2 italic">
                          "{approvals.technical.comment}"
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {new Date(approvals.technical.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">
                      Waiting for Solution Architect review
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Budget Approval */}
        {showBudgetApproval && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  approvals.budget?.status === 'approved' ? 'bg-green-100' :
                  approvals.budget?.status === 'rejected' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  {approvals.budget?.status === 'approved' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : approvals.budget?.status === 'rejected' ? (
                    <XCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">Budget Approval</h4>
                  {approvals.budget ? (
                    <>
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {approvals.budget.status === 'approved' ? 'Approved' : 'Rejected'} by {approvals.budget.approver.name}
                        </span>
                      </div>
                      {approvals.budget.comment && (
                        <p className="text-sm text-gray-700 mt-2 italic">
                          "{approvals.budget.comment}"
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {new Date(approvals.budget.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mt-1">
                        Waiting for Specialisation Head (Admin) approval
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Estimated Cost: {metadata.estimatedCost}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {canApproveBudget && !approvals.budget && approvals.technical?.status === 'approved' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onReject}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => onApprove?.('budget')}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve Budget
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Message */}
        {status === 'draft' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Draft Mode:</strong> Complete your recommendation and click "Submit for Review" to send it to a Solution Architect for approval.
            </p>
          </div>
        )}

        {status === 'changes_requested' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Changes Requested:</strong> Please review the feedback and make the requested changes before resubmitting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
