// src/features/benefits/management/components/ExportButton.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Printer,
  Mail,
} from 'lucide-react';
// Replace with your toast implementation
// import { useToast } from '@/components/ui/use-toast';

interface ExportButtonProps {
  data: any;
  type: 'summary' | 'detailed' | 'cost';
  role: string;
  branchName?: string;
  dateRange?: string;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  type,
  role,
  branchName = 'All Branches',
  dateRange = 'Current Period',
  className = '',
}) => {
  // const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  // Simple toast replacement - replace with your actual toast implementation
  const showToast = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    const log = variant === 'destructive' ? console.error : console.log;
    log(`${title}: ${description}`);
    // In production, use your toast library
    // toast({ title, description, variant });
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      setIsExporting(true);

      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const fileName = `benefits-overview-${branchName}-${new Date().toISOString().split('T')[0]}`;

      showToast(
        'Export Successful',
        `${format.toUpperCase()} file "${fileName}" has been generated.`
      );

      // Create a download
      const blob = new Blob(
        [
          `Benefits Overview Report\n`,
          `Type: ${type}\n`,
          `Prepared for: ${role}\n`,
          `Branch: ${branchName}\n`,
          `Period: ${dateRange}\n`,
          `Generated: ${new Date().toLocaleString()}\n`,
          `\n${JSON.stringify(data, null, 2)}`,
        ],
        { type: 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showToast(
        'Export Failed',
        'An error occurred while generating the report.',
        'destructive'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    showToast('Email Report', 'Report will be sent to your registered email address.');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className} disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
          <span className="ml-auto text-xs text-muted-foreground">.pdf</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
          <span className="ml-auto text-xs text-muted-foreground">.xlsx</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <File className="mr-2 h-4 w-4" />
          Export as CSV
          <span className="ml-auto text-xs text-muted-foreground">.csv</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Report
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Email Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
