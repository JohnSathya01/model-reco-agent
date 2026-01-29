import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SelectProps } from '../../types';

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  name,
  options,
  placeholder,
  required = false,
  error,
  className = '',
  ...props
}, ref) => {
  const selectClasses = `
    w-full px-3 py-2 border rounded-lg transition-colors duration-200 appearance-none
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    bg-white cursor-pointer
    ${error 
      ? 'border-red-300 focus:ring-red-500' 
      : 'border-gray-300 hover:border-gray-400'
    }
    ${className}
  `;

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={name}
          name={name}
          required={required}
          className={selectClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" 
        />
      </div>
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;