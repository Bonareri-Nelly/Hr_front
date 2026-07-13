// src/components/ui/checkbox.tsx
import React from 'react';

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onCheckedChange,
  className = '',
}) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={`h-4 w-4 rounded border-gray-700 bg-gray-900 text-gold-500 focus:ring-gold-500 focus:ring-offset-gray-900 ${className}`}
    />
  );
};