import React, { forwardRef, useState } from 'react';
import type { SliderProps } from '../../types';
import Tooltip from './Tooltip';

interface SliderInputProps extends Omit<SliderProps, 'name' | 'min' | 'max'> {
  defaultValue?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  min: number;
  max: number;
  tooltip?: string;
}

const Slider = forwardRef<HTMLInputElement, SliderInputProps>(({
  label,
  name,
  min,
  max,
  step = 1,
  unit = '',
  required = false,
  error,
  className = '',
  tooltip,
  onBlur,
  ...props
}, ref) => {
  const [value, setValue] = useState(props.defaultValue || min);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  const percentage = ((Number(value) - min) / (max - min)) * 100;

  const sliderClasses = `
    w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
    ${className}
  `;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 flex items-center gap-1">
          <span>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          {tooltip && <Tooltip content={tooltip} />}
        </label>
        <span 
          className="text-sm font-medium text-gray-900"
          aria-live="polite"
          aria-label={`Current value: ${value}${unit}`}
        >
          {value}{unit}
        </span>
      </div>
      
      <div className="relative">
        <input
          ref={ref}
          id={name}
          name={name}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          className={sliderClasses}
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : `${name}-range`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value}${unit}`}
          {...props}
        />
      </div>
      
      <div 
        id={`${name}-range`}
        className="flex justify-between text-xs text-gray-500"
        aria-label={`Range from ${min}${unit} to ${max}${unit}`}
      >
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
      
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Slider.displayName = 'Slider';

export default Slider;