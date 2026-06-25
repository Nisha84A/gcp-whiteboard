import { Zap, FileEdit, BarChart2, Target, Search } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  zap: Zap,
  'file-edit': FileEdit,
  'bar-chart': BarChart2,
  target: Target,
  search: Search,
};

const statusDot: Record<string, string> = {
  green: 'bg-green-400',
  amber: 'bg-amber-400',
  red: 'bg-red-400',
  slate: 'bg-slate-400',
};

const badgeColor: Record<string, string> = {
  amber: 'bg-amber-900/50 text-amber-400 border-amber-700',
  red: 'bg-red-900/50 text-red-400 border-red-700',
  green: 'bg-green-900/50 text-green-400 border-green-700',
  slate: 'bg-slate-700 text-slate-400 border-slate-600',
};

interface AgentCardProps {
  agent: any;
  onAction: (trigger: string) => void;
}

export default function AgentCard({ agent, onAction }: AgentCardProps) {
  const Icon = iconMap[agent.icon] || Zap;

  function renderDescription(desc: string) {
    return desc.split(/(\*\*.*?\*\*)/g).map((part, i) =>
      part.startsWith('**') ? <strong key={i} className="text-white">{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
    );
  }

  return (
    <div className="p-4 bg-navy-800 border border-slate-700 rounded-lg mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-white">{agent.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${statusDot[agent.statusColor] || 'bg-slate-400'}`}></span>
          <span className="text-[9px] font-semibold text-slate-300 uppercase">{agent.status}</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{renderDescription(agent.description)}</p>

      <div className="flex items-center gap-2 flex-wrap">
        {agent.badges.map((badge: any, i: number) => (
          <span key={i} className={`text-[9px] font-semibold px-2 py-1 rounded border ${badgeColor[badge.color] || badgeColor.slate}`}>
            {badge.label}
          </span>
        ))}
        {agent.action?.trigger && (
          <button
            onClick={() => onAction(agent.action.trigger)}
            className="text-[10px] font-medium px-2.5 py-1 bg-navy-900 hover:bg-slate-700 text-cyan-400 rounded border border-slate-600 transition-colors"
          >
            {agent.action.label}
          </button>
        )}
      </div>
    </div>
  );
}
