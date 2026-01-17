import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'default',
  size = 'default',
  loading = false,
  disabled = false,
  className = '',
  asChild,
  ...props
}) => {
  const baseClasses = 'flex items-center justify-center font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent';

  const variants = {
    default: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
    primary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white focus:ring-purple-500',
    ghost: 'text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 focus:ring-purple-500',
    link: 'text-purple-600 underline-offset-4 hover:underline focus:ring-purple-500'
  };

  const sizes = {
    default: 'px-6 py-3 rounded-lg text-base',
    sm: 'px-4 py-2 rounded-md text-sm',
    lg: 'px-8 py-4 rounded-xl text-lg',
    xl: 'px-10 py-5 rounded-2xl text-xl'
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  // Remove asChild from props to prevent React warning
  const { asChild: asChildProp, ...restProps } = props;

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...restProps}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;