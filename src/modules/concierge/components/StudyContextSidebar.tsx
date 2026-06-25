import { FileText, Users, Calendar, Database } from 'lucide-react';

interface StudyInfo {
  id: string;
  phase: string;
  status: string;
  subjects: number;
  arms: number;
  sites: number;
  dbLockDate: string;
  dbLockDays: number;
}

interface Capability {
  label: string;
  detail: string;
}

interface Props {
  study: StudyInfo;
  capabilities: Capability[];
}

export default function StudyContextSidebar({ study, capabilities }: Props) {
  return (
    <aside className="w-56 border-r border-slate-700 flex flex-col shrink-0 bg-navy-900">
      <div className="px-4 py-3 border-b border-slate-700">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Study Context</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Study card */}
        <div className="p-3 bg-navy-800 border border-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400">{study.id}</span>
          </div>
          <p className="text-[10px] text-slate-400">{study.phase} · {study.status}</p>
        </div>

        {/* Subjects */}
        <div className="p-3 bg-navy-800 border border-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-white">{study.subjects} Subjects</span>
          </div>
          <p className="text-[10px] text-slate-400">{study.arms} arms · {study.sites} sites</p>
        </div>

        {/* DB Lock */}
        <div className="p-3 bg-navy-800 border border-slate-700 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-white">
              {new Date(study.dbLockDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="w-3 h-3 text-amber-400" />
            <p className="text-[10px] text-amber-400">{study.dbLockDays} days to DB Lock</p>
          </div>
        </div>

        {/* What I Can Answer */}
        <div>
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-2">What I Can Answer</p>
          <ul className="space-y-2">
            {capabilities.map((cap) => (
              <li key={cap.label} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                <div>
                  <p className="text-[11px] text-white font-medium">{cap.label}</p>
                  <p className="text-[10px] text-slate-500">{cap.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
