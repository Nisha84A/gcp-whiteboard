import { X } from 'lucide-react';

interface Query {
  id: string;
  subjid: string;
  domain: string;
  variable: string;
  issue: string;
  priority: string;
  status: string;
  raisedBy: string;
  raisedDate: string;
}

interface QueryPanelProps {
  queries: Query[];
  onClose: () => void;
  onNewQuery: () => void;
}

const priorityColor: Record<string, string> = {
  CRITICAL: 'bg-red-900/60 text-red-400 border-red-700',
  HIGH: 'bg-amber-900/60 text-amber-400 border-amber-700',
  MEDIUM: 'bg-blue-900/60 text-blue-400 border-blue-700',
  LOW: 'bg-slate-700 text-slate-300 border-slate-600',
};

const borderColor: Record<string, string> = {
  CRITICAL: 'border-l-red-500',
  HIGH: 'border-l-amber-500',
  MEDIUM: 'border-l-blue-500',
  LOW: 'border-l-slate-500',
};

export default function QueryPanel({ queries, onClose, onNewQuery }: QueryPanelProps) {
  const openQueries = queries.filter((q) => q.status === 'OPEN');

  return (
    <aside className="w-80 border-l border-slate-700 bg-navy-800 flex flex-col shrink-0 h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <span className="text-sm font-semibold text-white">Open Queries</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 bg-navy-900 border border-slate-600 px-2 py-0.5 rounded">{openQueries.length} open</span>
          <button
            onClick={onNewQuery}
            className="text-[10px] font-semibold px-2.5 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded-md transition-colors"
          >
            + New Query
          </button>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {queries.sort((a, b) => b.id.localeCompare(a.id)).map((query) => (
          <div
            key={query.id}
            className={`p-3.5 bg-navy-900 border border-slate-700 rounded-lg border-l-[3px] ${borderColor[query.priority] || 'border-l-slate-500'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400">{query.id}</span>
                <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border ${priorityColor[query.priority] || priorityColor.MEDIUM}`}>
                  {query.priority}
                </span>
                <span className="text-[10px] text-slate-500">{query.subjid} · {query.domain}</span>
              </div>
              <span className="text-[10px] font-semibold text-green-400">{query.status}</span>
            </div>
            <p className="text-xs font-semibold text-white mb-1.5">{query.variable}</p>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{query.issue}</p>
            <p className="text-[10px] text-slate-500">
              Raised by {query.raisedBy} · {new Date(query.raisedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
