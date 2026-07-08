// src/components/ui/tabs.tsx
import React, { useState } from 'react';
import type { ReactElement, ReactNode } from 'react';

interface TabsContextType {
  activeTab?: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export const Tabs: React.FC<{
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}> = ({ value, onValueChange, children, className = '' }) => {
  const [activeTab, setActiveTab] = useState(value);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ activeTab: value || activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const context = React.useContext(TabsContext);
  
  return (
    <div className={`ui-tabs-list ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsTrigger) {
          const tabChild = child as ReactElement<{
            value: string;
            isActive?: boolean;
            onClick?: () => void;
          }>;
          const isActive = tabChild.props.value === context?.activeTab;
          return React.cloneElement(child, { 
            isActive,
            onClick: () => context?.setActiveTab(tabChild.props.value)
          } as any);
        }
        return child;
      })}
    </div>
  );
};

export const TabsTrigger: React.FC<{
  value: string;
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}> = ({ children, className = '', isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`ui-tabs-trigger${isActive ? ' active' : ''} ${className}`}
  >
    {children}
  </button>
);

export const TabsContent: React.FC<{
  value: string;
  children: ReactNode;
  className?: string;
}> = ({ value, children, className = '' }) => {
  const context = React.useContext(TabsContext);
  return (
    <div className={className} style={{ display: context?.activeTab === value ? 'block' : 'none' }}>
      {children}
    </div>
  );
};
