import React from 'react';
import type { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({ 
  title, 
  variant = 'default', 
  className = '', 
  children 
}) => {
  const baseClasses = 'bg-white rounded-xl border transition-shadow duration-200';
  
  const variantClasses = {
    default: 'border-gray-200 shadow-sm',
    outlined: 'border-gray-300 shadow-none',
    elevated: 'border-gray-200 shadow-lg'
  };

  const hoverClasses = 'hover:shadow-md';

  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  return (
    <article 
      className={cardClasses}
      role="region"
      aria-labelledby={title ? `card-title-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined}
    >
      {title && (
        <header className="px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-100">
          <h3 
            id={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-base lg:text-lg font-semibold text-gray-900"
          >
            {title}
          </h3>
        </header>
      )}
      <div className={title ? 'p-4 lg:p-6' : 'p-4 lg:p-6'}>
        {children}
      </div>
    </article>
  );
};

export default Card;