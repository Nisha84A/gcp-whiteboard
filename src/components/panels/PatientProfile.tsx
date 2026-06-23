import { useMemo, useState } from 'react';
import { User, Activity, FlaskConical, Pill, ClipboardList, Heart } from 'lucide-react';
import { useFilteredData } from '@/hooks/useFilteredData';
import { useAppSelector } from '@/store';

type Tab = 'overview' | 'ae' | 'labs' | 'meds' | 'history';

export default function PatientProfile() {
  const { subjects } = useAppSelector((state) => state.data);
  const { ae, labs, ex, cm, mh } = useFilteredData();
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || '');
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const subject = useMemo(() => subjects.find((s) => s.id === selectedSubject), [subjects, selectedSubject]);
  const subjectAE = useMemo(() => ae.filter((a) => a.subjid === selectedSubject), [ae, selectedSubject]);
  const subjectLabs = useMemo(() => labs.filter((l) => l.subjid === selectedSubject), [labs, selectedSubject]);
  const subjectEx = useMemo(() => ex.filter((e) => e.subjid === selectedSubject), [ex, selectedSubject]);
  const subjectCM = useMemo(() => cm.filter((c) => c.subjid === selectedSubject), [cm, selectedSubject]);
  const subjectMH = useMemo(() => mh.filter((m) => m.subjid === selectedSubject), [mh, selectedSubject]);

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { key: 'overview', label: 'Overview', icon: User },
    { key: 'ae', label: 'AE', icon: Activity, count: subjectAE.length },
    { key: 'labs', label: 'Labs', icon: FlaskConical, count: subjectLabs.length },
    { key: 'meds', label: 'Meds', icon: Pill, count: subjectCM.length + subjectEx.length },
    { key: 'history', label: 'History', icon: ClipboardList, count: subjectMH.length },
  ];

  if (!subject) {
    return <div className="p-4 text-slate-400 text-sm">No subject data available</div>;
  }

  return (
    <div className="h-full flex flex-col text-sm">
      {/* Subject selector */}
      <div className="px-3 py-2 border-b border-slate-700">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full px-2 py-1 bg-navy-900 border border-slate-600 rounded text-cyan-400 font-mono text-sm focus:outline-none focus:border-cyan-400"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} — {s.arm}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 px-2">
        {tabs.map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === key
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {count !== undefined && (
              <span className="ml-1 text-[10px] bg-slate-700 rounded-full px-1.5">{count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'overview' && <OverviewTab subject={subject} aeCount={subjectAE.length} />}
        {activeTab === 'ae' && <AETab events={subjectAE} />}
        {activeTab === 'labs' && <LabsTab labs={subjectLabs} />}
        {activeTab === 'meds' && <MedsTab exposure={subjectEx} conmeds={subjectCM} />}
        {activeTab === 'history' && <HistoryTab history={subjectMH} />}
      </div>
    </div>
  );
}

function FieldRow({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-slate-700/50">
      <span className="text-slate-400 text-xs uppercase">{label}</span>
      <span className={`text-xs font-medium ${color || 'text-slate-200'}`}>{value}</span>
    </div>
  );
}

function StatusBadge({ status, variant }: { status: string; variant: 'success' | 'error' | 'warning' | 'info' }) {
  const colors = {
    success: 'bg-green-900/40 text-green-400 border-green-700',
    error: 'bg-red-900/40 text-red-400 border-red-700',
    warning: 'bg-amber-900/40 text-amber-400 border-amber-700',
    info: 'bg-cyan-900/40 text-cyan-400 border-cyan-700',
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-medium rounded border ${colors[variant]}`}>
      {status}
    </span>
  );
}

function OverviewTab({ subject, aeCount }: { subject: any; aeCount: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
        <div className="w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-700 flex items-center justify-center">
          <User className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <div className="text-base font-semibold text-white">{subject.id}</div>
          <div className="text-xs text-slate-400">{subject.arm}</div>
        </div>
        <div className="ml-auto">
          <StatusBadge
            status={subject.vital}
            variant={subject.vital === 'ALIVE' ? 'success' : 'error'}
          />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase mb-2">Demographics</h4>
        <FieldRow label="Age" value={subject.age} />
        <FieldRow label="Sex" value={subject.sex} />
        <FieldRow label="Site" value={subject.site} />
        <FieldRow label="Enrollment Day" value={`Day ${subject.enrol}`} />
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase mb-2">Study Status</h4>
        <FieldRow
          label="Status"
          value={subject.status}
          color={subject.status === 'Completed' ? 'text-green-400' : 'text-amber-400'}
        />
        <FieldRow label="Treatment Arm" value={subject.arm} />
        <FieldRow label="Adverse Events" value={aeCount} color={aeCount > 0 ? 'text-amber-400' : ''} />
        {subject.dthdy && (
          <>
            <FieldRow label="Death Day" value={`Day ${subject.dthdy}`} color="text-red-400" />
            <FieldRow label="Cause of Death" value={subject.dthcaus || 'Unknown'} color="text-red-400" />
          </>
        )}
      </div>
    </div>
  );
}

function AETab({ events }: { events: any[] }) {
  if (events.length === 0) return <div className="text-slate-500 text-xs">No adverse events recorded</div>;

  const severityVariant = (sev: string) => {
    if (sev === 'SEVERE') return 'error';
    if (sev === 'MODERATE') return 'warning';
    return 'success';
  };

  return (
    <div className="space-y-3">
      {events.map((ae, i) => (
        <div key={i} className="p-3 bg-navy-900/50 rounded border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium text-xs">{ae.aeterm}</span>
            <StatusBadge status={ae.aesev} variant={severityVariant(ae.aesev) as any} />
          </div>
          <FieldRow label="Relatedness" value={ae.aerel} />
          <FieldRow label="Start Day" value={`Day ${ae.aestdy}`} />
          <FieldRow label="End Day" value={`Day ${ae.aeendy}`} />
          <FieldRow label="Duration" value={`${ae.aeendy - ae.aestdy} days`} />
        </div>
      ))}
    </div>
  );
}

function LabsTab({ labs }: { labs: any[] }) {
  if (labs.length === 0) return <div className="text-slate-500 text-xs">No lab results available</div>;

  const grouped = labs.reduce((acc: Record<string, any[]>, lab) => {
    (acc[lab.lbtest] = acc[lab.lbtest] || []).push(lab);
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([test, results]) => (
        <div key={test} className="p-3 bg-navy-900/50 rounded border border-slate-700">
          <h5 className="text-white font-medium text-xs mb-2">{test}</h5>
          {(results as any[]).map((lab, i) => {
            const abnormal = lab.lbstresn > lab.lbnrhi || lab.lbstresn < lab.lbnrlo;
            return (
              <div key={i} className="flex justify-between py-1 border-b border-slate-700/30 last:border-0">
                <span className="text-slate-400 text-xs">Day {lab.lbdy}</span>
                <span className={`text-xs font-mono ${abnormal ? 'text-amber-400 font-bold' : 'text-slate-200'}`}>
                  {lab.lbstresn} {lab.lbstresu}
                  <span className="text-slate-500 ml-1">({lab.lbnrlo}–{lab.lbnrhi})</span>
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function MedsTab({ exposure, conmeds }: { exposure: any[]; conmeds: any[] }) {
  return (
    <div className="space-y-4">
      {exposure.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase mb-2">Study Drug Exposure</h4>
          {exposure.map((ex, i) => (
            <div key={i} className="p-3 bg-navy-900/50 rounded border border-slate-700 mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-medium text-xs">{ex.extrt}</span>
                <StatusBadge status={ex.excomp ? 'Completed' : 'Incomplete'} variant={ex.excomp ? 'success' : 'warning'} />
              </div>
              <FieldRow label="Dose" value={`${ex.exdose} ${ex.exdosu}`} />
              <FieldRow label="Route" value={ex.exroute} />
              <FieldRow label="Frequency" value={ex.exdosfrq} />
              <FieldRow label="Duration" value={`Day ${ex.exstdy} → Day ${ex.exendy}`} />
            </div>
          ))}
        </div>
      )}

      {conmeds.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase mb-2">Concomitant Medications</h4>
          {conmeds.map((cm, i) => (
            <div key={i} className="p-3 bg-navy-900/50 rounded border border-slate-700 mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-medium text-xs">{cm.cmtrt}</span>
                {cm.cmongo && <StatusBadge status="Ongoing" variant="info" />}
              </div>
              <FieldRow label="Dose" value={`${cm.cmdose} ${cm.cmdosu}`} />
              <FieldRow label="Route" value={cm.cmroute} />
              <FieldRow label="Period" value={`Day ${cm.cmstdy} → Day ${cm.cmendy}`} />
            </div>
          ))}
        </div>
      )}

      {exposure.length === 0 && conmeds.length === 0 && (
        <div className="text-slate-500 text-xs">No medication records</div>
      )}
    </div>
  );
}

function HistoryTab({ history }: { history: any[] }) {
  if (history.length === 0) return <div className="text-slate-500 text-xs">No medical history</div>;

  return (
    <div className="space-y-2">
      {history.map((mh, i) => (
        <div key={i} className="p-3 bg-navy-900/50 rounded border border-slate-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white font-medium text-xs">{mh.mhdecod}</span>
            <StatusBadge status={mh.mhstat} variant={mh.mhstat === 'ONGOING' ? 'warning' : 'success'} />
          </div>
          <FieldRow label="Category" value={mh.mhcat} />
        </div>
      ))}
    </div>
  );
}
