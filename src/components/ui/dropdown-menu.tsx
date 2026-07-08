// src/components/ui/dropdown-menu.tsx
import React, { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

interface DropdownMenuProps {
  children: ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find children by type
  let trigger: ReactNode = null;
  let content: ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === DropdownMenuTrigger) {
        trigger = React.cloneElement(child, { 
          onClick: () => setIsOpen(!isOpen) 
        } as any);
      }
      if (child.type === DropdownMenuContent) {
        content = React.cloneElement(child, { 
          isOpen 
        } as any);
      }
    }
  });

  return (
    <div className="relative" ref={ref}>
      {trigger}
      {content}
    </div>
  );
};

export const DropdownMenuTrigger: React.FC<{
  asChild?: boolean;
  children: ReactNode;
  onClick?: () => void;
}> = ({ asChild, children, onClick }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick } as any);
  }
  return <div onClick={onClick}>{children}</div>;
};

export const DropdownMenuContent: React.FC<{
  children: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  isOpen?: boolean;
}> = ({ children, className = '', align = 'center', isOpen }) => {
  if (!isOpen) return null;
  return (
    <div
      className={`absolute z-50 mt-2 min-w-[8rem] rounded-md border bg-white shadow-lg ${className}`}
      style={{ [align === 'start' ? 'left' : align === 'end' ? 'right' : 'left']: 0 }}
    >
      {children}
    </div>
  );
};

export const DropdownMenuItem: React.FC<{
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => (
  <div
    className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const DropdownMenuSeparator: React.FC = () => <hr className="my-1" />;
