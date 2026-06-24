import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { useFilteredData } from '@/hooks/useFilteredData';

export default function PatientProfile() {
  const filters = useAppSelector((state) => state.filter.filters);
  const { subjects, ae, labs, ex, cm, mh, visits } = useFilteredData();
  const allSubjects = useAppSelector((state) => state.data.subjects);

  const selectedId = filters.subjectIds.length === 1 ? filters.subjectIds[0] : null;
  const subject = useMemo(() => allSubjects.find((s) => s.id === selectedId), [allSubjects, selectedId]);

  if (!selectedId || !subject) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6">
        <p className="text-slate-400 text-sm text-center">Click any subject in any panel</p>
        <p className="text-slate-400 text-sm text-center">to load their profile here.</p>
        <p className="text-slate-500 text-xs mt-6 text-center">Powered by RELREC cross-domain linking</p>
      </div>
    );
  }

  const subjectAE = ae.filter((a) => a.subjid === selectedId);
  const subjectMH = mh.filter((m) => m.subjid === selectedId);
  const subjectCM = cm.filter((c) => c.subjid === selectedId);
  const subjectEx = ex.filter((e) => e.subjid === selectedId);
  const subjectVisits = visits.filter((v) => v.subjid === selectedId);
  const completedVisits = subjectVisits.filter((v) => v.complete).length;
  const totalVisits = subjectVisits.length;

  return (
    <div className="w-full h-full overflow-y-auto p-4">
      {/* Header badge */}
      <div className="flex justify-end mb-3">
        <span className="text-[10px] font-semibold px-2 py-0.5 bg-cyan-900/50 text-cyan-400 border border-cyan-700 rounded">
          {selectedId}
        </span>
      </div>

      {/* Demographics */}
      <div className="space-y-0 border-b border-slate-700 pb-4 mb-4">
        <FieldRow label="Subject ID" value={<span className="text-cyan-400 font-bold">{subject.id}</span>} />
        <FieldRow label="Vital Status" value={
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${subject.vital === 'ALIVE' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
            {subject.vital === 'ALIVE' ? '● ' : '✖ '}{subject.vital}
          </span>
        } />
        <FieldRow label="Arm" value={subject.arm} />
        <FieldRow label="Age / Sex" value={`${subject.age} / ${subject.sex}`} />
        <FieldRow label="Site" value={subject.site} />
        <FieldRow label="Status" value={
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${subject.status === 'Completed' ? 'bg-cyan-900/40 text-cyan-400' : 'bg-red-900/40 text-red-400'}`}>
            {subject.status === 'Completed' ? 'COMPLETED' : 'DISCONTINUED'}
          </span>
        } />
        <FieldRow label="Enrolled Day" value={`Day ${subject.enrol}`} />
        {subjectEx[0] && (
          <FieldRow label="Treatment" value={`${subjectEx[0].extrt} ${subjectEx[0].exdose} ${subjectEx[0].exdosu}`} />
        )}
        <FieldRow label="Visit Comp." value={`${completedVisits}/${totalVisits} visits completed`} />
      </div>

      {/* Medical History */}
      {subjectMH.length > 0 && (
        <Section title="MEDICAL HISTORY" count={subjectMH.length}>
          {subjectMH.map((m, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-white font-medium">{m.mhdecod}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">{m.mhcat}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${m.mhstat === 'ONGOING' ? 'bg-green-900/40 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                  {m.mhstat}
                </span>
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Adverse Events */}
      {subjectAE.length > 0 && (
        <Section title="ADVERSE EVENTS" count={subjectAE.length}>
          {subjectAE.map((a, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-white font-medium">{a.aeterm}</span>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  a.aesev === 'SEVERE' ? 'bg-red-900/40 text-red-400' :
                  a.aesev === 'MODERATE' ? 'bg-amber-900/40 text-amber-400' :
                  'bg-green-900/40 text-green-400'
                }`}>{a.aesev}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  a.aerel === 'RELATED' ? 'bg-red-900/40 text-red-400' :
                  a.aerel === 'POSSIBLY RELATED' ? 'bg-amber-900/40 text-amber-400' :
                  'bg-slate-700 text-slate-400'
                }`}>{a.aerel === 'POSSIBLY RELATED' ? 'POSSIBLE' : a.aerel === 'NOT RELATED' ? 'UNRELATED' : a.aerel}</span>
                <span className="text-[10px] text-slate-500">D{a.aestdy}–{a.aeendy}</span>
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Concomitant Medications */}
      {subjectCM.length > 0 && (
        <Section title="CONCOMITANT MEDICATIONS" count={subjectCM.length}>
          {subjectCM.map((c, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-white font-medium">{c.cmtrt}</span>
              <span className="text-[10px] text-slate-500">{c.cmroute} · D{c.cmstdy}–{c.cmendy}</span>
            </div>
          ))}
        </Section>
      )}

      {/* Exposure */}
      {subjectEx.length > 0 && (
        <Section title="EXPOSURE" count={subjectEx.length}>
          {subjectEx.map((e, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-white font-medium">{e.extrt}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">
                  {e.exdose} {e.exdosu} {e.exroute} {e.exdosfrq} · D{e.exstdy}–D{e.exendy}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${e.excomp ? 'bg-cyan-900/40 text-cyan-400' : 'bg-red-900/40 text-red-400'}`}>
                  {e.excomp ? 'COMPLETE' : 'EARLY STOP'}
                </span>
              </div>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center py-2 border-b border-slate-800/50">
      <span className="text-[11px] text-slate-500 w-24 shrink-0">{label}</span>
      <span className="text-sm text-white font-medium">{value}</span>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
        {title} ({count})
      </p>
      <div>{children}</div>
    </div>
  );
}
