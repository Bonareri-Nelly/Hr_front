import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';

interface ExportButtonProps {
  data: any;
  fileName?: string;
}

export const ExportButton = ({ data, fileName = 'report' }: ExportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format: 'pdf' | 'excel') => {
    setIsOpen(false);
    console.log(`Exporting as ${format}...`, data);
    alert(`Exporting ${format.toUpperCase()} file: ${fileName}`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
            <button
              onClick={() => handleExport('pdf')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-700" />
              Export as PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg transition flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-500" />
              Export as Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
};