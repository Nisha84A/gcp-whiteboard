import { useState } from 'react';
import { X, Flag } from 'lucide-react';
import { useAppSelector } from '@/store';

interface QueryModalProps {
  onClose: () => void;
  onSubmit: (query: { subjid: string; domain: string; variable: string; issue: string; priority: string }) => void;
}

export default function QueryModal({ onClose, onSubmit }: QueryModalProps) {
  const subjects = useAppSelector((state) => state.data.subjects);
  const [subjid, setSubjid] = useState(subjects[0]?.id || '');
  const [domain, setDomain] = useState('');
  const [variable, setVariable] = useState('');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState('High');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjid || !domain || !issue) return;
    onSubmit({ subjid, domain, variable, issue, priority: priority.toUpperCase() });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-navy-800 border border-slate-600 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-red-400" />
            <h2 className="text-base font-bold text-white">Raise Data Query</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
              <select
                value={subjid}
                onChange={(e) => setSubjid(e.target.value)}
                className="w-full px-3 py-2 bg-navy-900 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.id} · {s.arm}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. AE, LB, CM, DM"
                className="w-full px-3 py-2 bg-navy-900 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Variable / Data Point</label>
            <input
              type="text"
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              placeholder="e.g. ALT value, AE term, dose date"
              className="w-full px-3 py-2 bg-navy-900 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Query Description</label>
            <textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Describe the discrepancy or clarification needed..."
              rows={4}
              className="w-full px-3 py-2 bg-navy-900 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-y"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-40 px-3 py-2 bg-navy-900 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-cyan-700 hover:bg-cyan-600 rounded-lg transition-colors"
            >
              Submit Query
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
