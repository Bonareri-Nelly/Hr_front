export const ProgressSection = () => {
  const steps = [
    { label: 'Gross payroll validation', value: 86 },
    { label: 'Statutory deductions', value: 72 },
    { label: 'Payslip publishing', value: 41 },
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-full">
      <h3 className="font-semibold text-gray-800 text-sm mb-3">Current Run</h3>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.label}>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">{step.label}</span>
              <span className="font-medium text-gray-800">{step.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">  {/* was h-2 */}
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${step.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};