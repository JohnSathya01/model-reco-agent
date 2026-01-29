import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Select } from '../ui';
import { USE_CASE_OPTIONS, TASK_TYPE_OPTIONS, DEPLOYMENT_OPTIONS } from '../../types/forms';
import type { FormData } from '../../types';

interface ProjectDetailsFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  register,
  errors
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
        <div className="space-y-4">
          <Select
            label="Use Case Type"
            placeholder="Select use case type"
            options={USE_CASE_OPTIONS}
            required
            error={errors.projectDetails?.useCaseType?.message}
            {...register('projectDetails.useCaseType')}
          />

          <Select
            label="Task Type"
            placeholder="Select task type"
            options={TASK_TYPE_OPTIONS}
            required
            error={errors.projectDetails?.taskType?.message}
            {...register('projectDetails.taskType')}
          />

          <Select
            label="Deployment Platform"
            placeholder="Select deployment platform"
            options={DEPLOYMENT_OPTIONS}
            required
            error={errors.projectDetails?.deploymentPlatform?.message}
            {...register('projectDetails.deploymentPlatform')}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsForm;