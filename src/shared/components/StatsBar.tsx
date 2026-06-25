interface Stat {
  value: string;
  label: string;
  change: string;
  color: string;
}

interface StatsBarProps {
  stats: Stat[];
  header: string;
  refresh: string;
}

const valueColorMap: Record<string, string> = {
  green: 'text-green-400',
  red: 'text-red-400',
  blue: 'text-cyan-400',
  amber: 'text-amber-400',
};

const changeColorMap: Record<string, string> = {
  green: 'text-green-500',
  red: 'text-red-500',
  blue: 'text-cyan-500',
  amber: 'text-amber-500',
};

export default function StatsBar({ stats, header, refresh }: StatsBarProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{header}</span>
        <span className="text-[10px] text-slate-500">{refresh}</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 bg-navy-800 border border-slate-700 rounded-lg">
            <div className={`text-3xl font-bold ${valueColorMap[stat.color] || 'text-white'}`}>
              {stat.value}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
            <div className={`text-xs mt-1 ${changeColorMap[stat.color] || 'text-slate-400'}`}>{stat.change}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
