import { useDrag } from 'react-dnd';
import {
  Users,
  UserCircle,
  Zap,
  BarChart2,
  Pill,
  ClipboardList,
  TrendingUp,
  List,
  Heart,
  FlaskConical,
  Calendar,
  Bot,
  Building,
  Syringe,
} from 'lucide-react';
import { CatalogItem, CatalogItemType } from '@/shared/types';

const iconConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; bg: string; color: string }> = {
  'subject-listing': { icon: Users, bg: 'bg-cyan-900/40', color: 'text-cyan-400' },
  'patient-profile': { icon: UserCircle, bg: 'bg-amber-900/40', color: 'text-amber-400' },
  'ae-timeline': { icon: Zap, bg: 'bg-green-900/40', color: 'text-green-400' },
  'ae-summary': { icon: BarChart2, bg: 'bg-indigo-900/40', color: 'text-indigo-400' },
  'conmed': { icon: Pill, bg: 'bg-amber-900/40', color: 'text-amber-400' },
  'med-history': { icon: ClipboardList, bg: 'bg-slate-700/60', color: 'text-slate-300' },
  'lab-trend': { icon: TrendingUp, bg: 'bg-green-900/40', color: 'text-green-400' },
  'lab-listing': { icon: List, bg: 'bg-blue-900/40', color: 'text-blue-400' },
  'vital-signs': { icon: Heart, bg: 'bg-red-900/40', color: 'text-red-400' },
  'exposure': { icon: Syringe, bg: 'bg-green-900/40', color: 'text-green-400' },
  'visit-grid': { icon: Calendar, bg: 'bg-red-900/40', color: 'text-red-400' },
  'dm-concierge': { icon: Bot, bg: 'bg-slate-700/60', color: 'text-slate-300' },
  'site-enrollment': { icon: Building, bg: 'bg-slate-700/60', color: 'text-slate-300' },
};

const comingSoon = new Set(['vital-signs', 'site-enrollment']);
const badges: Record<string, { text: string; color: string }> = {
  'patient-profile': { text: 'RELREC', color: 'bg-cyan-900/60 text-cyan-400 border-cyan-700' },
  'dm-concierge': { text: 'Module 8', color: 'bg-green-900/60 text-green-400 border-green-700' },
};

interface NavItemProps {
  item: CatalogItem;
}

export default function NavItemComponent({ item }: NavItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'catalogItem',
    item: () => item,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const config = iconConfig[item.id] || { icon: List, bg: 'bg-slate-700/60', color: 'text-slate-300' };
  const Icon = config.icon;
  const isDisabled = comingSoon.has(item.id);
  const badge = badges[item.id];

  return (
    <div
      ref={isDisabled ? undefined : drag}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
        ${isDragging ? 'opacity-40' : 'opacity-100'}
        ${isDisabled ? 'opacity-50 cursor-default' : 'cursor-grab active:cursor-grabbing'}
        bg-navy-800 hover:bg-slate-700/40 border border-slate-700/50 hover:border-slate-600`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-white font-semibold truncate">{item.label}</div>
        <div className="text-[11px] text-slate-400 truncate">{item.description}</div>
        {badge && (
          <span className={`inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.5 rounded border ${badge.color}`}>
            {badge.text}
          </span>
        )}
        {isDisabled && (
          <span className="inline-block mt-1 text-[9px] text-slate-500 uppercase tracking-wider font-medium">
            COMING SOON
          </span>
        )}
      </div>
    </div>
  );
}
