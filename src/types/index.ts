// Re-export all types for easy importing
export * from './forms';
export * from './recommendations';

// UI component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  variant?: 'default' | 'outlined' | 'elevated';
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'email';
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export interface SelectProps {
  label: string;
  name?: string;
  options: readonly string[] | string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onBlur?: React.FocusEventHandler<HTMLSelectElement>;
}

export interface SliderProps {
  label: string;
  name: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  required?: boolean;
  error?: string;
  className?: string;
}