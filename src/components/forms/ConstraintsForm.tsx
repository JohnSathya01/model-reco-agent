import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input, Select } from '../ui';
import { BUDGET_OPTIONS } from '../../types/forms';
import type { FormData } from '../../types';

interface ConstraintsFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const ConstraintsForm: React.FC<ConstraintsFormProps> = ({
  register,
  errors
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Constraints</h3>
        <div className="space-y-6">
          <div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Target Accuracy
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <span className="text-sm font-medium text-gray-900">
                  85%
                </span>
              </div>
              
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                defaultValue={85}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 85%, #e5e7eb 85%, #e5e7eb 100%)`
                }}
                {...register('constraints.targetAccuracy', {
                  valueAsNumber: true,
                  min: { value: 0, message: 'Target accuracy must be at least 0%' },
                  max: { value: 100, message: 'Target accuracy cannot exceed 100%' }
                })}
              />
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>100%</span>
              </div>
              
              {errors.constraints?.targetAccuracy && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.constraints.targetAccuracy.message}
                </p>
              )}
            </div>
          </div>

          <Input
            label="Latency Requirement"
            type="number"
            placeholder="Enter latency in milliseconds"
            required
            error={errors.constraints?.latencyRequirement?.message}
            {...register('constraints.latencyRequirement', {
              valueAsNumber: true,
              min: { value: 1, message: 'Latency requirement must be at least 1ms' }
            })}
          />

          <Select
            label="Budget Level"
            placeholder="Select budget level"
            options={BUDGET_OPTIONS}
            required
            error={errors.constraints?.budgetLevel?.message}
            {...register('constraints.budgetLevel')}
          />

          <Input
            label="Memory Limit"
            type="number"
            placeholder="Enter memory limit in GB"
            required
            error={errors.constraints?.memoryLimit?.message}
            {...register('constraints.memoryLimit', {
              valueAsNumber: true,
              min: { value: 1, message: 'Memory limit must be at least 1GB' }
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default ConstraintsForm;