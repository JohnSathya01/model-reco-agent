import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui';
import DynamicForm from './DynamicForm';
import ProjectDescriptionForm from './ProjectDescriptionForm';
import { formSchema } from '../../utils/validation';
import type { FormData } from '../../types';

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  loading?: boolean;
  className?: string;
}

const InputForm: React.FC<InputFormProps> = ({
  onSubmit,
  loading = false,
  className = ''
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      projectDescription: {
        description: '',
        generatedPipeline: []
      },
      projectDetails: {
        useCaseType: 'CV',
        taskType: 'Classification',
        deploymentPlatform: 'AWS SageMaker'
      },
      dataset: {
        size: 1000,
        format: 'Images',
        labelQuality: 'High',
        resolution: '',
        augmentationLevel: 'Basic',
        fpsRequirement: 30
      },
      constraints: {
        budgetLevel: 'Moderate',
        targetAccuracy: 90,
        latencyRequirement: 100,
        memoryLimit: 8,
        contextLength: 2048,
        tokensPerRequest: 100,
        concurrentUsers: 10,
        accuracyTarget: 90
      },
      costSimulation: {
        workloadType: 'both',
        trainingHoursPerMonth: 100,
        inferenceHoursPerDay: 24,
        requestsPerSecond: 10,
        storageSize: 100,
        dataTransfer: 50,
        environments: 3
      }
    }
  });

  const watchedUseCaseType = watch('projectDetails.useCaseType');
  const watchedProjectDescription = watch('projectDescription');
  const watchedDeploymentPlatform = watch('projectDetails.deploymentPlatform');
  const watchedWorkloadType = watch('costSimulation.workloadType');

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const handleProjectDescriptionChange = (description: typeof watchedProjectDescription) => {
    setValue('projectDescription', description, { shouldValidate: true });
  };

  const handleDeploymentPlatformChange = (platform: string) => {
    setValue('projectDetails.deploymentPlatform', platform as any, { shouldValidate: true });
  };

  return (
    <form 
      onSubmit={handleSubmit(handleFormSubmit)} 
      className={`flex flex-col ${className}`}
      noValidate
      aria-label="AI Model Recommendation Configuration Form"
    >
      {/* Form Content */}
      <div className="space-y-6">
        {/* Project Description Section */}
        <ProjectDescriptionForm
          value={watchedProjectDescription}
          onChange={handleProjectDescriptionChange}
          deploymentPlatform={watchedDeploymentPlatform}
          onDeploymentPlatformChange={handleDeploymentPlatformChange}
        />

        {/* Dynamic Form Section */}
        <div className="border-t border-gray-200 pt-6">
          <DynamicForm 
            register={register} 
            errors={errors}
            useCaseType={watchedUseCaseType}
            workloadType={watchedWorkloadType}
          />
        </div>
      </div>

      {/* Submit Button - Sticky at bottom with shadow */}
      <div className="sticky bottom-0 mt-6 -mx-6 px-6 py-4 bg-white border-t border-gray-200 shadow-lg">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          disabled={!isValid || loading}
          className="w-full"
          aria-describedby="submit-help"
        >
          {loading ? 'Generating...' : '🚀 Generate Recommendation'}
        </Button>
        <p 
          id="submit-help" 
          className="text-xs text-gray-500 mt-2 text-center"
        >
          {!isValid 
            ? 'Please fill in all required fields to generate recommendations'
            : 'Click to generate AI model recommendations based on your requirements'
          }
        </p>
      </div>
    </form>
  );
};

export default InputForm;