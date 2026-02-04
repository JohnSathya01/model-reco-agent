import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout } from './components/layout';
import { InputForm } from './components/forms';
import { ResultsDashboard } from './components/dashboard';
import { AICopilot } from './components/copilot';
import { ShareModal } from './components/collaboration';
import { Toast } from './components/ui/Toast';
import { useFormState, useRecommendations } from './hooks';
import { generatePipeline } from './utils/pipelineGenerator';
import { applyChanges } from './utils/copilotEngine';
import { useAuth } from './contexts/AuthContext';
import type { FormData as AppFormData, ActivityLogEntry, ProposedChange } from './types';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { formData, setFormData } = useFormState();
  const { recommendations, loading, error, generateRecommendations } = useRecommendations();
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4');
  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'analysis' | 'api'>('overview');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  // Check if user came from /generate route (architect creating new architecture)
  const showBackButton = location.pathname === '/generate' && user?.role === 'solution-architect';

  const handleBack = () => {
    navigate('/architect');
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

  return (
    <>
      {showBackButton && (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Architect Dashboard</span>
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