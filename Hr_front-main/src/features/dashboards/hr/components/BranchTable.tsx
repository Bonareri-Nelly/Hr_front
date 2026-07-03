const branches = [
  { name: 'Nairobi HQ', employees: 420, amount: 'KES 28.4M', status: 'Ready' },
  { name: 'Mombasa', employees: 310, amount: 'KES 21.2M', status: 'Pending' },
  { name: 'Kisumu', employees: 280, amount: 'KES 19.1M', status: 'Ready' },
  { name: 'Remote Units', employees: 238, amount: 'KES 15.9M', status: 'In Review' },
];

export const BranchTable = () => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Branch Payroll Readiness</h3>
        <button className="text-sm text-blue-600 hover:underline">View all</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2 font-medium">Branch</th>
              <th className="pb-2 font-medium">Employees</th>
              <th className="pb-2 font-medium">Payroll Amount</th>
              <th className="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((b) => (
              <tr key={b.name} className="border-b last:border-0">
                <td className="py-3 font-medium text-gray-800">{b.name}</td>
                <td className="py-3 text-gray-600">{b.employees}</td>
                <td className="py-3 text-gray-600">{b.amount}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    b.status === 'Ready' ? 'bg-green-100 text-green-700' :
                    b.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};