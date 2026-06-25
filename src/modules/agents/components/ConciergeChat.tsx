import { useRef, useEffect } from 'react';
import { useAppSelector } from '@/shared/store';

interface Message {
  role: 'user' | 'ai';
  type?: string;
  content: string;
  table?: { subject: string; domain: string; change: string }[];
  footer?: string;
  assessment?: any;
  narrative?: string;
  actions?: string[];
}

interface Finding {
  subjid: string;
  domain: string;
  severity: string;
  description: string;
  confidence: number;
}

interface ConciergeChatProps {
  messages: Message[];
  prompts: string[];
  findings: Finding[];
  onPromptClick: (prompt: string) => void;
  onAction: (action: string) => void;
}

export default function ConciergeChat({ messages, prompts, findings, onPromptClick, onAction }: ConciergeChatProps) {
  const user = useAppSelector((state) => state.auth.user);
  const roleAbbr = user?.role === 'MEDICAL_REVIEWER' ? 'MR' : user?.role?.split('_').map((w) => w[0]).join('').toUpperCase() || 'U';
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function renderBold(text: string) {
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
      part.startsWith('**') ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
    );
  }

  function renderMessage(msg: Message, idx: number) {
    if (msg.role === 'user') {
      return (
        <div key={idx} className="flex justify-end mb-4">
          <span className="text-[9px] text-slate-500 mt-1 mr-2 self-end">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-end gap-2">
            <div className="max-w-xs px-3 py-2 bg-cyan-900/40 border border-cyan-700 rounded-lg text-xs text-white">
              {msg.content}
            </div>
            <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center text-[9px] text-white font-bold shrink-0">
              {roleAbbr}
            </div>
          </div>
        </div>
      );
    }

    if (msg.type === 'loading') {
      return (
        <div key={idx} className="flex gap-2 mb-4">
          <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0"><div className="w-2 h-2 rounded-full bg-slate-400"></div></div>
          <div className="px-3 py-2 bg-navy-900 border border-slate-700 rounded-lg text-xs text-slate-300">
            {renderBold(msg.content)}
          </div>
        </div>
      );
    }

    if (msg.type === 'findings') {
      return (
        <div key={idx} className="flex gap-2 mb-4">
          <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0"><div className="w-2 h-2 rounded-full bg-slate-400"></div></div>
          <div className="flex-1 max-w-md p-3 bg-navy-900 border border-slate-700 rounded-lg">
            <p className="text-xs text-slate-300 mb-3">{renderBold(msg.content)}</p>
            {findings.map((f, i) => (
              <div key={i} className={`p-3 mb-2 rounded-lg border-l-[3px] bg-slate-800/50 ${f.severity === 'CRITICAL' ? 'border-l-red-500' : 'border-l-amber-500'}`}>
                <p className={`text-[10px] font-bold ${f.severity === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}`}>
                  {f.severity} · {f.subjid} · {f.domain === 'LB' ? 'Lab (LB)' : 'Adverse Events (AE)'}
                </p>
                <p className="text-[11px] text-slate-300 mt-1">{f.description}</p>
                <p className="text-[10px] text-slate-500 mt-1">AI confidence: {f.confidence}%</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (msg.type === 'drafts') {
      return (
        <div key={idx} className="flex gap-2 mb-4">
          <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0"><div className="w-2 h-2 rounded-full bg-slate-400"></div></div>
          <div className="flex-1 max-w-md p-3 bg-navy-900 border border-slate-700 rounded-lg">
            <p className="text-xs text-slate-300 mb-3">{renderBold(msg.content)}</p>
            {(msg as any).drafts?.map((draft: any, i: number) => (
              <div key={i} className="p-3 bg-slate-800/50 border border-slate-600 rounded-lg mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-cyan-400">{draft.id}</span>
                    <span className="text-[9px] text-slate-500">{draft.subjid} · {draft.domain}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${draft.severity === 'CRITICAL' ? 'bg-red-900/50 text-red-400 border border-red-700' : 'bg-amber-900/50 text-amber-400 border border-amber-700'}`}>{draft.severity}</span>
                  </div>
                </div>
                <p className="text-[11px] text-white font-medium mb-1">{draft.title}</p>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-1.5">{draft.text}</p>
                <p className="text-[9px] text-slate-500">Target: {draft.target}</p>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <button onClick={() => onAction('approve-drafts')} className="px-3 py-1.5 text-[10px] font-medium bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-colors">✓ Approve & Submit All</button>
              <button className="px-3 py-1.5 text-[10px] font-medium text-slate-300 border border-slate-600 rounded hover:bg-slate-700">Revise</button>
            </div>
          </div>
        </div>
      );
    }

    if (msg.type === 'table') {
      return (
        <div key={idx} className="flex gap-2 mb-4">
          <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0"><div className="w-2 h-2 rounded-full bg-slate-400"></div></div>
          <div className="flex-1 max-w-md p-3 bg-navy-900 border border-slate-700 rounded-lg">
            <p className="text-xs text-slate-300 mb-3">{renderBold(msg.content)}</p>
            <table className="w-full text-[10px] mb-2">
              <thead><tr className="text-slate-500"><td className="pb-1">Subject</td><td className="pb-1">Domain</td><td className="pb-1">Change</td></tr></thead>
              <tbody>
                {msg.table?.map((row, i) => (
                  <tr key={i} className="border-t border-slate-700/50">
                    <td className="py-1.5 text-cyan-400 font-mono">{row.subject}</td>
                    <td className="py-1.5 text-slate-400">{row.domain}</td>
                    <td className="py-1.5 text-slate-300">{row.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {msg.footer && <p className="text-[11px] text-slate-400 mt-2">{renderBold(msg.footer)}</p>}
          </div>
        </div>
      );
    }

    if (msg.type === 'assessment') {
      const a = msg.assessment;
      return (
        <div key={idx} className="flex gap-2 mb-4">
          <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0"><div className="w-2 h-2 rounded-full bg-slate-400"></div></div>
          <div className="flex-1 max-w-md p-3 bg-navy-900 border border-slate-700 rounded-lg">
            <p className="text-xs font-semibold text-cyan-400 mb-1">{msg.content}</p>
            <p className="text-2xl font-bold text-amber-400 mb-1">{a.status} <span className="text-xs font-normal text-slate-400">{a.target}</span></p>
            {a.risks.map((r: any, i: number) => (
              <div key={i} className="mt-3">
                <p className={`text-[10px] font-bold ${r.level === 'HIGH' ? 'text-amber-400' : 'text-amber-500'}`}>⚠ Risk {i + 1} — {r.title} ({r.level})</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{r.detail}</p>
              </div>
            ))}
            {a.onTrack.map((item: string, i: number) => (
              <p key={i} className="text-[11px] text-green-400 mt-2">✓ On Track — {item}</p>
            ))}
            <p className="text-[11px] text-slate-500 mt-3 italic">{a.recommendation}</p>
          </div>
        </div>
      );
    }

    if (msg.type === 'narrative') {
      return (
        <div key={idx} className="flex gap-2 mb-4">
          <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0"><div className="w-2 h-2 rounded-full bg-slate-400"></div></div>
          <div className="flex-1 max-w-md p-4 bg-navy-900 border border-slate-700 rounded-lg">
            <p className="text-xs font-semibold text-white mb-2">📄 {msg.content}</p>
            <div className="p-3 bg-slate-800/50 border border-slate-600 rounded text-[11px] text-slate-400 leading-relaxed whitespace-pre-line mb-3">
              {msg.narrative}
            </div>
            <div className="flex items-center gap-2">
              {msg.actions?.map((action) => (
                <button
                  key={action}
                  onClick={() => onAction(action)}
                  className={`px-3 py-1.5 text-[10px] font-medium rounded transition-colors ${
                    action === 'Approve & Save' ? 'bg-cyan-700 hover:bg-cyan-600 text-white' :
                    action === 'Discard' ? 'text-red-400 border border-red-700 hover:bg-red-900/30' :
                    'text-slate-300 border border-slate-600 hover:bg-slate-700'
                  }`}
                >
                  {action === 'Approve & Save' ? '✓ ' : ''}{action}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Default AI message
    return (
      <div key={idx} className="flex gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0"><div className="w-2 h-2 rounded-full bg-slate-400"></div></div>
        <div className="flex-1 max-w-md p-3 bg-navy-900 border border-slate-700 rounded-lg text-xs text-slate-300 leading-relaxed whitespace-pre-line">
          {renderBold(msg.content)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0">
              <div className="w-3 h-3 rounded-full bg-slate-400"></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">AI Concierge</p>
              <p className="text-[10px] text-slate-400">CLINICAL OPERATIONS · MODULE 8</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] text-green-400">● Live</span>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">Review session started · Nov 16, 2024 · 08:15</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, idx) => renderMessage(msg, idx))}
      </div>

      <div className="p-3 border-t border-slate-700 flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPromptClick(prompt)}
            className="px-3 py-1.5 text-[10px] text-slate-300 bg-navy-900 border border-slate-600 rounded-full hover:bg-slate-700 hover:text-white transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
