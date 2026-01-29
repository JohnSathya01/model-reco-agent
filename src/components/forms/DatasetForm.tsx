import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input, Select } from '../ui';
import { FORMAT_OPTIONS, QUALITY_OPTIONS } from '../../types/forms';
import type { FormData } from '../../types';

interface DatasetFormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const DatasetForm: React.FC<DatasetFormProps> = ({
  register,
  errors
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dataset Information</h3>
        <div className="space-y-4">
          <Input
            label="Dataset Size"
            type="number"
            placeholder="Enter number of samples"
            required
            error={errors.dataset?.size?.message}
            {...register('dataset.size', { 
              valueAsNumber: true,
              min: { value: 1, message: 'Dataset size must be at least 1' },
              max: { value: 1000000000, message: 'Dataset size is too large' }
            })}
          />

          <Select
            label="Dataset Format"
            placeholder="Select dataset format"
            options={FORMAT_OPTIONS}
            required
            error={errors.dataset?.format?.message}
            {...register('dataset.format')}
          />

          <Select
            label="Label Quality"
            placeholder="Select label quality"
            options={QUALITY_OPTIONS}
            required
            error={errors.dataset?.labelQuality?.message}
            {...register('dataset.labelQuality')}
          />
        </div>
      </div>
    </div>
  );
};

export default DatasetForm;