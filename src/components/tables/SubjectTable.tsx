import { useEffect, useState } from 'react';
import { useFilteredData } from '@/hooks/useFilteredData';
import ClickableSubjectCell from './ClickableSubjectCell';

interface ReviewStatus {
  [key: string]: { status: string; reviewer: string | null; reviewedDate: string | null };
}

const reviewBadge: Record<string, { label: string; color: string; icon: string }> = {
  REVIEWED: { label: 'REVIEWED', color: 'text-green-400', icon: '✓' },
  DATA_CHANGED: { label: 'DATA CHANGED', color: 'text-amber-400', icon: '⚠' },
  QUERIED: { label: 'QUERIED', color: 'text-red-400', icon: '►' },
  NOT_REVIEWED: { label: 'NOT REVIEWED', color: 'text-slate-500', icon: '' },
};

export default function SubjectTable() {
  const { subjects } = useFilteredData();
  const [reviewData, setReviewData] = useState<ReviewStatus>({});
  const [queries, setQueries] = useState<any[]>([]);

  useEffect(() => {
    fetch('/review-status.json').then((r) => r.json()).then(setReviewData);
    fetch('/queries.json').then((r) => r.json()).then(setQueries);
  }, []);

  const getQueryCount = (subjid: string) => queries.filter((q) => q.subjid === subjid && q.status === 'OPEN').length;

  return (
    <div className="w-full h-full overflow-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Arm</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sex</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Site</th>
            <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">AEs</th>
            <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vital</th>
            <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Review</th>
            <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
            <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subj) => {
            const review = reviewData[subj.id];
            const badge = reviewBadge[review?.status || 'NOT_REVIEWED'];
            const qCount = getQueryCount(subj.id);
            const hasAlert = subj.vital === 'DEAD' || review?.status === 'QUERIED';

            return (
              <tr key={subj.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                <td className="px-3 py-2.5">
                  <span className="flex items-center gap-1">
                    <ClickableSubjectCell subjectId={subj.id} />
                    {hasAlert && <span className="text-amber-400 text-[10px]">⚠</span>}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-slate-300">{subj.arm}</td>
                <td className="px-3 py-2.5 text-slate-300">{subj.age}</td>
                <td className="px-3 py-2.5 text-slate-300">{subj.sex}</td>
                <td className="px-3 py-2.5 text-slate-300">{subj.site}</td>
                <td className="px-3 py-2.5 text-center text-slate-300">{subj.vital === 'DEAD' ? subj.dthdy ? '2' : '1' : '3'}</td>
                <td className="px-3 py-2.5 text-center">
                  {subj.vital === 'ALIVE' ? (
                    <span className="text-green-400">●</span>
                  ) : (
                    <span className="text-red-400">✖</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`text-[10px] font-semibold ${badge.color}`}>
                    {badge.icon && <span className="mr-0.5">{badge.icon}</span>}
                    {badge.label}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className="flex items-center justify-center gap-1">
                    {qCount > 0 && (
                      <span className="text-[10px] text-red-400 font-semibold">► {qCount}</span>
                    )}
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('open-query-modal', { detail: { subjid: subj.id } }))}
                      className="px-2 py-0.5 text-[10px] text-slate-300 border border-slate-600 rounded hover:bg-slate-700 transition-colors"
                    >
                      Query
                    </button>
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`text-[10px] font-bold uppercase ${subj.status === 'Completed' ? 'text-cyan-400' : 'text-red-400'}`}>
                    {subj.status === 'Completed' ? 'COMPLETED' : 'DISCONTINUED'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
