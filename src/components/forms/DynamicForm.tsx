import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Select, Input, Slider } from '../ui';
import { 
  USE_CASE_OPTIONS, 
  CV_TASK_OPTIONS, 
  LLM_TASK_OPTIONS, 
  FORMAT_OPTIONS,
  QUALITY_OPTIONS,
  BUDGET_OPTIONS,
  AUGMENTATION_OPTIONS,
  type FormData 
} from '../../types';

interface DynamicFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  useCaseType?: 'CV' | 'LLM';
  className?: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  register,
  errors,
  useCaseType,
  className = ''
}) => {
  const getTaskOptions = () => {
    if (useCaseType === 'LLM') return LLM_TASK_OPTIONS;
    if (useCaseType === 'CV') return CV_TASK_OPTIONS;
    return [...CV_TASK_OPTIONS, ...LLM_TASK_OPTIONS];
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Project Details Section */}
      <div className="space-y-6">
        <div className="section-divider">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              ⚙️
            </span>
            Project Configuration
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Define your AI project requirements and deployment preferences
          </p>
        </div>
        
        <div className="form-section">
          <div className="form-grid">
            <Select
              label="Use Case Type"
              options={USE_CASE_OPTIONS}
              placeholder="Select use case type"
              required
              error={errors.projectDetails?.useCaseType?.message}
              {...register('projectDetails.useCaseType')}
            />

            <Select
              label="Task Type"
              options={getTaskOptions()}
              placeholder="Select task type"
              required
              error={errors.projectDetails?.taskType?.message}
              {...register('projectDetails.taskType')}
            />
          </div>
        </div>
      </div>

      {/* CV-Specific Fields */}
      {useCaseType === 'CV' && (
        <div className="space-y-6">
          <div className="section-divider">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                👁️
              </span>
              Computer Vision Configuration
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Configure your dataset and performance requirements for computer vision tasks
            </p>
          </div>
          
          <div className="form-section">
            <div className="form-grid">
              <Input
                label="Dataset Size"
                type="number"
                placeholder="Number of samples"
                required
                error={errors.dataset?.size?.message}
                {...register('dataset.size', { valueAsNumber: true })}
              />

              <Select
                label="Dataset Format"
                options={FORMAT_OPTIONS}
                placeholder="Select format"
                required
                error={errors.dataset?.format?.message}
                {...register('dataset.format')}
              />
            </div>

            <div className="form-grid">
              <Select
                label="Label Quality"
                options={QUALITY_OPTIONS}
                placeholder="Select quality"
                required
                error={errors.dataset?.labelQuality?.message}
                {...register('dataset.labelQuality')}
              />

              <Input
                label="Image Resolution"
                placeholder="e.g., 1920x1080"
                error={errors.dataset?.resolution?.message}
                {...register('dataset.resolution')}
              />
            </div>

            <div className="form-grid">
              <Select
                label="Augmentation Level"
                options={AUGMENTATION_OPTIONS}
                placeholder="Select augmentation"
                error={errors.dataset?.augmentationLevel?.message}
                {...register('dataset.augmentationLevel')}
              />

              <Input
                label="FPS Requirement"
                type="number"
                placeholder="Frames per second"
                error={errors.dataset?.fpsRequirement?.message}
                {...register('dataset.fpsRequirement', { valueAsNumber: true })}
              />
            </div>

            <div className="form-grid">
              <div className="space-y-2">
                <label className="label">
                  Target Accuracy <span className="text-red-500">*</span>
                </label>
                {(() => {
                  const { name, onChange, onBlur, ref } = register('constraints.targetAccuracy', { valueAsNumber: true });
                  return (
                    <Slider
                      label=""
                      name={name}
                      min={70}
                      max={99}
                      step={1}
                      unit="%"
                      required
                      error={errors.constraints?.targetAccuracy?.message}
                      onChange={onChange}
                      onBlur={onBlur}
                      ref={ref}
                    />
                  );
                })()}
              </div>

              <Input
                label="Latency Requirement"
                type="number"
                placeholder="Milliseconds"
                required
                error={errors.constraints?.latencyRequirement?.message}
                {...register('constraints.latencyRequirement', { valueAsNumber: true })}
              />
            </div>

            <div className="form-grid">
              <Select
                label="Budget Level"
                options={BUDGET_OPTIONS}
                placeholder="Select budget"
                required
                error={errors.constraints?.budgetLevel?.message}
                {...register('constraints.budgetLevel')}
              />

              <Input
                label="Memory Limit"
                type="number"
                placeholder="GB"
                required
                error={errors.constraints?.memoryLimit?.message}
                {...register('constraints.memoryLimit', { valueAsNumber: true })}
              />
            </div>
          </div>
        </div>
      )}

      {/* LLM-Specific Fields */}
      {useCaseType === 'LLM' && (
        <div className="space-y-6">
          <div className="section-divider">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                🧠
              </span>
              Large Language Model Configuration
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Configure your language model requirements and performance targets
            </p>
          </div>
          
          <div className="form-section">
            <div className="form-grid">
              <Input
                label="Context Length"
                type="number"
                placeholder="Maximum tokens"
                required
                error={errors.constraints?.contextLength?.message}
                {...register('constraints.contextLength', { valueAsNumber: true })}
              />

              <Input
                label="Expected Tokens per Request"
                type="number"
                placeholder="Average tokens"
                required
                error={errors.constraints?.tokensPerRequest?.message}
                {...register('constraints.tokensPerRequest', { valueAsNumber: true })}
              />
            </div>

            <div className="form-grid">
              <Input
                label="Concurrent Users"
                type="number"
                placeholder="Number of users"
                required
                error={errors.constraints?.concurrentUsers?.message}
                {...register('constraints.concurrentUsers', { valueAsNumber: true })}
              />

              <div className="space-y-2">
                <label className="label">
                  Accuracy Target <span className="text-red-500">*</span>
                </label>
                {(() => {
                  const { name, onChange, onBlur, ref } = register('constraints.accuracyTarget', { valueAsNumber: true });
                  return (
                    <Slider
                      label=""
                      name={name}
                      min={70}
                      max={99}
                      step={1}
                      unit="%"
                      required
                      error={errors.constraints?.accuracyTarget?.message}
                      onChange={onChange}
                      onBlur={onBlur}
                      ref={ref}
                    />
                  );
                })()}
              </div>
            </div>

            <div className="w-full">
              <Select
                label="Budget Level"
                options={BUDGET_OPTIONS}
                placeholder="Select budget"
                required
                error={errors.constraints?.budgetLevel?.message}
                {...register('constraints.budgetLevel')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cost Simulation Section */}
      <div className="space-y-6">
        <div className="section-divider">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              💰
            </span>
            Cost Simulation Parameters
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Define your usage patterns for accurate cost estimation
          </p>
        </div>
        
        <div className="form-section">
          <div className="form-grid">
            <Input
              label="Training Hours per Month"
              type="number"
              placeholder="Hours"
              required
              error={errors.costSimulation?.trainingHoursPerMonth?.message}
              {...register('costSimulation.trainingHoursPerMonth', { valueAsNumber: true })}
            />

            <Input
              label="Inference Hours per Day"
              type="number"
              placeholder="Hours"
              required
              error={errors.costSimulation?.inferenceHoursPerDay?.message}
              {...register('costSimulation.inferenceHoursPerDay', { valueAsNumber: true })}
            />
          </div>

          <div className="form-grid">
            <Input
              label="Requests per Second"
              type="number"
              placeholder="RPS"
              required
              error={errors.costSimulation?.requestsPerSecond?.message}
              {...register('costSimulation.requestsPerSecond', { valueAsNumber: true })}
            />

            <Input
              label="Storage Size"
              type="number"
              placeholder="GB"
              required
              error={errors.costSimulation?.storageSize?.message}
              {...register('costSimulation.storageSize', { valueAsNumber: true })}
            />
          </div>

          <div className="form-grid">
            <Input
              label="Data Transfer"
              type="number"
              placeholder="GB per month"
              required
              error={errors.costSimulation?.dataTransfer?.message}
              {...register('costSimulation.dataTransfer', { valueAsNumber: true })}
            />

            <Input
              label="Number of Environments"
              type="number"
              placeholder="Dev/QA/Prod"
              required
              error={errors.costSimulation?.environments?.message}
              {...register('costSimulation.environments', { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;