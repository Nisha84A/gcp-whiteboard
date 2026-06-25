import { FileText } from 'lucide-react';
import NarrativeCard from './NarrativeCard';

interface Props {
  message: any;
  roleAbbr: string;
  onAction?: (trigger: string) => void;
}

export default function ChatMessage({ message, roleAbbr, onAction }: Props) {
  if (message.role === 'user') {
    return <UserMessage content={message.content} time={message.time} roleAbbr={roleAbbr} />;
  }

  switch (message.type) {
    case 'welcome':
      return <WelcomeMessage message={message} />;
    case 'findings':
      return <FindingsMessage message={message} onAction={onAction} />;
    case 'ae-table':
      return <AETableMessage message={message} onAction={onAction} />;
    case 'data-changes':
      return <DataChangesMessage message={message} />;
    case 'narratives':
      return <NarrativesMessage message={message} />;
    case 'confirmation':
      return <ConfirmationMessage message={message} />;
    case 'study-status':
      return <StudyStatusMessage message={message} />;
    default:
      return <DefaultAIMessage message={message} />;
  }
}

function renderBold(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith('**') ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
  );
}

function AIAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
    </div>
  );
}

function UserMessage({ content, time, roleAbbr }: { content: string; time: string; roleAbbr: string }) {
  return (
    <div className="flex justify-end mb-5">
      <div className="flex items-end gap-2.5">
        <span className="text-[10px] text-slate-500 self-end mb-1">{time}</span>
        <div className="max-w-sm px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-2xl rounded-br-md text-sm text-white">
          {content}
        </div>
        <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
          {roleAbbr}
        </div>
      </div>
    </div>
  );
}

function WelcomeMessage({ message }: { message: any }) {
  return (
    <div className="flex gap-3 mb-5">
      <AIAvatar />
      <div className="flex-1 max-w-2xl">
        <div className="p-4 bg-navy-800 border border-slate-700 rounded-lg">
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{renderBold(message.content)}</p>
          {message.hint && (
            <p className="text-xs text-cyan-400/70 mt-3 italic">{message.hint}</p>
          )}
        </div>
        <span className="text-[10px] text-slate-500 mt-1.5 block">{message.time}</span>
      </div>
    </div>
  );
}

function FindingsMessage({ message, onAction }: { message: any; onAction?: (trigger: string) => void }) {
  const { findings } = message;
  return (
    <div className="flex gap-3 mb-5">
      <AIAvatar />
      <div className="flex-1 max-w-2xl">
        <div className="p-4 bg-navy-800 border border-slate-700 rounded-lg">
          <p className="text-sm text-slate-200 mb-4">{renderBold(message.content)}</p>

          {/* CRITICAL */}
          {findings.critical && (
            <div className="mb-4">
              <p className="text-xs font-bold text-red-400 mb-2">⚠ {findings.critical.label}</p>
              {findings.critical.items.map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-2 mb-1.5 ml-1">
                  <span className="text-xs text-cyan-400 font-medium underline cursor-pointer hover:text-cyan-300 shrink-0">{item.subjid}</span>
                  <span className="text-xs text-slate-300">{renderBold(item.text)}</span>
                </div>
              ))}
            </div>
          )}

          {/* HIGH */}
          {findings.high && (
            <div className="mb-4">
              <p className="text-xs font-bold text-amber-400 mb-2">⚠ {findings.high.label}</p>
              {findings.high.items.map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-2 mb-1.5 ml-1">
                  <span className="text-xs text-cyan-400 font-medium underline cursor-pointer hover:text-cyan-300 shrink-0">{item.subjid}</span>
                  <span className="text-xs text-slate-300">{renderBold(item.text)}</span>
                </div>
              ))}
            </div>
          )}

          {/* NOTABLE */}
          {findings.notable && (
            <div className="mb-4">
              <p className="text-xs font-bold text-yellow-400 mb-2">⚠ {findings.notable.label}</p>
              {findings.notable.items.map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-2 mb-1.5 ml-1">
                  <span className="text-xs text-cyan-400 font-medium underline cursor-pointer hover:text-cyan-300 shrink-0">{item.subjid}</span>
                  <span className="text-xs text-slate-300">{renderBold(item.text)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {message.footer && (
            <p className="text-[11px] text-slate-500 italic mt-3">{message.footer}</p>
          )}

          {/* Action buttons */}
          {message.actionLabel && message.actionButtons && (
            <div className="mt-4 pt-3 border-t border-slate-700">
              <p className="text-[11px] text-slate-400 mb-2">{message.actionLabel}</p>
              <div className="flex flex-wrap gap-2">
                {message.actionButtons.map((btn: any) => (
                  <button
                    key={btn.trigger}
                    onClick={() => onAction?.(btn.trigger)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-full border transition-colors ${
                      btn.color === 'cyan'
                        ? 'bg-cyan-900/40 text-cyan-300 border-cyan-700 hover:bg-cyan-800/50'
                        : btn.color === 'teal'
                        ? 'bg-teal-900/40 text-teal-300 border-teal-700 hover:bg-teal-800/50'
                        : 'bg-amber-900/40 text-amber-300 border-amber-700 hover:bg-amber-800/50'
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <span className="text-[10px] text-slate-500 mt-1.5 block">{message.time}</span>
      </div>
    </div>
  );
}

function AETableMessage({ message, onAction }: { message: any; onAction?: (trigger: string) => void }) {
  const severityClass = (sev: string) => {
    switch (sev) {
      case 'SEVERE': return 'bg-red-600 text-white';
      case 'MODERATE': return 'bg-amber-600 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  const relatednessClass = (rel: string) => {
    switch (rel) {
      case 'RELATED': return 'bg-red-500/20 text-red-400';
      case 'POSSIBLE': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="flex gap-3 mb-5">
      <AIAvatar />
      <div className="flex-1 max-w-2xl">
        <div className="p-4 bg-navy-800 border border-slate-700 rounded-lg">
          <p className="text-sm text-slate-200 mb-3">{renderBold(message.content)}</p>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Subject</th>
                  <th className="text-left py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">AE Term</th>
                  <th className="text-left py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Severity</th>
                  <th className="text-left py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Relatedness</th>
                  <th className="text-left py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Days</th>
                </tr>
              </thead>
              <tbody>
                {message.table.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-800/50 cursor-pointer">
                    <td className="py-2">
                      <span
                        className="text-cyan-400 font-medium underline cursor-pointer hover:text-cyan-300"
                        onClick={() => onAction?.(`show-ae-${row.subject.toLowerCase()}`)}
                      >
                        {row.subject}
                      </span>
                    </td>
                    <td className="py-2 text-slate-200">{row.aeTerm}</td>
                    <td className="py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${severityClass(row.severity)}`}>
                        {row.severity}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${relatednessClass(row.relatedness)}`}>
                        {row.relatedness}
                      </span>
                    </td>
                    <td className="py-2 text-slate-300">{row.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {message.footer && (
            <p className="text-[11px] text-amber-400 mt-3">{renderBold(message.footer)}</p>
          )}
          {message.footerNote && (
            <p className="text-[10px] text-slate-500 mt-1 italic">{message.footerNote}</p>
          )}
        </div>
        <span className="text-[10px] text-slate-500 mt-1.5 block">{message.time}</span>
      </div>
    </div>
  );
}

function DataChangesMessage({ message }: { message: any }) {
  return (
    <div className="flex gap-3 mb-5">
      <AIAvatar />
      <div className="flex-1 max-w-2xl">
        <div className="p-4 bg-navy-800 border border-slate-700 rounded-lg">
          <p className="text-sm text-slate-200 mb-3">{renderBold(message.content)}</p>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Subject</th>
                  <th className="text-left py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Domain</th>
                  <th className="text-left py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Change</th>
                  <th className="text-left py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {message.table.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-slate-700/50">
                    <td className="py-2">
                      <span className="text-cyan-400 font-medium underline cursor-pointer hover:text-cyan-300">{row.subject}</span>
                    </td>
                    <td className="py-2 text-slate-400">{row.domain}</td>
                    <td className="py-2 text-slate-200">{renderBold(row.change)}</td>
                    <td className="py-2 text-slate-400">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {message.footer && (
            <p className="text-[11px] text-slate-400 mt-3">{renderBold(message.footer)}</p>
          )}
        </div>
        <span className="text-[10px] text-slate-500 mt-1.5 block">{message.time}</span>
      </div>
    </div>
  );
}

function NarrativesMessage({ message }: { message: any }) {
  return (
    <div className="flex gap-3 mb-5">
      <AIAvatar />
      <div className="flex-1 max-w-3xl">
        <p className="text-sm text-slate-200 mb-3">{renderBold(message.content)}</p>
        {message.narratives.map((narrative: any) => (
          <div key={narrative.subjid} className="mb-3">
            <p className="text-xs text-slate-300 mb-2">
              Narrative generated for <span className="text-cyan-400 font-medium underline">{narrative.subjid}</span> — {narrative.demographics.arm} · {narrative.exposure.status}
            </p>
            <NarrativeCard data={narrative} />
          </div>
        ))}
        <span className="text-[10px] text-slate-500 mt-1.5 block">{message.time}</span>
      </div>
    </div>
  );
}

function ConfirmationMessage({ message }: { message: any }) {
  return (
    <div className="flex gap-3 mb-5">
      <AIAvatar />
      <div className="flex-1 max-w-2xl">
        <div className="p-4 bg-navy-800 border border-slate-700 rounded-lg">
          <p className="text-sm text-white font-semibold mb-3">{renderBold(message.content)}</p>

          <div className="space-y-2 mb-3">
            {message.items.map((item: any) => (
              <div key={item.id} className="flex items-center gap-2 text-xs text-slate-300">
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{item.id}</span>
                <span className="text-slate-500">→</span>
                <span className="text-slate-200">{item.target}</span>
                <span className="text-slate-500">—</span>
                <span className="text-teal-400">{item.status}</span>
              </div>
            ))}
          </div>

          {message.statusUpdate && (
            <p className="text-xs text-slate-300 mt-3">{renderBold(message.statusUpdate)}</p>
          )}
          {message.auditNote && (
            <p className="text-[11px] text-slate-500 mt-1">{message.auditNote}</p>
          )}
        </div>
        <span className="text-[10px] text-slate-500 mt-1.5 block">{message.time}</span>
      </div>
    </div>
  );
}

function StudyStatusMessage({ message }: { message: any }) {
  return (
    <div className="flex gap-3 mb-5">
      <AIAvatar />
      <div className="flex-1 max-w-2xl">
        <div className="p-4 bg-navy-800 border border-slate-700 rounded-lg">
          <p className="text-sm font-semibold text-white mb-4">{message.content}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {message.stats.map((stat: any, i: number) => (
              <div key={i} className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                <p className={`text-xl font-bold ${stat.color === 'red' ? 'text-red-400' : stat.color === 'amber' ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {stat.value}
                </p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
                {stat.detail && <p className="text-[10px] text-slate-500 mt-0.5">{stat.detail}</p>}
                {stat.progress && (
                  <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${stat.progress}%` }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {message.milestone && (
            <div className="p-3 border border-slate-700 rounded-lg bg-slate-800/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-amber-400">Milestone Readiness:</span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-900/50 text-amber-400 border border-amber-700 rounded">{message.milestone.status}</span>
              </div>
              {message.milestone.risks.map((risk: string, i: number) => (
                <p key={i} className="text-[11px] text-amber-300 mb-1">⚠ {risk}</p>
              ))}
              {message.milestone.onTrack.map((item: string, i: number) => (
                <p key={i} className="text-[11px] text-green-400 mb-1">✓ {item}</p>
              ))}
            </div>
          )}
        </div>
        <span className="text-[10px] text-slate-500 mt-1.5 block">{message.time}</span>
      </div>
    </div>
  );
}

function DefaultAIMessage({ message }: { message: any }) {
  return (
    <div className="flex gap-3 mb-5">
      <AIAvatar />
      <div className="flex-1 max-w-2xl">
        <div className="p-4 bg-navy-800 border border-slate-700 rounded-lg">
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{renderBold(message.content)}</p>
        </div>
        {message.time && <span className="text-[10px] text-slate-500 mt-1.5 block">{message.time}</span>}
      </div>
    </div>
  );
}
