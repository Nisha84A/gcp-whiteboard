import { useEffect, useState } from 'react';
import { Activity, Bell, Sun, Moon, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/shared/store';
import { logout } from '@/shared/store/authSlice';
import { toggleTheme } from '@/shared/store/themeSlice';
import NotificationPanel from '@/shared/components/NotificationPanel';
import StatsBar from '@/shared/components/StatsBar';
import DemoCard from '@/shared/components/DemoCard';

interface HubData {
  header: { subtitle: string };
  hero: { tag: string; title: string; titleHighlight: string; description: string };
  statsHeader: string;
  statsRefresh: string;
  stats: { value: string; label: string; change: string; color: string }[];
  modulesHeader: string;
  modules: any[];
  footer: string;
}

interface Notification {
  type: string;
  color: string;
  icon: string;
  message: string;
  time: string;
  source: string;
}

export default function DemoHub() {
  const [hubData, setHubData] = useState<HubData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const mode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    fetch('/demo-hub.json').then((r) => r.json()).then(setHubData);
    fetch('/notifications.json').then((r) => r.json()).then(setNotifications);
  }, []);

  if (!hubData) return <div className="min-h-screen bg-navy-900 flex items-center justify-center text-cyan-400">Loading...</div>;

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const roleDisplay = user?.role?.replace(/_/g, ' ') || 'Reviewer';

  function highlightTitle(title: string, highlight: string) {
    const idx = title.indexOf(highlight);
    if (idx === -1) return <>{title}</>;
    return (
      <>
        {title.slice(0, idx)}
        <span className="text-green-400">{highlight}</span>
        {title.slice(idx + highlight.length)}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col">
      {/* Header */}
      <header className="h-14 bg-navy-900 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span className="text-lg font-bold text-cyan-400">TrialClarity</span>
          </div>
          <span className="text-sm text-slate-400 hidden sm:inline">{hubData.header.subtitle}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-1.5 rounded hover:bg-navy-800 text-slate-400 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 rounded-full text-[8px] text-white flex items-center justify-center font-bold">{notifications.length}</span>
          </button>

          <button onClick={() => dispatch(toggleTheme())} className="p-1.5 rounded hover:bg-navy-800 text-slate-400 hover:text-white transition-colors">
            {mode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
            <div className="hidden sm:block">
              <div className="text-sm text-white leading-tight">{user?.name}</div>
              <div className="text-xs text-cyan-400 uppercase leading-tight">{roleDisplay}</div>
            </div>
          </div>

          <button onClick={() => dispatch(logout())} className="p-1.5 rounded hover:bg-red-900/50 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Notifications sidebar - toggled by bell icon */}
        {showNotifs && (
          <aside className="w-full lg:w-80 border-r border-slate-700 bg-navy-800 flex flex-col shrink-0 max-h-[calc(100vh-3.5rem)] lg:max-h-none">
            <NotificationPanel notifications={notifications} />
          </aside>
        )}

        {/* Main area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Hero */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-green-400 inline-block"></span>
              {hubData.hero.tag}
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
              {highlightTitle(hubData.hero.title, hubData.hero.titleHighlight)}
              <br />Review Platform
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">{hubData.hero.description}</p>
          </div>

          {/* Stats */}
          <StatsBar stats={hubData.stats} header={hubData.statsHeader} refresh={hubData.statsRefresh} />

          {/* Modules */}
          <div className="mb-6">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4">{hubData.modulesHeader}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {hubData.modules.map((mod) => (
                <DemoCard key={mod.id} module={mod} />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 p-4 bg-navy-800 border border-slate-700 rounded-lg">
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-cyan-400 font-semibold">ℹ️ {hubData.footer.split(':')[0]}:</span>
              {hubData.footer.split(':').slice(1).join(':')}
            </p>
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
