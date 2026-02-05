import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout } from './components/layout';
import { InputForm } from './components/forms';
import { ResultsDashboard } from './components/dashboard';
import { AICopilot } from './components/copilot';
import { ShareModal } from './components/collaboration';
import { SubmitReviewModal, RequestChangesModal, ApproveModal, ResubmitModal } from './components/approval';
import { Toast } from './components/ui/Toast';
import { useFormState, useRecommendations } from './hooks';
import { generatePipeline } from './utils/pipelineGenerator';
import { applyChanges } from './utils/copilotEngine';
import { NotificationService, getNotificationRecipients } from './utils/notificationService';
import { CostThresholdService } from './utils/costThresholdService';
import { useAuth } from './contexts/AuthContext';
import type { FormData as AppFormData, ActivityLogEntry, ProposedChange } from './types';
import type { RecommendationMetadata } from './types/approval';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { formData, setFormData } = useFormState();
  const { recommendations, loading, error, generateRecommendations } = useRecommendations();
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4');
  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'analysis' | 'api' | 'retraining'>('overview');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Approval workflow state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [approvalType, setApprovalType] = useState<'technical' | 'budget'>('technical');
  
  const [recommendationMetadata, setRecommendationMetadata] = useState<RecommendationMetadata>({
    id: 'rec-' + Date.now(),
    title: 'ML Model Recommendation',
    status: 'draft',
    createdBy: {
      id: user?.email || '',
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || ''
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    approvals: {
      technical: null,
      budget: null
    },
    changeRequests: [],
    resubmissionHistory: [],
    requiresBudgetApproval: false,
    estimatedCost: '$0'
  });

  // Auto-detect cost threshold and update budget approval requirement
  useEffect(() => {
    if (recommendations?.computeEstimate?.monthlyCost) {
      const cost = recommendations.computeEstimate.monthlyCost;
      const requiresBudget = CostThresholdService.requiresBudgetApproval(cost);
      
      setRecommendationMetadata(prev => ({
        ...prev,
        estimatedCost: cost,
        requiresBudgetApproval: requiresBudget
      }));
      
      console.log('💰 Cost threshold check:', {
        cost,
        requiresBudgetApproval: requiresBudget,
        level: CostThresholdService.getCostLevel(cost),
        message: CostThresholdService.getThresholdMessage(cost)
      });
    }
  }, [recommendations]);

  // Check if user came from /generate route (architect or admin reviewing)
  const showBackButton = location.pathname === '/generate' && 
    (user?.role === 'solution-architect' || user?.role === 'admin');

  const handleBack = () => {
    if (user?.role === 'solution-architect') {
      navigate('/architect');
    } else if (user?.role === 'admin') {
      navigate('/admin');
    }
  };

  const handleFormSubmit = async (data: AppFormData) => {
    setFormData(data);
    
    // Generate ML Pipeline automatically
    console.log('🚀 Generating ML Pipeline automatically...');
    console.log('🤖 Using AI Model:', selectedModel);
    const pipeline = generatePipeline(data.projectDescription.description, data.projectDetails.useCaseType);
    console.log('Generated pipeline:', pipeline);
    
    // Update form data with generated pipeline
    const updatedData = {
      ...data,
      projectDescription: {
        ...data.projectDescription,
        generatedPipeline: pipeline
      }
    };
    setFormData(updatedData);
    
    // Add activity log entry
    const newActivity: ActivityLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      userAction: 'Generate Recommendation',
      inputSummary: `${data.projectDetails.useCaseType} ${data.projectDetails.taskType} project for ${data.projectDetails.deploymentPlatform}`,
      recommendationSummary: 'Processing...',
      costEstimate: 'Calculating...',
      exportStatus: 'pending'
    };
    
    setActivityLog(prev => [newActivity, ...prev]);
    
    try {
      const result = await generateRecommendations(updatedData);
      
      // Update activity log with results
      setActivityLog(prev => prev.map(activity => 
        activity.id === newActivity.id 
          ? {
              ...activity,
              recommendationSummary: result ? `Recommended ${result.recommendedModel.name} with ${result.finetuningStrategy.approach}` : 'Failed to generate',
              costEstimate: result ? result.computeEstimate.monthlyCost : 'N/A',
              exportStatus: result ? 'completed' : 'failed'
            }
          : activity
      ));
    } catch (err) {
      // Update activity log with error
      setActivityLog(prev => prev.map(activity => 
        activity.id === newActivity.id 
          ? {
              ...activity,
              recommendationSummary: 'Generation failed',
              costEstimate: 'N/A',
              exportStatus: 'failed'
            }
          : activity
      ));
    }
  };

  const handleApplyChanges = (change: ProposedChange) => {
    // Apply changes using the copilot engine
    const result = applyChanges(change, formData, recommendations);
    
    // Add activity log entry
    const newActivity: ActivityLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      userAction: 'AI Copilot Change',
      inputSummary: change.description,
      recommendationSummary: result.summary,
      costEstimate: change.impact.cost || 'N/A',
      exportStatus: 'completed'
    };
    
    setActivityLog(prev => [newActivity, ...prev]);
    
    // Show toast notification
    setToastMessage('Changes applied successfully');
    setShowToast(true);
    
    // In a real implementation, you would update formData and recommendations here
    // For now, we just log the activity
  };

  // Approval workflow handlers
  const handleSubmitForReview = (notes: string) => {
    const updatedMetadata: RecommendationMetadata = {
      ...recommendationMetadata,
      status: 'pending_review',
      submittedAt: new Date(),
      updatedAt: new Date()
    };
    
    setRecommendationMetadata(updatedMetadata);
    
    // Create notification for Solution Architects
    const recipients = getNotificationRecipients('submit', updatedMetadata);
    NotificationService.createNotification(
      'approval_request',
      {
        id: user?.email || '',
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || ''
      },
      recipients,
      updatedMetadata.id,
      updatedMetadata
    );
    
    // Add activity log
    const newActivity: ActivityLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      userAction: 'Submit for Review',
      inputSummary: notes || 'Submitted recommendation for technical review',
      recommendationSummary: 'Awaiting Solution Architect approval',
      costEstimate: recommendationMetadata.estimatedCost,
      exportStatus: 'pending'
    };
    setActivityLog(prev => [newActivity, ...prev]);
    
    setToastMessage('✅ Submitted for review! Solution Architect will be notified.');
    setShowToast(true);
    setShowSubmitModal(false);
  };

  const handleApprove = (comment: string) => {
    const currentUser = {
      id: user?.email || '',
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || ''
    };
    
    let updatedMetadata: RecommendationMetadata;
    
    if (approvalType === 'technical') {
      // Check if budget approval is needed
      const needsBudgetApproval = recommendationMetadata.requiresBudgetApproval;
      
      updatedMetadata = {
        ...recommendationMetadata,
        status: needsBudgetApproval ? 'pending_review' : 'approved', // Keep pending if budget needed
        updatedAt: new Date(),
        approvals: {
          ...recommendationMetadata.approvals,
          technical: {
            id: 'approval-' + Date.now(),
            type: 'technical',
            approver: currentUser,
            status: 'approved',
            comment,
            timestamp: new Date()
          }
        }
      };
      
      setRecommendationMetadata(updatedMetadata);
      
      // Create notification for creator
      const recipients = getNotificationRecipients('approve', updatedMetadata);
      NotificationService.createNotification(
        'approval_granted',
        currentUser,
        recipients,
        updatedMetadata.id,
        updatedMetadata
      );
      
      // If budget approval needed, notify Project Manager
      if (needsBudgetApproval) {
        const pmRecipients = getNotificationRecipients('budget_request', updatedMetadata);
        NotificationService.createNotification(
          'budget_approval_request',
          currentUser,
          pmRecipients,
          updatedMetadata.id,
          updatedMetadata
        );
        
        setToastMessage('✅ Technical approval complete! Budget approval request sent to Specialisation Head (Admin).');
      } else {
        setToastMessage('✅ Recommendation approved! Team has been notified.');
      }
    } else {
      // Budget approval
      updatedMetadata = {
        ...recommendationMetadata,
        status: 'approved', // Fully approved after budget approval
        updatedAt: new Date(),
        approvals: {
          ...recommendationMetadata.approvals,
          budget: {
            id: 'approval-' + Date.now(),
            type: 'budget',
            approver: currentUser,
            status: 'approved',
            comment,
            timestamp: new Date()
          }
        }
      };
      
      setRecommendationMetadata(updatedMetadata);
      
      // Create notification for creator
      const recipients = getNotificationRecipients('approve', updatedMetadata);
      NotificationService.createNotification(
        'budget_approved',
        currentUser,
        recipients,
        updatedMetadata.id,
        updatedMetadata
      );
      
      setToastMessage('✅ Budget approved! Recommendation is fully approved and ready for implementation.');
    }
    
    // Add activity log
    const newActivity: ActivityLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      userAction: `${approvalType === 'technical' ? 'Technical' : 'Budget'} Approval`,
      inputSummary: comment || `Approved by ${currentUser.name}`,
      recommendationSummary: 'Recommendation approved',
      costEstimate: recommendationMetadata.estimatedCost,
      exportStatus: 'completed'
    };
    setActivityLog(prev => [newActivity, ...prev]);
    
    setShowToast(true);
  };

  const handleRequestChanges = (reason: string, priority: 'low' | 'medium' | 'high') => {
    const currentUser = {
      id: user?.email || '',
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || ''
    };
    
    const updatedMetadata: RecommendationMetadata = {
      ...recommendationMetadata,
      status: 'changes_requested',
      updatedAt: new Date(),
      changeRequests: [
        ...recommendationMetadata.changeRequests,
        {
          id: 'change-' + Date.now(),
          requestedBy: currentUser,
          reason,
          changes: [],
          priority,
          assignedTo: recommendationMetadata.createdBy.id,
          timestamp: new Date(),
          resolved: false
        }
      ]
    };
    
    setRecommendationMetadata(updatedMetadata);
    
    // Create notification for creator
    const recipients = getNotificationRecipients('request_changes', updatedMetadata);
    NotificationService.createNotification(
      'changes_requested',
      currentUser,
      recipients,
      updatedMetadata.id,
      updatedMetadata
    );
    
    // Add activity log
    const newActivity: ActivityLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      userAction: 'Changes Requested',
      inputSummary: reason,
      recommendationSummary: `${currentUser.name} requested changes (${priority} priority)`,
      costEstimate: recommendationMetadata.estimatedCost,
      exportStatus: 'pending'
    };
    setActivityLog(prev => [newActivity, ...prev]);
    
    setToastMessage('📝 Change request sent! Creator will be notified.');
    setShowToast(true);
    setShowRequestChangesModal(false);
  };

  const handleResubmit = (notes: string, addressedChangeIds: string[]) => {
    const currentUser = {
      id: user?.email || '',
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || ''
    };

    // Mark addressed change requests as resolved
    const updatedChangeRequests = recommendationMetadata.changeRequests.map(cr =>
      addressedChangeIds.includes(cr.id)
        ? { ...cr, resolved: true, resolvedAt: new Date(), resolvedNotes: notes }
        : cr
    );

    // Create resubmission history entry
    const resubmissionEntry = {
      id: 'resubmit-' + Date.now(),
      resubmittedBy: currentUser,
      timestamp: new Date(),
      notes,
      addressedChangeRequests: addressedChangeIds,
      previousStatus: recommendationMetadata.status
    };

    const updatedMetadata: RecommendationMetadata = {
      ...recommendationMetadata,
      status: 'pending_review',
      updatedAt: new Date(),
      changeRequests: updatedChangeRequests,
      resubmissionHistory: [...recommendationMetadata.resubmissionHistory, resubmissionEntry]
    };

    setRecommendationMetadata(updatedMetadata);

    // Find the original reviewer (who requested changes)
    const unresolvedChangeRequests = recommendationMetadata.changeRequests.filter(
      cr => !cr.resolved
    );
    const reviewerIds = [...new Set(unresolvedChangeRequests.map(cr => cr.requestedBy.id))];

    // Create notification for original reviewer(s)
    reviewerIds.forEach(reviewerId => {
      NotificationService.createNotification(
        'resubmitted',
        currentUser,
        [reviewerId],
        updatedMetadata.id,
        updatedMetadata
      );
    });

    // Add activity log
    const newActivity: ActivityLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      userAction: 'Resubmitted for Review',
      inputSummary: notes || `Addressed ${addressedChangeIds.length} change request(s)`,
      recommendationSummary: 'Resubmitted for re-evaluation',
      costEstimate: recommendationMetadata.estimatedCost,
      exportStatus: 'pending'
    };
    setActivityLog(prev => [newActivity, ...prev]);

    setToastMessage('🔄 Resubmitted for review! Reviewer will be notified of your changes.');
    setShowToast(true);
    setShowResubmitModal(false);
  };

  const handleOpenApproveModal = (type: 'technical' | 'budget') => {
    setApprovalType(type);
    setShowApproveModal(true);
  };

  return (
    <>
      {showBackButton && (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">
              {user?.role === 'solution-architect' 
                ? 'Back to Architect Dashboard' 
                : 'Back to Admin Dashboard'}
            </span>
          </button>
        </div>
      )}
      
      <Layout
        showAvatar={true}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        activityLog={activityLog}
        showCollaboration={true}
        onShare={() => setShowShareModal(true)}
        leftPanel={
          <div className="space-y-6">
            <InputForm 
              onSubmit={handleFormSubmit}
              loading={loading}
            />
          </div>
        }
        rightPanel={
          <>
            <ResultsDashboard
              recommendations={recommendations}
              formData={formData}
              loading={loading}
              error={error}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              recommendationMetadata={recommendationMetadata}
              onSubmitForReview={() => setShowSubmitModal(true)}
              onApprove={handleOpenApproveModal}
              onRequestChanges={() => setShowRequestChangesModal(true)}
              onResubmit={() => setShowResubmitModal(true)}
              currentUserRole={user?.role}
            />
            <AICopilot
              context={{
                activeTab,
                formData,
                recommendations,
                activityLog
              }}
              onApplyChanges={handleApplyChanges}
              isVisible={!!(recommendations !== null || (formData?.projectDescription?.generatedPipeline && formData.projectDescription.generatedPipeline.length > 0))}
            />
          </>
        }
      />
      
      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        projectName={formData?.projectDescription?.description || 'ML Recommendation Project'}
      />
      
      {/* Approval Modals */}
      <SubmitReviewModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmitForReview}
        projectTitle={recommendationMetadata.title}
      />
      
      <ApproveModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onApprove={handleApprove}
        projectTitle={recommendationMetadata.title}
        approvalType={approvalType}
      />
      
      <RequestChangesModal
        isOpen={showRequestChangesModal}
        onClose={() => setShowRequestChangesModal(false)}
        onSubmit={handleRequestChanges}
        projectTitle={recommendationMetadata.title}
      />
      
      <ResubmitModal
        isOpen={showResubmitModal}
        onClose={() => setShowResubmitModal(false)}
        onSubmit={handleResubmit}
        projectTitle={recommendationMetadata.title}
        changeRequests={recommendationMetadata.changeRequests.filter(cr => !cr.resolved)}
      />
      
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}

export default App;