import { useState, useEffect } from 'react';
import { Activity, Sun, Moon, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/authSlice';
import { toggleTheme } from '@/store/themeSlice';

export default function Header() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const mode = useAppSelector((state) => state.theme.mode);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const roleDisplay = user?.role?.replace(/_/g, ' ') || 'Reviewer';

  return (
    <header className="h-14 bg-navy-900 dark:bg-navy-900 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span className="text-lg font-bold text-cyan-400">TrialClarity</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="px-2 py-0.5 bg-navy-800 border border-slate-600 rounded text-slate-300 font-mono text-xs">
            ABC-2024-001
          </span>
          <span className="text-slate-400">
            Efficacy & Safety of Drug ABC/XYZ in T2D &middot; Phase 3 &middot; Double-Blind
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 hidden md:block">
          {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>

        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-1.5 rounded hover:bg-navy-800 text-slate-400 hover:text-white transition-colors"
          title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
        >
          {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm text-white leading-tight">{user?.name}</div>
            <div className="text-xs text-cyan-400 uppercase leading-tight">{roleDisplay}</div>
          </div>
        </div>

        <button
          onClick={() => dispatch(logout())}
          className="p-1.5 rounded hover:bg-red-900/50 text-slate-400 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
