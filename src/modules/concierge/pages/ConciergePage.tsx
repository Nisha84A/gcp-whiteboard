import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, MessageSquare } from 'lucide-react';

export default function ConciergeDemo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      <header className="h-14 bg-navy-900 border-b border-slate-700 flex items-center px-4 gap-4 shrink-0">
        <button onClick={() => navigate('/')} className="p-1.5 rounded hover:bg-navy-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span className="text-lg font-bold text-cyan-400">TrialClarity</span>
        </div>
        <span className="text-sm text-slate-400">Data Management Concierge</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-900/40 border border-red-700 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Data Management Concierge</h1>
          <p className="text-sm text-slate-400 mb-6">Module 8 — Natural-language AI interface for querying study data, surfacing safety signals, and triggering workflows.</p>
          <div className="px-4 py-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-xs text-red-400 font-medium">Coming Soon</p>
            <p className="text-[10px] text-slate-500 mt-1">This module is under development</p>
          </div>
        </div>
      </main>
    </div>
  );
}
