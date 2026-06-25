import { useState } from 'react';
import { Calendar } from 'lucide-react';

export type FilterMode = 'all' | 'new-updated' | 'since-review';

interface FilterBarProps {
  activeFilter: FilterMode;
  onFilterChange: (filter: FilterMode) => void;
  sinceDate: string;
  onDateChange: (date: string) => void;
}

export default function FilterBar({ activeFilter, onFilterChange, sinceDate, onDateChange }: FilterBarProps) {
  const filters: { key: FilterMode; label: string }[] = [
    { key: 'all', label: 'All Data' },
    { key: 'new-updated', label: 'New / Updated' },
    { key: 'since-review', label: 'Since Last Review' },
  ];

  return (
    <div className="h-10 bg-navy-800 dark:bg-navy-800 border-b border-slate-700 flex items-center px-4 gap-3 shrink-0">
      <span className="text-xs text-slate-400 uppercase font-medium mr-1">Filter:</span>
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
            activeFilter === f.key
              ? 'bg-cyan-600 text-white'
              : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-600'
          }`}
        >
          {f.label}
        </button>
      ))}

      <div className="flex items-center gap-1 ml-2">
        <span className="text-xs text-slate-400">Since:</span>
        <div className="relative">
          <input
            type="date"
            value={sinceDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="px-2 py-1 text-xs bg-navy-900 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-400 w-32"
          />
        </div>
      </div>

      {activeFilter !== 'all' && (
        <div className="ml-2 px-2 py-0.5 bg-teal-900/40 border border-teal-600 rounded text-teal-300 text-xs flex items-center gap-1">
          Showing: changes since last review
          <button
            onClick={() => onFilterChange('all')}
            className="ml-1 text-teal-400 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
