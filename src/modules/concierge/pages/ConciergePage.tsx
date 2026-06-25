import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, Send } from 'lucide-react';
import { useAppSelector } from '@/shared/store';
import StudyContextSidebar from '../components/StudyContextSidebar';
import ChatMessage from '../components/ChatMessage';

interface ScriptData {
  study: any;
  capabilities: any[];
  chatScript: Record<string, any>;
}

export default function ConciergePage() {
  const [script, setScript] = useState<ScriptData | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const roleAbbr = user?.role === 'MEDICAL_REVIEWER' ? 'MR' : user?.role?.split('_').map((w: string) => w[0]).join('').toUpperCase() || 'U';

  useEffect(() => {
    fetch('/concierge-script.json')
      .then((r) => r.json())
      .then((data: ScriptData) => {
        setScript(data);
        const initial = data.chatScript.initial;
        setMessages(initial.messages);
        setPrompts(initial.prompts);
      });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const triggerScript = (key: string) => {
    if (!script || !script.chatScript[key]) return;
    const step = script.chatScript[key];

    const userMsg = step.messages.find((m: any) => m.role === 'user');
    const aiMsgs = step.messages.filter((m: any) => m.role === 'ai');

    if (userMsg) {
      setMessages((prev) => [...prev, userMsg]);
    }

    setIsTyping(true);
    setPrompts([]);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, ...aiMsgs]);
      setPrompts(step.prompts || []);
    }, 800);
  };

  const handlePromptClick = (prompt: string) => {
    const promptMap: Record<string, string> = {
      'Show me all anomalies': 'show-anomalies',
      'What changed since my last review?': 'what-changed',
      'Study status overview': 'study-status',
      'Show AEs for SUBJ-003': 'show-ae-subject',
      'Which subjects have severe AEs?': 'show-ae-all',
      'AE data': 'show-ae-all',
      'Are there any Hy\'s Law candidates?': 'hys-law',
      'Generate narratives for all critical subjects': 'generate-narratives-critical',
      'Write narrative for SUBJ-003': 'generate-narratives-critical',
      'Raise discrepancies on all flagged items': 'raise-discrepancies',
    };

    const key = promptMap[prompt];
    if (key) {
      triggerScript(key);
    }
  };

  const handleActionButton = (trigger: string) => {
    if (trigger && script?.chatScript[trigger]) {
      triggerScript(trigger);
    }
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) return;
    const query = inputValue.trim();
    setInputValue('');

    const queryMap: Record<string, string> = {
      'show me all anomalies': 'show-anomalies',
      'show anomalies': 'show-anomalies',
      'anomalies': 'show-anomalies',
      'what changed': 'what-changed',
      'what changed since my last review': 'what-changed',
      'study status': 'study-status',
      'status overview': 'study-status',
      'ae data': 'show-ae-all',
      'ae listing': 'show-ae-all',
      'all aes': 'show-ae-all',
      'severe ae': 'show-ae-all',
      'which subjects have severe aes': 'show-ae-all',
      'show aes for subj-003': 'show-ae-subject',
      'subj-003 aes': 'show-ae-subject',
      'hy\'s law': 'hys-law',
      'hys law': 'hys-law',
      'generate narratives': 'generate-narratives-critical',
      'narratives': 'generate-narratives-critical',
      'raise discrepancies': 'raise-discrepancies',
      'discrepancies': 'raise-discrepancies',
    };

    const lowerQuery = query.toLowerCase();
    const matchedKey = Object.keys(queryMap).find((k) => lowerQuery.includes(k));

    if (matchedKey) {
      const scriptKey = queryMap[matchedKey];
      const step = script?.chatScript[scriptKey];
      if (step) {
        setMessages((prev) => [...prev, { role: 'user', content: query, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }]);
        setIsTyping(true);
        setPrompts([]);

        const aiMsgs = step.messages.filter((m: any) => m.role === 'ai');
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [...prev, ...aiMsgs]);
          setPrompts(step.prompts || []);
        }, 800);
        return;
      }
    }

    setMessages((prev) => [...prev, { role: 'user', content: query, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        role: 'ai',
        type: 'text',
        content: `I can help you with that query about "${query}". Try one of the suggested prompts below for a guided demo experience.`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
      setPrompts(['Show me all anomalies', 'What changed since my last review?', 'Study status overview']);
    }, 800);
  };

  if (!script) {
    return <div className="min-h-screen bg-navy-900 flex items-center justify-center text-cyan-400">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-navy-900">
      {/* Header */}
      <header className="h-14 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1.5 rounded hover:bg-navy-800 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Activity className="w-5 h-5 text-cyan-400" />
          <span className="text-lg font-bold text-cyan-400">TrialClarity</span>
          <span className="text-sm text-slate-400 hidden md:inline">
            {script.study.id} · {script.study.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* User info */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">{roleAbbr}</div>
            <div className="hidden sm:block">
              <div className="text-sm text-white leading-tight">{user?.name || 'Dr. Maria Reyes'}</div>
              <div className="text-[10px] text-cyan-400 uppercase">{user?.role?.replace(/_/g, ' ') || 'Medical Reviewer'}</div>
            </div>
          </div>

          {/* Module badge */}
          <span className="px-2.5 py-1 text-[10px] font-semibold bg-navy-800 text-slate-300 border border-slate-600 rounded">Module 8</span>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <StudyContextSidebar study={script.study} capabilities={script.capabilities} />

        {/* Chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="px-6 py-3 border-b border-slate-700 bg-navy-900">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Data Management Concierge</p>
                <p className="text-[10px] text-slate-400">Natural language interface to Study {script.study.id}</p>
              </div>
              <span className="ml-auto px-2.5 py-1 text-[10px] font-semibold bg-navy-800 text-slate-300 border border-slate-600 rounded">Module 8</span>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4">
            {messages.map((msg, idx) => (
              <ChatMessage
                key={idx}
                message={msg}
                roleAbbr={roleAbbr}
                onAction={handleActionButton}
              />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
                </div>
                <div className="p-3 bg-navy-800 border border-slate-700 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestion buttons */}
          {prompts.length > 0 && (
            <div className="px-6 py-2 border-t border-slate-700/50 flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-3.5 py-1.5 text-xs text-slate-300 bg-navy-800 border border-slate-600 rounded-full hover:bg-slate-700 hover:text-white hover:border-slate-500 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="px-6 py-3 border-t border-slate-700 bg-navy-900">
            <div className="flex items-center gap-3 bg-navy-800 border border-slate-600 rounded-xl px-4 py-2.5 focus-within:border-cyan-600 transition-colors">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                placeholder="Ask about subjects, AEs, labs, queries, narratives..."
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
              />
              <button
                onClick={handleInputSubmit}
                className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
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
