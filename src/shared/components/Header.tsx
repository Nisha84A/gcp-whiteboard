import { useState, useEffect } from 'react';
import { Activity, Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/shared/store';
import { logout } from '@/shared/store/authSlice';
import { toggleTheme } from '@/shared/store/themeSlice';
import StudySelector from './StudySelector';

interface HeaderProps {
  queryCount?: number;
  onQueryClick?: () => void;
}

export default function Header({ queryCount, onQueryClick }: HeaderProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    <header className="h-14 bg-navy-900 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
      {/* Left: Logo + Study info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Activity className="w-5 h-5 text-cyan-400" />
          <span className="text-lg font-bold text-cyan-400">TrialClarity</span>
        </div>
        <StudySelector />
      </div>

      {/* Right: Badges + User + Actions */}
      <div className="flex items-center gap-3">
        {/* Queries badge */}
        {queryCount !== undefined && (
          <button
            onClick={onQueryClick}
            className="px-2.5 py-1 text-[10px] font-medium bg-red-900/50 border border-red-700 rounded text-red-400 hover:bg-red-900/70 transition-colors cursor-pointer"
          >
            ● {queryCount} Queries
          </button>
        )}

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-white leading-tight">{user?.name}</div>
            <div className="text-[10px] text-cyan-400 uppercase leading-tight">{roleDisplay}</div>
          </div>
        </div>

        {/* Date/time */}
        <span className="text-[10px] text-slate-500 hidden lg:block">
          {time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>

        {/* Theme toggle */}
        <button onClick={() => dispatch(toggleTheme())} className="p-1.5 rounded hover:bg-navy-800 text-slate-400 hover:text-white transition-colors">
          {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Logout */}
        <button onClick={() => dispatch(logout())} className="p-1.5 rounded hover:bg-red-900/50 text-slate-400 hover:text-red-400 transition-colors" title="Logout">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
