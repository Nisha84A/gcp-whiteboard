import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import ClickableSubjectCell from './ClickableSubjectCell';

export default function VisitGrid() {
  const subjects = useAppSelector((state) => state.data.subjects);
  const visits = useAppSelector((state) => state.data.visits);
  const selectedIds = useAppSelector((state) => state.filter.filters.subjectIds);
  const hasFilter = selectedIds.length > 0;

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
          {subjects.map((subj) => {
            const isSelected = hasFilter && selectedIds.includes(subj.id);
            const isOther = hasFilter && !selectedIds.includes(subj.id);

            return (
              <tr key={subj.id}>
                <td className={`px-3 py-1.5 text-[11px] ${isSelected ? 'text-cyan-300 font-bold' : ''}`}>
                  <ClickableSubjectCell subjectId={subj.id} />
                </td>
                {visitNames.map((vn) => {
                  const val = grid[subj.id]?.[vn];

                  if (val === null) {
                    return (
                      <td key={vn} className="px-1 py-1">
                        <div className="w-16 h-8 rounded flex items-center justify-center text-xs bg-slate-800/40">
                          <span className="text-slate-500 text-[10px]">N/A</span>
                        </div>
                      </td>
                    );
                  }

                  if (val === false) {
                    return (
                      <td key={vn} className="px-1 py-1">
                        <div className={`w-16 h-8 rounded flex items-center justify-center text-xs ${isSelected ? 'bg-red-800/60' : 'bg-red-900/40'}`}>
                          <span className="text-red-400">✖</span>
                        </div>
                      </td>
                    );
                  }

                  // Complete
                  let cellClass = 'bg-slate-700/60';
                  let checkColor = 'text-green-400';

                  if (isSelected) {
                    cellClass = 'bg-teal-800/70';
                    checkColor = 'text-green-300';
                  } else if (isOther) {
                    cellClass = 'bg-slate-800/40';
                    checkColor = 'text-slate-500';
                  }

                  return (
                    <td key={vn} className="px-1 py-1">
                      <div className={`w-16 h-8 rounded flex items-center justify-center text-xs ${cellClass}`}>
                        <span className={checkColor}>✓</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
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
