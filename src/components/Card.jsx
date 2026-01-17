import React from 'react';

const Card = ({
  children,
  className = '',
  variant = 'default',
  glass = false,
  liquid,
  ...props
}) => {
  // Remove liquid prop to prevent React warning
  const { liquid: liquidProp, ...restProps } = props;

  if (glass) {
    return (
      <div
        {...restProps}
        className={`rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-6 ${className}`}
      >
        {children}
      </div>
    );
  }

  if (liquidProp) {
    return (
      <div
        {...restProps}
        className={`rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 border border-purple-200 dark:border-purple-800/50 ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      {...restProps}
      className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

Card.Content = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;