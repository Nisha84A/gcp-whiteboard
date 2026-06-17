import { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown, Check } from 'lucide-react';
import { useFilterStore } from '@/stores/filterStore';
import { useFilterOptions } from '@/hooks/useFilteredData';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const selectAll = () => onChange([...options]);
  const clearAll = () => onChange([]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded border transition-colors
          ${selected.length > 0
            ? 'bg-cyan-900/40 border-cyan-600 text-cyan-300'
            : 'bg-navy-900 border-slate-600 text-slate-400 hover:text-white hover:border-slate-500'
          }`}
      >
        {label}
        {selected.length > 0 && (
          <span className="ml-1 bg-cyan-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            {selected.length}
          </span>
        )}
        <ChevronDown className="w-3 h-3 ml-0.5" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-navy-800 border border-slate-600 rounded-lg shadow-xl min-w-[180px] max-h-[280px] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-700">
            <button onClick={selectAll} className="text-[10px] text-cyan-400 hover:text-cyan-300">
              Select All
            </button>
            <button onClick={clearAll} className="text-[10px] text-slate-400 hover:text-white">
              Clear
            </button>
          </div>
          <div className="overflow-y-auto py-1">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => toggle(opt)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-700/50 cursor-pointer select-none"
              >
                <div
                  className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors
                    ${selected.includes(opt)
                      ? 'bg-cyan-600 border-cyan-600'
                      : 'border-slate-500 bg-transparent'
                    }`}
                >
                  {selected.includes(opt) && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-xs text-slate-200">{opt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface RangeFilterProps {
  label: string;
  range: [number | null, number | null];
  onChange: (range: [number | null, number | null]) => void;
}

function RangeFilter({ label, range, onChange }: RangeFilterProps) {
  const hasValue = range[0] !== null || range[1] !== null;

  return (
    <div className="flex items-center gap-1">
      <span className={`text-xs ${hasValue ? 'text-cyan-300' : 'text-slate-400'}`}>{label}:</span>
      <input
        type="number"
        placeholder="Min"
        value={range[0] ?? ''}
        onChange={(e) => onChange([e.target.value ? Number(e.target.value) : null, range[1]])}
        className="w-14 px-1.5 py-0.5 text-xs bg-navy-900 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
      />
      <span className="text-slate-500 text-xs">–</span>
      <input
        type="number"
        placeholder="Max"
        value={range[1] ?? ''}
        onChange={(e) => onChange([range[0], e.target.value ? Number(e.target.value) : null])}
        className="w-14 px-1.5 py-0.5 text-xs bg-navy-900 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
      />
    </div>
  );
}

export default function PageFilters() {
  const { filters, setFilter, clearAll, activeFilterCount } = useFilterStore();
  const options = useFilterOptions();
  const count = activeFilterCount();

  return (
    <div className="bg-navy-800 border-b border-slate-700 px-4 py-2 shrink-0">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 mr-1">
          <Filter className="w-3.5 h-3.5 text-green-400" />
          <span className="text-xs font-semibold text-green-400 uppercase">Filter:</span>
          {count > 0 && (
            <span className="text-[10px] bg-green-600 text-white rounded-full px-1.5 py-0.5">
              {count} active
            </span>
          )}
        </div>

        <MultiSelect
          label="Subject ID"
          options={options.subjectIds}
          selected={filters.subjectIds}
          onChange={(val) => setFilter('subjectIds', val)}
        />

        <MultiSelect
          label="Treatment Arm"
          options={options.arms}
          selected={filters.arms}
          onChange={(val) => setFilter('arms', val)}
        />

        <MultiSelect
          label="Site"
          options={options.sites}
          selected={filters.sites}
          onChange={(val) => setFilter('sites', val)}
        />

        <MultiSelect
          label="Sex"
          options={options.sex}
          selected={filters.sex}
          onChange={(val) => setFilter('sex', val)}
        />

        <MultiSelect
          label="AE Severity"
          options={options.aeSeverity}
          selected={filters.aeSeverity}
          onChange={(val) => setFilter('aeSeverity', val)}
        />

        <MultiSelect
          label="Relatedness"
          options={options.aeRelatedness}
          selected={filters.aeRelatedness}
          onChange={(val) => setFilter('aeRelatedness', val)}
        />

        <RangeFilter
          label="Study Day"
          range={filters.studyDayRange}
          onChange={(val) => setFilter('studyDayRange', val)}
        />

        {count > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 hover:text-red-300 border border-red-800 rounded hover:bg-red-900/30 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
