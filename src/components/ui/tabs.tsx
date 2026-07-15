// src/components/ui/tabs.tsx
import React, { useState } from 'react';
import type { ReactNode } from 'react';

interface TabsContextType {
  activeTab?: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export function Tabs({ 
  value, 
  onValueChange, 
  children, 
  className = '', 
  defaultValue 
}: { 
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
  defaultValue?: string;
}) {
  const [activeTab, setActiveTab] = useState(value || defaultValue);

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
}

export function TabsList({ 
  children, 
  className = '' 
}: { 
  children: ReactNode;
  className?: string;
}) {
  const context = React.useContext(TabsContext);
  
  return (
    <div className={`flex flex-wrap gap-2 rounded-xl border border-gold-500/10 bg-navy-800/60 p-1 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsTrigger) {
          const childProps = child.props as { value: string };
          const isActive = childProps.value === context?.activeTab;
          return React.cloneElement(child, { 
            isActive,
            onClick: () => context?.setActiveTab(childProps.value)
          } as any);
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({ 
  value, 
  children, 
  className = '', 
  isActive, 
  onClick 
}: { 
  value: string;
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      value={value}
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-gold-500 text-navy-950 shadow-sm shadow-gold-500/30' 
          : 'text-gray-400 hover:bg-navy-700 hover:text-gold-300'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ 
  value, 
  children, 
  className = '' 
}: { 
  value: string;
  children: ReactNode;
  className?: string;
}) {
  const context = React.useContext(TabsContext);
  return (
    <div className={className} style={{ display: context?.activeTab === value ? 'block' : 'none' }}>
      {children}
    </div>
  );
}