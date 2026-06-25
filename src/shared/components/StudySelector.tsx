import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/shared/store';
import { setActiveStudy, loadStudies } from '@/shared/store/studySlice';
import { loadData } from '@/shared/store/dataSlice';
import { clearAll } from '@/shared/store/filterSlice';

export default function StudySelector() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { studies, activeStudyId } = useAppSelector((state) => state.study);

  useEffect(() => {
    if (studies.length === 0) {
      dispatch(loadStudies());
    }
  }, [dispatch, studies.length]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeStudy = studies.find((s) => s.id === activeStudyId);

  const handleSelect = (id: string) => {
    dispatch(setActiveStudy(id));
    dispatch(clearAll());
    dispatch(loadData(id));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-navy-800 transition-colors"
      >
        <div className="text-left">
          <div className="text-sm font-bold text-white leading-tight">{activeStudyId}</div>
          <div className="text-[10px] text-slate-400 leading-tight max-w-[280px] truncate">
            {activeStudy?.name || 'Loading...'} · {activeStudy?.phase}
          </div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-[100] bg-navy-800 border border-slate-600 rounded-lg shadow-xl w-80 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-700">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Switch Study</span>
          </div>
          <div className="max-h-[150px] overflow-y-auto">
            {studies.map((study) => (
              <div
                key={study.id}
                onClick={() => handleSelect(study.id)}
                className={`px-3 py-2.5 cursor-pointer transition-colors flex items-center gap-2 ${
                  study.id === activeStudyId ? 'bg-cyan-900/30' : 'hover:bg-slate-700/50'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{study.id}</span>
                    <span className="text-[9px] text-slate-500">{study.phase}</span>
                    <span className="text-[9px] text-slate-500">· {study.subjects} subjects</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{study.name}</p>
                </div>
                {study.id === activeStudyId && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
