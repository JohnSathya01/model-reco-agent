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
  workloadType?: 'both' | 'training-only' | 'inference-only';
  className?: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  register,
  errors,
  useCaseType,
  workloadType = 'both',
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
              tooltip="Choose between Computer Vision (CV) for image/video tasks or Large Language Model (LLM) for text-based tasks"
              error={errors.projectDetails?.useCaseType?.message}
              {...register('projectDetails.useCaseType')}
            />

            <Select
              label="Task Type"
              options={getTaskOptions()}
              placeholder="Select task type"
              required
              tooltip="Specific AI task you want to accomplish (e.g., Classification, Detection, Chat, Summarization)"
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
                tooltip="Total number of images or samples in your training dataset (e.g., 10,000 images)"
                error={errors.dataset?.size?.message}
                {...register('dataset.size', { valueAsNumber: true })}
              />

              <Select
                label="Dataset Format"
                options={FORMAT_OPTIONS}
                placeholder="Select format"
                required
                tooltip="Primary format of your data: Images (JPEG/PNG), Video (MP4), Text, or Mixed"
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
                tooltip="Quality of your dataset annotations: High (professional), Medium (crowdsourced), Low (automated)"
                error={errors.dataset?.labelQuality?.message}
                {...register('dataset.labelQuality')}
              />

              <Input
                label="Image Resolution"
                placeholder="e.g., 1920x1080"
                tooltip="Typical resolution of your images (e.g., 1920x1080, 640x480). Higher resolution requires more compute"
                error={errors.dataset?.resolution?.message}
                {...register('dataset.resolution')}
              />
            </div>

            <div className="form-grid">
              <Select
                label="Augmentation Level"
                options={AUGMENTATION_OPTIONS}
                placeholder="Select augmentation"
                tooltip="Data augmentation strategy: None (use as-is), Basic (flip/rotate), Advanced (complex transformations)"
                error={errors.dataset?.augmentationLevel?.message}
                {...register('dataset.augmentationLevel')}
              />

              <Input
                label="FPS Requirement"
                type="number"
                placeholder="Frames per second"
                tooltip="Required processing speed for video tasks (e.g., 30 FPS for real-time, 1 FPS for batch processing)"
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
                      tooltip="Minimum acceptable model accuracy. Higher accuracy typically requires more complex models and training time"
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
                tooltip="Maximum acceptable response time in milliseconds (e.g., 100ms for real-time, 1000ms for batch)"
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
                tooltip="Your budget constraint: Low (<$1k/month), Moderate ($1k-$10k/month), High (>$10k/month)"
                error={errors.constraints?.budgetLevel?.message}
                {...register('constraints.budgetLevel')}
              />

              <Input
                label="Memory Limit"
                type="number"
                placeholder="GB"
                required
                tooltip="Maximum GPU/system memory available for model inference in gigabytes (e.g., 8GB, 16GB)"
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
                tooltip="Maximum number of tokens the model can process at once (e.g., 2048, 4096, 8192). Longer context = higher cost"
                error={errors.constraints?.contextLength?.message}
                {...register('constraints.contextLength', { valueAsNumber: true })}
              />

              <Input
                label="Expected Tokens per Request"
                type="number"
                placeholder="Average tokens"
                required
                tooltip="Average number of tokens per API request (input + output). Used for cost estimation"
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
                tooltip="Expected number of simultaneous users. Affects infrastructure sizing and scaling requirements"
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
                      tooltip="Minimum acceptable model performance. Higher targets may require larger, more expensive models"
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
                tooltip="Your budget constraint: Low (<$1k/month), Moderate ($1k-$10k/month), High (>$10k/month)"
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
          {/* Workload Type Selector */}
          <div className="mb-6">
            <label htmlFor="workloadType" className="block text-sm font-medium text-gray-700 mb-1">
              Workload Type
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="workloadType"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              {...register('costSimulation.workloadType')}
            >
              <option value="both">Training & Inference</option>
              <option value="training-only">Training Only</option>
              <option value="inference-only">Inference Only</option>
            </select>
            {errors.costSimulation?.workloadType && (
              <p className="text-sm text-red-600 mt-1">{errors.costSimulation.workloadType.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Choose whether you need training, inference, or both for your project
            </p>
          </div>

          {/* Conditional Training/Inference Fields */}
          {(workloadType === 'both' || workloadType === 'training-only') && (
            <div className="form-grid mb-4">
              <Input
                label="Training Hours per Month"
                type="number"
                placeholder="Hours"
                required
                tooltip="Expected monthly training hours. Used to estimate training compute costs (e.g., 100 hours/month)"
                error={errors.costSimulation?.trainingHoursPerMonth?.message}
                {...register('costSimulation.trainingHoursPerMonth', { valueAsNumber: true })}
              />
              {workloadType === 'both' && (
                <Input
                  label="Inference Hours per Day"
                  type="number"
                  placeholder="Hours"
                  required
                  tooltip="Hours per day the model will serve predictions. 24 = always-on service"
                  error={errors.costSimulation?.inferenceHoursPerDay?.message}
                  {...register('costSimulation.inferenceHoursPerDay', { valueAsNumber: true })}
                />
              )}
            </div>
          )}

          {workloadType === 'inference-only' && (
            <div className="form-grid mb-4">
              <Input
                label="Inference Hours per Day"
                type="number"
                placeholder="Hours"
                required
                tooltip="Hours per day the model will serve predictions. 24 = always-on service"
                error={errors.costSimulation?.inferenceHoursPerDay?.message}
                {...register('costSimulation.inferenceHoursPerDay', { valueAsNumber: true })}
              />
            </div>
          )}

          <div className="form-grid">
            <Input
              label="Requests per Second"
              type="number"
              placeholder="RPS"
              required
              tooltip="Expected API requests per second at peak load. Affects instance sizing and auto-scaling configuration"
              error={errors.costSimulation?.requestsPerSecond?.message}
              {...register('costSimulation.requestsPerSecond', { valueAsNumber: true })}
            />

            <Input
              label="Storage Size"
              type="number"
              placeholder="GB"
              required
              tooltip="Total storage needed for models, datasets, and logs in gigabytes (e.g., 100GB)"
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
              tooltip="Expected monthly data transfer (ingress + egress) in gigabytes. Affects bandwidth costs"
              error={errors.costSimulation?.dataTransfer?.message}
              {...register('costSimulation.dataTransfer', { valueAsNumber: true })}
            />

            <Input
              label="Number of Environments"
              type="number"
              placeholder="Dev/QA/Prod"
              required
              tooltip="Number of deployment environments (e.g., 3 for Dev/QA/Prod). Each environment incurs separate costs"
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