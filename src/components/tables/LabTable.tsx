import { useFilteredData } from '@/hooks/useFilteredData';
import ClickableSubjectCell from './ClickableSubjectCell';

export default function LabTable() {
  const { labs } = useFilteredData();

  return (
    <div className="w-full h-full overflow-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Test</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Value</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unit</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ref Range</th>
            <th className="px-3 py-2 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Day</th>
          </tr>
        </thead>
        <tbody>
          {labs.map((lab, idx) => {
            const isHigh = lab.lbstresn > lab.lbnrhi;
            const isLow = lab.lbstresn < lab.lbnrlo;
            return (
              <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="px-3 py-1.5">
                  <ClickableSubjectCell subjectId={lab.subjid} />
                </td>
                <td className="px-3 py-1.5 text-slate-300">{lab.lbtest}</td>
                <td className="px-3 py-1.5">
                  <span className={isHigh || isLow ? 'text-red-400 font-semibold' : 'text-slate-300'}>
                    {lab.lbstresn}
                  </span>
                  {isHigh && <span className="ml-1 text-[9px] text-red-400 font-bold">H</span>}
                  {isLow && <span className="ml-1 text-[9px] text-blue-400 font-bold">L</span>}
                </td>
                <td className="px-3 py-1.5 text-slate-500">{lab.lbstresu}</td>
                <td className="px-3 py-1.5 text-slate-500">{lab.lbnrlo}–{lab.lbnrhi}</td>
                <td className="px-3 py-1.5 text-right text-slate-400">Day {lab.lbdy}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
