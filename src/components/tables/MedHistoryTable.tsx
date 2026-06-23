import { useFilteredData } from '@/hooks/useFilteredData';
import ClickableSubjectCell from './ClickableSubjectCell';

const categoryColors: Record<string, string> = {
  ENDOCRINE: 'bg-blue-400',
  CARDIOVASCULAR: 'bg-red-400',
  MUSCULOSKELETAL: 'bg-green-400',
  PSYCHIATRIC: 'bg-purple-400',
  NEUROLOGICAL: 'bg-amber-400',
  GASTROINTESTINAL: 'bg-green-400',
};

export default function MedHistoryTable() {
  const { mh } = useFilteredData();

  return (
    <div className="w-full h-full overflow-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condition</th>
            <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
            <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Onset</th>
            <th className="px-3 py-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {mh.map((item, idx) => (
            <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30">
              <td className="px-3 py-2">
                <ClickableSubjectCell subjectId={item.subjid} />
              </td>
              <td className="px-3 py-2 text-slate-200">
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${categoryColors[item.mhcat] || 'bg-slate-400'}`}></span>
                  {item.mhdecod}
                </span>
              </td>
              <td className="px-3 py-2 text-[10px] text-slate-500 uppercase">{item.mhcat}</td>
              <td className="px-3 py-2 text-center text-slate-400">PRIOR</td>
              <td className="px-3 py-2 text-center">
                <span className={`text-[10px] font-bold ${item.mhstat === 'ONGOING' ? 'text-green-400' : 'text-slate-400'}`}>
                  {item.mhstat}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
