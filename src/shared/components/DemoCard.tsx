import { useNavigate } from 'react-router-dom';
import { Bot, MessageSquare, LayoutDashboard, Play } from 'lucide-react';

interface DemoModule {
  id: string;
  module: string;
  title: string;
  description: string;
  tags: string[];
  route: string;
  color: string;
  icon: string;
  buttonLabel: string;
}

interface DemoCardProps {
  module: DemoModule;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  bot: Bot,
  message: MessageSquare,
  layout: LayoutDashboard,
};

const borderColorMap: Record<string, string> = {
  green: 'border-t-green-500',
  red: 'border-t-red-500',
  blue: 'border-t-cyan-500',
};

const buttonColorMap: Record<string, string> = {
  green: 'bg-green-900/60 hover:bg-green-800/70 border-green-700',
  red: 'bg-red-900/60 hover:bg-red-800/70 border-red-700',
  blue: 'bg-cyan-900/60 hover:bg-cyan-800/70 border-cyan-700',
};

const iconBgMap: Record<string, string> = {
  green: 'bg-green-900/40',
  red: 'bg-red-900/40',
  blue: 'bg-cyan-900/40',
};

export default function DemoCard({ module: mod }: DemoCardProps) {
  const navigate = useNavigate();
  const Icon = iconMap[mod.icon] || LayoutDashboard;

  return (
    <div className={`flex flex-col bg-navy-800 border border-slate-700 rounded-lg border-t-4 ${borderColorMap[mod.color] || 'border-t-slate-500'}`}>
      <div className="p-5 flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-lg ${iconBgMap[mod.color] || 'bg-slate-800'}`}>
            <Icon className="w-5 h-5 text-slate-300" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 bg-green-900/50 text-green-400 border border-green-700 rounded">
            LIVE DEMO
          </span>
        </div>

        <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">{mod.module}</p>
        <h3 className="text-base font-bold text-white mb-2">{mod.title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">{mod.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {mod.tags.map((tag) => (
            <span key={tag} className="text-[9px] px-2 py-0.5 bg-slate-800 border border-slate-600 rounded text-slate-400 font-mono uppercase">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 pb-5">
        <button
          onClick={() => navigate(mod.route)}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded border text-sm font-medium text-white transition-colors ${buttonColorMap[mod.color] || 'bg-slate-700 hover:bg-slate-600 border-slate-600'}`}
        >
          <Play className="w-3.5 h-3.5" />
          {mod.buttonLabel}
        </button>
      </div>
    </div>
  );
}
