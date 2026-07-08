// src/components/ui/alert.tsx
import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
  className?: string;
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const variants = {
    default: 'ui-alert-info',
    destructive: 'ui-alert-danger',
  };

  return (
    <div
      className={`ui-alert ${variants[variant]} ${className}`}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h5 className={`ui-alert-title ${className}`} {...props}>
    {children}
  </h5>
);

export const AlertDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`ui-alert-description ${className}`} {...props}>
    {children}
  </div>
);
