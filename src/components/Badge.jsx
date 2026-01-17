import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    primary: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    outline: 'border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;