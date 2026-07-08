// src/components/ui/card.tsx
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <div className={`panel ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <div className={`panel-header ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <h3 className={`panel-title ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <p className={`panel-description ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<CardProps> = ({ className = '', children, ...props }) => (
  <div className={`panel-body ${className}`} {...props}>
    {children}
  </div>
);
