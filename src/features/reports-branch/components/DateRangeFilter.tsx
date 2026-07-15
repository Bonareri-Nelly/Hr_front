import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  dateRange: { start: string; end: string };
  setDateRange: (value: { start: string; end: string }) => void;
  loading: boolean;
}

export const DateRangeFilter = ({
  dateRange,
  setDateRange,
  loading,
}: DateRangeFilterProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Date Range:</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-700"
            disabled={loading}
          />
          <span className="text-gray-400 text-xs">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-700"
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};