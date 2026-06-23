import { AlertTriangle, AlertCircle, Clock, Bot, FlaskConical, CheckCircle, RefreshCw, FileText } from 'lucide-react';

interface Notification {
  type: string;
  color: string;
  icon: string;
  message: string;
  time: string;
  source: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  alert: AlertCircle,
  warning: AlertTriangle,
  clock: Clock,
  bot: Bot,
  flask: FlaskConical,
  check: CheckCircle,
  sync: RefreshCw,
  file: FileText,
};

const colorMap: Record<string, string> = {
  red: 'border-red-500 bg-red-500',
  amber: 'border-amber-500 bg-amber-500',
  green: 'border-green-500 bg-green-500',
  blue: 'border-blue-500 bg-blue-500',
  purple: 'border-purple-500 bg-purple-500',
};

const badgeColorMap: Record<string, string> = {
  red: 'bg-red-900/50 text-red-400 border-red-700',
  amber: 'bg-amber-900/50 text-amber-400 border-amber-700',
  green: 'bg-green-900/50 text-green-400 border-green-700',
  blue: 'bg-blue-900/50 text-blue-400 border-blue-700',
  purple: 'bg-purple-900/50 text-purple-400 border-purple-700',
};

function renderMessage(msg: string) {
  const parts = msg.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function NotificationPanel({ notifications }: NotificationPanelProps) {
  const newCount = notifications.length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <span className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Notifications</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-red-600 text-white rounded-full px-2 py-0.5 font-medium">{newCount} new</span>
          <button className="text-[10px] text-slate-400 hover:text-white uppercase tracking-wide">Mark all read</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications.map((notif, idx) => {
          const Icon = iconMap[notif.icon] || AlertCircle;
          return (
            <div
              key={idx}
              className={`px-4 py-3 border-b border-slate-700/50 border-l-3 ${colorMap[notif.color]?.split(' ')[0] || 'border-slate-500'}`}
              style={{ borderLeftWidth: '3px' }}
            >
              <div className="flex items-start gap-2.5">
                <div className={`mt-0.5 p-1 rounded ${colorMap[notif.color]?.split(' ')[1] || 'bg-slate-600'} bg-opacity-20`}>
                  <Icon className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border mb-1 ${badgeColorMap[notif.color] || 'bg-slate-800 text-slate-400 border-slate-600'}`}>
                    {notif.type}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {renderMessage(notif.message)}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {notif.time} · {notif.source}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
