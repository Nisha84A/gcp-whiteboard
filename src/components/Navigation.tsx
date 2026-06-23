import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CatalogItem } from '@/types';
import NavItemComponent from './NavItem';

interface NavigationProps {
  items: CatalogItem[];
  loading: boolean;
}

export default function Navigation({ items, loading }: NavigationProps) {
  const categories = Array.from(new Set(items.map((i) => i.category)));
  const [expanded, setExpanded] = useState<Set<string>>(new Set(categories));

  const toggleCategory = (cat: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const itemCount = items.length;

  return (
    <aside className="w-60 bg-navy-900 border-r border-slate-700 flex flex-col shrink-0 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-200 uppercase tracking-widest">Catalog</span>
        <span className="text-[10px] bg-cyan-900/50 text-cyan-400 px-2 py-0.5 rounded-full font-semibold">{itemCount}</span>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">Loading...</div>
      ) : (
        <div className="flex-1 overflow-y-auto py-2">
          {categories.map((category) => (
            <div key={category} className="mb-2">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300"
              >
                {expanded.has(category) ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                {category}
                <span className="flex-1 h-px bg-slate-700/60 ml-2"></span>
              </button>
              {expanded.has(category) && (
                <div className="px-2 space-y-1">
                  {items
                    .filter((i) => i.category === category)
                    .map((item) => (
                      <NavItemComponent key={item.id} item={item} />
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
