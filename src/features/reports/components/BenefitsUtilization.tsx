import { useState } from 'react';
import { Gift, X } from 'lucide-react';

interface BenefitsData {
  summary: { category: string; utilization: number; cost: number; eligible: number }[];
  totalCost: number;
  avgUtilization: number;
}

export const BenefitsUtilization = ({ data }: { data: BenefitsData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-blue-700" />
              Benefits Utilization
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Company-wide benefits usage and costs
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-blue-700 hover:text-blue-800 transition"
          >
            View Details →
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Total Cost</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(data.totalCost)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Avg Utilization</p>
            <p className="text-lg font-bold text-green-600">{data.avgUtilization}%</p>
          </div>
        </div>

        <div className="space-y-3">
          {data.summary.map((item) => {
            const width = Math.min((item.utilization / 100) * 100, 100);
            const color = item.utilization > 70 ? 'green' : item.utilization > 40 ? 'yellow' : 'blue';
            const colorClasses = {
              green: 'bg-green-500',
              yellow: 'bg-yellow-500',
              blue: 'bg-blue-600',
            };
            return (
              <div key={item.category} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.category}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500">{item.eligible} eligible</span>
                      <span className="text-xs text-gray-500">{formatCurrency(item.cost)}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.utilization}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${colorClasses[color]} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Gift className="w-6 h-6 text-blue-700" />
                Benefits – Full Details
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              {data.summary.map((item) => (
                <div key={item.category} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-xs text-gray-500">{item.eligible} eligible</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{item.utilization}%</p>
                    <p className="text-xs text-gray-500">{formatCurrency(item.cost)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};