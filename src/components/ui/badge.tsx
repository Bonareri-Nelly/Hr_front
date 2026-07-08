// src/components/ui/badge.tsx
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'destructive' | 'success' | 'warning';
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const variants = {
    default: 'pill-info',
    outline: 'pill-outline',
    destructive: 'pill-danger',
    success: 'pill-success',
    warning: 'pill-warning',
  };

  return (
    <span
      className={`pill ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
