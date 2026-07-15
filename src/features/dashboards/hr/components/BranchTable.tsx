interface BranchTableProps {
  branches: { name: string; employees: number; amount: string; status: string }[];
}

export const BranchTable = ({ branches }: BranchTableProps) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800 text-sm">Branch Payroll Readiness</h3>
        <button className="text-xs text-blue-600 hover:underline">View all</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
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
                <td className="py-2 font-medium text-gray-800">{b.name}</td>
                <td className="py-2 text-gray-600">{b.employees}</td>
                <td className="py-2 text-gray-600">{b.amount}</td>
                <td className="py-2">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
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