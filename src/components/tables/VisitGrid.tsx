import { useMemo } from 'react';
import { useFilteredData } from '@/hooks/useFilteredData';
import { useAppSelector } from '@/store';

export default function VisitGrid() {
  const { visits } = useFilteredData();
  const subjects = useAppSelector((state) => state.data.subjects);

  const { visitNames, grid } = useMemo(() => {
    const visitNames = Array.from(new Set(visits.map((v) => v.visit)));
    const grid: Record<string, Record<string, boolean | null>> = {};

    subjects.forEach((s) => {
      grid[s.id] = {};
      visitNames.forEach((vn) => {
        const match = visits.find((v) => v.subjid === s.id && v.visit === vn);
        if (!match) {
          grid[s.id][vn] = null;
        } else {
          grid[s.id][vn] = match.complete;
        }
      });
    });

    return { visitNames, grid };
  }, [visits, subjects]);

  return (
    <div className="w-full h-full overflow-auto p-4">
      <table className="border-collapse mx-auto">
        <thead>
          <tr>
            <th className="px-3 py-2"></th>
            {visitNames.map((vn) => (
              <th key={vn} className="px-2 py-2 text-[10px] text-slate-300 font-semibold text-center">{vn}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {subjects.map((subj) => (
            <tr key={subj.id}>
              <td className="px-3 py-1.5 text-[11px] text-slate-300 font-mono">{subj.id}</td>
              {visitNames.map((vn) => {
                const val = grid[subj.id]?.[vn];
                let cellClass = 'bg-slate-700/60';
                let content = <span className="text-green-400">✓</span>;

                if (val === null) {
                  cellClass = 'bg-slate-800/40';
                  content = <span className="text-slate-500 text-[10px]">N/A</span>;
                } else if (val === false) {
                  cellClass = 'bg-red-900/40';
                  content = <span className="text-red-400">✖</span>;
                }

                return (
                  <td key={vn} className="px-1 py-1">
                    <div className={`w-16 h-8 rounded flex items-center justify-center text-xs ${cellClass}`}>
                      {content}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-4 mt-4 justify-center">
        <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="w-3 h-3 rounded bg-slate-700/60"></span> Complete
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="w-3 h-3 rounded bg-red-900/40"></span> Missed/Withdrawn
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="w-3 h-3 rounded bg-slate-800/40"></span> N/A
        </span>
      </div>
    </div>
  );
}
