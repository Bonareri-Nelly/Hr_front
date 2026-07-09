// src/components/ui/table.tsx
import React from 'react';

type TableElementProps<T extends HTMLElement> = React.TableHTMLAttributes<T> & {
  className?: string;
  children: React.ReactNode;
};

export const Table: React.FC<TableElementProps<HTMLTableElement>> = ({
  className = '',
  children,
  ...props
}) => <table className={`table ${className}`} {...props}>{children}</table>;

export const TableHeader: React.FC<TableElementProps<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => <thead className={className} {...props}>{children}</thead>;

export const TableBody: React.FC<TableElementProps<HTMLTableSectionElement>> = ({
  className = '',
  children,
  ...props
}) => <tbody className={className} {...props}>{children}</tbody>;

export const TableRow: React.FC<TableElementProps<HTMLTableRowElement>> = ({
  className = '',
  children,
  ...props
}) => <tr className={`border-b ${className}`} {...props}>{children}</tr>;

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className = '',
  children,
  ...props
}) => <th className={className} {...props}>{children}</th>;

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className = '',
  children,
  ...props
}) => <td className={className} {...props}>{children}</td>;
