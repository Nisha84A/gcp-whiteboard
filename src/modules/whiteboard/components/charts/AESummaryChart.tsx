import { useMemo } from 'react';
import { useFilteredData } from '@/shared/hooks/useFilteredData';

export default function AESummaryChart() {
  const { ae } = useFilteredData();

  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    ae.forEach((e) => { counts[e.aeterm] = (counts[e.aeterm] || 0) + 1; });
    return Object.entries(counts)
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count);
  }, [ae]);

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const totalSubjects = new Set(ae.map((e) => e.subjid)).size;

  return (
    <div className="w-full h-full flex flex-col p-3">
      <p className="text-[11px] text-slate-400 text-center mb-3">All Subjects (n={totalSubjects})</p>
      <div className="flex-1 flex flex-col justify-center gap-2">
        {data.map((d) => (
          <div key={d.term} className="flex items-center gap-2">
            <span className="text-[11px] text-slate-300 w-20 text-right shrink-0">{d.term}</span>
            <div className="flex-1 h-5 bg-slate-800 rounded overflow-hidden">
              <div
                className="h-full bg-teal-600/80 rounded"
                style={{ width: `${(d.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-[11px] text-teal-400 font-bold w-5">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
