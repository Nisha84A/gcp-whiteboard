import { useFilteredData } from '@/hooks/useFilteredData';
import ClickableSubjectCell from './ClickableSubjectCell';

const treatmentColors: Record<string, string> = {
  'Drug ABC': 'bg-teal-500',
  'Drug XYZ': 'bg-blue-400',
  'Placebo': 'bg-slate-500',
};

export default function ExposureTable() {
  const { ex } = useFilteredData();
  const maxDay = Math.max(...ex.map((e) => e.exendy), 90);

  return (
    <div className="w-full h-full overflow-auto">
      {/* Gantt chart */}
      <div className="p-4 border-b border-slate-700">
        <div className="space-y-2">
          {ex.map((e, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400 font-mono w-16 shrink-0">{e.subjid}</span>
              <div className="flex-1 h-5 bg-slate-800/50 rounded relative">
                <div
                  className={`absolute h-full rounded ${treatmentColors[e.extrt] || 'bg-slate-500'}`}
                  style={{
                    left: `${(e.exstdy / maxDay) * 100}%`,
                    width: `${((e.exendy - e.exstdy) / maxDay) * 100}%`,
                  }}
                />
                {!e.excomp && (
                  <div
                    className="absolute h-full w-1 bg-red-500 rounded"
                    style={{ left: `${(e.exendy / maxDay) * 100}%` }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 text-[9px] text-slate-500">
          <span>D0</span>
          <span>D30</span>
          <span>D60</span>
          <span>D90</span>
        </div>
        <div className="flex items-center gap-4 mt-2">
          {Object.entries(treatmentColors).map(([name, color]) => (
            <span key={name} className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className={`w-3 h-2 rounded ${color}`}></span> {name}
            </span>
          ))}
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Treatment</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dose</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Route</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Freq</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Period</th>
            <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion</th>
          </tr>
        </thead>
        <tbody>
          {ex.map((e, idx) => (
            <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30">
              <td className="px-3 py-2">
                <ClickableSubjectCell subjectId={e.subjid} />
              </td>
              <td className="px-3 py-2">
                <span className={`font-semibold ${e.extrt === 'Drug ABC' ? 'text-teal-400' : e.extrt === 'Drug XYZ' ? 'text-blue-400' : 'text-slate-400'}`}>
                  {e.extrt}
                </span>
              </td>
              <td className="px-3 py-2 text-slate-300">{e.extrt === 'Placebo' ? '—' : `${e.exdose} ${e.exdosu}`}</td>
              <td className="px-3 py-2 text-slate-300">{e.exroute}</td>
              <td className="px-3 py-2 text-slate-300">{e.exdosfrq}</td>
              <td className="px-3 py-2 text-slate-400">D{e.exstdy}–D{e.exendy}</td>
              <td className="px-3 py-2 text-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${e.excomp ? 'bg-cyan-900/40 text-cyan-400' : 'bg-red-900/40 text-red-400'}`}>
                  {e.excomp ? 'COMPLETE' : 'EARLY STOP'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
