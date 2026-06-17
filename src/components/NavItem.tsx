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
} from 'lucide-react';
import { CatalogItem, CatalogItemType } from '@/types';

const iconMap: Record<CatalogItemType, React.ComponentType<{ className?: string }>> = {
  'subject-listing': Users,
  'patient-profile': UserCircle,
  'ae-timeline': Zap,
  'ae-summary': BarChart2,
  'conmed': Pill,
  'med-history': ClipboardList,
  'lab-trend': TrendingUp,
  'lab-listing': List,
  'vital-signs': Heart,
  'exposure': FlaskConical,
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

  const Icon = iconMap[item.type] || List;
  const isChart = item.visualizationType === 'chart';

  return (
    <div
      ref={drag}
      className={`flex items-start gap-2 px-3 py-2 rounded cursor-grab active:cursor-grabbing transition-all
        ${isDragging ? 'opacity-40' : 'opacity-100'}
        bg-navy-800 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600`}
    >
      <div className={`mt-0.5 ${isChart ? 'text-teal-400' : 'text-cyan-400'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white font-medium truncate">{item.label}</div>
        <div className="text-xs text-slate-400 truncate">{item.description}</div>
      </div>
    </div>
  );
}
