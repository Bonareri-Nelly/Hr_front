// src/components/ui/select.tsx
import React, { useState } from 'react';
import type { ReactNode } from 'react';

interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

export const Select: React.FC<{
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}> = ({ value, onValueChange, children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className={`ui-select ${className}`}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger: React.FC<{
  className?: string;
  children: ReactNode;
}> = ({ className = '', children }) => {
  const context = React.useContext(SelectContext);
  return (
    <button
      onClick={() => context?.setIsOpen(!context.isOpen)}
      className={`select-control ui-select-trigger ${className}`}
    >
      {children}
    </button>
  );
};

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  const context = React.useContext(SelectContext);
  return <span>{context?.value || placeholder}</span>;
};

export const SelectContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const context = React.useContext(SelectContext);
  if (!context?.isOpen) return null;
  return (
    <div className="ui-select-content">
      {children}
    </div>
  );
};

export const SelectItem: React.FC<{
  value: string;
  children: ReactNode;
}> = ({ value, children }) => {
  const context = React.useContext(SelectContext);
  return (
    <button
      onClick={() => {
        context?.onValueChange?.(value);
        context?.setIsOpen(false);
      }}
      className="ui-select-item"
    >
      {children}
    </button>
  );
};
