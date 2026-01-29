import { useState } from 'react';
import { Layout } from './components/layout';
import { InputForm } from './components/forms';
import { ResultsDashboard } from './components/dashboard';
import { useFormState, useRecommendations } from './hooks';
import { generatePipeline } from './utils/pipelineGenerator';
import type { FormData as AppFormData, ActivityLogEntry } from './types';

function App() {
  const { formData, setFormData } = useFormState();
  const { recommendations, loading, error, generateRecommendations } = useRecommendations();
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);

  const handleFormSubmit = async (data: AppFormData) => {
    setFormData(data);
    
    // Generate ML Pipeline automatically
    console.log('🚀 Generating ML Pipeline automatically...');
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

  return (
    <Layout
      showAvatar={true}
      leftPanel={
        <div className="space-y-6">
          <InputForm 
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        </div>
      }
      rightPanel={
        <ResultsDashboard
          recommendations={recommendations}
          formData={formData}
          loading={loading}
          error={error}
          activityLog={activityLog}
        />
      }
    />
  );
}

export default App;