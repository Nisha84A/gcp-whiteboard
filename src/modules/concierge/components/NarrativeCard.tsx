import LabTrendMini from './LabTrendMini';

interface NarrativeData {
  subjid: string;
  title: string;
  studyInfo: string;
  demographics: {
    subjectId: string;
    age: string;
    arm: string;
    site: string;
    vitalStatus: string;
  };
  exposure: {
    enrolled: string;
    treatment: string;
    aesReported: string;
    status: string;
  };
  narrative: string;
  labTrend: {
    title: string;
    data: { day: string; value: number }[];
    uln: number;
  };
  alert: string;
  recommendation: string;
  reportingBadge?: string;
  generated: string;
}

interface Props {
  data: NarrativeData;
}

export default function NarrativeCard({ data }: Props) {
  const isDeceased = data.demographics.vitalStatus.includes('DECEASED');

  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden bg-navy-800 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/60 border-b border-slate-700">
        <div>
          <p className="text-[9px] text-slate-400 uppercase tracking-wider">Patient Narrative</p>
          <p className="text-lg font-bold text-white">{data.subjid}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400">{data.studyInfo}</p>
          <p className="text-xs font-bold text-white">{data.title}</p>
        </div>
        {data.reportingBadge && (
          <span className="px-2 py-1 text-[8px] font-bold bg-red-900/50 text-red-400 border border-red-700 rounded">
            {data.reportingBadge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex">
        {/* Left column - Demographics */}
        <div className="w-48 border-r border-slate-700 p-3 space-y-3 shrink-0">
          <div>
            <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider mb-1.5">Demographics</p>
            <div className="space-y-1.5 text-[10px]">
              <Row label="Subject ID" value={data.demographics.subjectId} />
              <Row label="Age / Sex" value={data.demographics.age} />
              <Row label="Treatment Arm" value={data.demographics.arm} />
              <Row label="Site" value={data.demographics.site} />
              <Row
                label="Vital Status"
                value={data.demographics.vitalStatus}
                valueClass={isDeceased ? 'text-red-400 font-bold' : 'text-white'}
              />
            </div>
          </div>

          <div>
            <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider mb-1.5">Study Exposure</p>
            <div className="space-y-1.5 text-[10px]">
              <Row label="Enrolled" value={data.exposure.enrolled} />
              <Row label="Treatment" value={data.exposure.treatment} />
              <Row label="AEs Reported" value={data.exposure.aesReported} />
              <Row
                label="Status"
                value={data.exposure.status}
                valueClass={data.exposure.status === 'Discontinued' ? 'text-red-400' : 'text-white'}
              />
            </div>
          </div>

          {/* Recommendation */}
          <div className="p-2 border-l-2 border-amber-500 bg-amber-900/10 rounded-r">
            <p className="text-[9px] font-bold text-amber-400 uppercase mb-0.5">Recommendation</p>
            <p className="text-[10px] text-slate-300 leading-relaxed">{data.recommendation}</p>
          </div>
        </div>

        {/* Right column - Narrative + Chart */}
        <div className="flex-1 p-3 space-y-3">
          <div>
            <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider mb-1.5">Narrative</p>
            <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">{data.narrative}</p>
          </div>

          {/* Lab Trend */}
          <LabTrendMini
            data={data.labTrend.data}
            uln={data.labTrend.uln}
            title={data.labTrend.title}
          />

          {/* Alert banner */}
          {data.alert && (
            <div className="px-3 py-2 bg-red-900/30 border border-red-800 rounded text-[10px] text-red-300 font-medium">
              ▸ {data.alert}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-slate-700 bg-slate-800/40">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[9px] font-bold bg-red-900/50 text-red-400 border border-red-700 rounded">DRAFT</span>
          <span className="text-[10px] text-slate-400">Pending investigator confirmation</span>
        </div>
        <span className="text-[10px] text-slate-500">{data.generated}</span>
      </div>
    </div>
  );
}

function Row({ label, value, valueClass = 'text-white' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}
