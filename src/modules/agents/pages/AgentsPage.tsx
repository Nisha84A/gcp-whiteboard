import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, Sun, Moon, LogOut } from 'lucide-react';
import StudySelector from '@/shared/components/StudySelector';
import { useAppDispatch, useAppSelector } from '@/shared/store';
import { logout } from '@/shared/store/authSlice';
import { toggleTheme } from '@/shared/store/themeSlice';
import AgentCard from '../components/AgentCard';
import ConciergeChat from '../components/ConciergeChat';

interface ScriptData {
  agents: any[];
  studyOverview: any;
  findings: any[];
  auditTrail: { time: string; text: string }[];
  chatScript: Record<string, any>;
}

export default function AgentsPage() {
  const [script, setScript] = useState<ScriptData | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatPrompts, setChatPrompts] = useState<string[]>([]);
  const [showFindings, setShowFindings] = useState(false);
  const [auditTrail, setAuditTrail] = useState<{ time: string; text: string }[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const mode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    fetch('/agents-script.json').then((r) => r.json()).then((data: ScriptData) => {
      setScript(data);
      setAuditTrail(data.auditTrail);
      const initial = data.chatScript.initial;
      setChatMessages(initial.messages);
      setChatPrompts(initial.prompts);
    });
  }, []);

  const handlePromptClick = (prompt: string) => {
    if (!script) return;
    const scriptMap: Record<string, string> = {
      'Show me the anomalies': 'show-anomalies',
      'What changed since my last review?': 'what-changed',
      'What is our milestone status?': 'milestone-status',
      'Write a narrative for SUBJ-003': 'write-narrative',
      'Raise discrepancies on all flagged items': 'show-anomalies',
    };
    const stepKey = scriptMap[prompt];
    if (!stepKey || !script.chatScript[stepKey]) return;

    const step = script.chatScript[stepKey];
    setChatMessages((prev) => [...prev, ...step.messages]);
    setChatPrompts(step.prompts || []);
    if (step.showFindings) setShowFindings(true);
    if (step.auditUpdate) {
      setAuditTrail((prev) => [step.auditUpdate, ...prev]);
    }
  };

  const handleAction = (action: string) => {
    if (!script) return;
    if (action === 'Approve & Save' && script.chatScript['approve-narrative']) {
      const step = script.chatScript['approve-narrative'];
      setChatMessages((prev) => [...prev, ...step.messages]);
      setChatPrompts(step.prompts || []);
      if (step.auditUpdate) setAuditTrail((prev) => [step.auditUpdate, ...prev]);
    }
    if (action === 'approve-drafts') {
      setChatMessages((prev) => [
        ...prev,
        { role: 'user', content: '✓ Approved. Submit all drafted queries to EDC.' },
        { role: 'ai', content: '✓ **2 queries submitted to EDC successfully.**\n\nDQ-001 sent to Site Investigator for SUBJ-002.\nDQ-002 sent to Medical Monitor for SUBJ-007.\n\nAudit trail updated. Query status changed to SUBMITTED.' },
      ]);
      setChatPrompts(['What is our milestone status?', 'Write a narrative for SUBJ-003', 'What changed since my last review?']);
      setAuditTrail((prev) => [{ time: '06:48 PM', text: '**Query Resolution Agent** submitted 2 queries to EDC' }, ...prev]);
    }
  };

  const handleAgentAction = (trigger: string) => {
    if (!script) return;
    if (trigger === 'review-drafts' && script.chatScript['review-drafts']) {
      const step = script.chatScript['review-drafts'];
      setChatMessages((prev) => [...prev, ...step.messages]);
      setChatPrompts(step.prompts || []);
      if (step.auditUpdate) setAuditTrail((prev) => [step.auditUpdate, ...prev]);
      return;
    }
    handlePromptClick(
      trigger === 'show-anomalies' ? 'Show me the anomalies' :
      trigger === 'milestone-status' ? 'What is our milestone status?' : ''
    );
  };

  const roleAbbr = user?.role === 'MEDICAL_REVIEWER' ? 'MR' : user?.role?.split('_').map((w) => w[0]).join('').toUpperCase() || 'U';

  if (!script) return <div className="min-h-screen bg-navy-900 flex items-center justify-center text-cyan-400">Loading...</div>;

  function renderBold(text: string) {
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
      part.startsWith('**') ? <strong key={i} className="text-white">{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-navy-900">
      {/* Header */}
      <header className="h-14 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1.5 rounded hover:bg-navy-800 text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Activity className="w-5 h-5 text-cyan-400" />
          <span className="text-lg font-bold text-cyan-400">TrialClarity</span>
          <StudySelector />
        </div>
        <div className="flex items-center gap-3">
<span className="px-2.5 py-1 text-[10px] font-semibold bg-green-900/50 text-green-400 border border-green-700 rounded">AI AGENTS ACTIVE</span>
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">{roleAbbr}</div>
          <div className="hidden sm:block">
            <div className="text-sm text-white leading-tight">{user?.name}</div>
            <div className="text-[10px] text-cyan-400 uppercase">{user?.role?.replace(/_/g, ' ')}</div>
          </div>
          <button onClick={() => dispatch(toggleTheme())} className="p-1.5 rounded hover:bg-navy-800 text-slate-400 hover:text-white">
            {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => dispatch(logout())} className="p-1.5 rounded hover:bg-red-900/50 text-slate-400 hover:text-red-400">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Agent Dashboard */}
        <aside className="w-72 border-r border-slate-700 flex flex-col shrink-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Agent Dashboard</span>
            <span className="text-[9px] text-slate-500">Last run: 2 min ago</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {script.agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onAction={handleAgentAction} />
            ))}

            <div className="mt-4">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Audit Trail</p>
              <div className="space-y-2">
                {auditTrail.map((entry, idx) => (
                  <div key={idx} className="flex gap-2 text-[10px]">
                    <span className="text-slate-500 shrink-0 w-12">{entry.time}</span>
                    <span className="text-slate-400">{renderBold(entry.text)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Study Overview + Findings */}
        <main className="flex-1 overflow-y-auto p-6 border-r border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Study Overview</span>
            <span className="text-[10px] text-slate-500">{script.studyOverview.studyId} · {script.studyOverview.date}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {script.studyOverview.stats.map((stat: any, idx: number) => (
              <div key={idx} className="p-4 bg-navy-800 border border-slate-700 rounded-lg">
                <div className={`text-2xl font-bold ${stat.color === 'red' ? 'text-red-400' : stat.color === 'amber' ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {stat.value}
                </div>
                <div className="text-[9px] text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
                {stat.detail && <div className="text-[10px] text-slate-500 mt-0.5">{stat.detail}</div>}
                {stat.progress && (
                  <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${stat.progress}%` }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Findings */}
          <div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-3">
              {showFindings ? 'ML Anomaly Findings — 3 Flagged' : 'Findings — Awaiting Analysis'}
            </p>
            {!showFindings ? (
              <p className="text-xs text-slate-500">Agent findings will appear here as they are processed.</p>
            ) : (
              <div className="space-y-3">
                {script.findings.map((finding, idx) => (
                  <div key={idx} className="p-4 bg-navy-800 border border-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-400">{finding.subjid}</span>
                        <span className="text-[9px] text-slate-500">{finding.domain}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${finding.severity === 'CRITICAL' ? 'bg-red-900/50 text-red-400 border border-red-700' : 'bg-amber-900/50 text-amber-400 border border-amber-700'}`}>
                          {finding.severity}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">AI conf. {finding.confidence}%</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">{finding.description}</p>
                    <p className="text-[10px] text-slate-500 mt-1.5">● {finding.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right: AI Concierge Chat */}
        <aside className="w-96 flex flex-col shrink-0">
          <ConciergeChat
            messages={chatMessages}
            prompts={chatPrompts}
            findings={script.findings}
            onPromptClick={handlePromptClick}
            onAction={handleAction}
          />
        </aside>
      </div>

      {/* Perficient Confidential */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-navy-900/80 border border-slate-700 rounded text-slate-400 text-xs backdrop-blur-sm">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        PERFICIENT CONFIDENTIAL
      </div>
    </div>
  );
}
