type BranchKey = "Nairobi HQ" | "Mombasa";
interface QuickStatsProps {
  branch: string;
}

export const QuickStats = ({ branch }: QuickStatsProps) => {
  const stats = {
    'Nairobi HQ': [
      { label: 'Total Departments', value: '12' },
      { label: 'Branches', value: '1' },
      { label: 'Avg. Tenure', value: '4.2 yrs' },
      { label: 'Turnover Rate', value: '8.5%' },
    ],
    'Mombasa': [
      { label: 'Total Departments', value: '8' },
      { label: 'Branches', value: '1' },
      { label: 'Avg. Tenure', value: '3.8 yrs' },
      { label: 'Turnover Rate', value: '9.2%' },
    ],
  };

  const branchKey = (branch === "Mombasa" ? "Mombasa" : "Nairobi HQ") as BranchKey;
  const branchStats = stats[branchKey];


  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {branchStats.map((stat) => (
        <div key={stat.label} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-lg font-bold text-gray-900">{stat.value}</p>
          <p className="text-[10px] text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};