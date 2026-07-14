// src/components/ui/dialog.tsx
import React from 'react';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-50 max-h-[90vh] w-full max-w-4xl overflow-y-auto">
        <div
          role="dialog"
          aria-modal="true"
          className="overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 shadow-2xl shadow-gold-500/10"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const DialogContent: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => (
  <div className={`p-6 bg-white text-slate-900 shadow-[0_0_35px_rgba(234,179,8,0.15)] ${className}`}>
    {children}
  </div>
);

export const DialogHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`border-b border-gold-500/10 pb-4 ${className}`}>
    {children}
  </div>
);

export const DialogTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <h2 className={`text-xl font-bold text-slate-900 ${className}`}>
    {children}
  </h2>
);

export const DialogDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <p className={`text-sm text-slate-600 mt-1 ${className}`}>
    {children}
  </p>
);

export const DialogTrigger: React.FC<{
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
}> = ({ children, asChild, onClick }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick } as any);
  }
  return <div onClick={onClick}>{children}</div>;
};

export const DialogFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`flex justify-end gap-3 pt-4 border-t border-gold-500/10 ${className}`}>
    {children}
  </div>
);