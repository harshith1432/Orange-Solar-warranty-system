'use client';

import React, { useEffect, useState } from 'react';
import { Mail, MessageCircle, X, Bell } from 'lucide-react';

export interface NotificationItem {
  id: string;
  type: 'email' | 'whatsapp' | 'system';
  recipient: string;
  title: string;
  message: string;
  timestamp: string;
}

export function triggerNotification(item: Omit<NotificationItem, 'id' | 'timestamp'>) {
  if (typeof window === 'undefined') return;
  const fullItem: NotificationItem = {
    ...item,
    id: `notif_${Date.now()}_${Math.random()}`,
    timestamp: new Date().toLocaleTimeString(),
  };
  const event = new CustomEvent('app-notification', { detail: fullItem });
  window.dispatchEvent(event);
}

export default function NotificationToast() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<NotificationItem>;
      if (customEvent.detail) {
        setNotifications((prev) => [customEvent.detail, ...prev].slice(0, 4));
      }
    };

    window.addEventListener('app-notification', handleEvent);
    return () => window.removeEventListener('app-notification', handleEvent);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="pointer-events-auto bg-white border border-slate-200 rounded-xl shadow-2xl p-4 transition-all animate-in slide-in-from-right-5 fade-in duration-300 relative overflow-hidden"
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-lg text-white shrink-0 ${
                notif.type === 'email'
                  ? 'bg-blue-600'
                  : notif.type === 'whatsapp'
                  ? 'bg-emerald-600'
                  : 'bg-indigo-600'
              }`}
            >
              {notif.type === 'email' && <Mail className="w-5 h-5" />}
              {notif.type === 'whatsapp' && <MessageCircle className="w-5 h-5" />}
              {notif.type === 'system' && <Bell className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {notif.type === 'email' ? 'Email Dispatch' : notif.type === 'whatsapp' ? 'WhatsApp Message' : 'Notification'}
                </span>
                <span className="text-[11px] text-slate-400">{notif.timestamp}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">{notif.title}</h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notif.message}</p>
              <div className="mt-2 text-[11px] font-medium text-slate-500 bg-slate-50 py-1 px-2 rounded inline-block">
                To: {notif.recipient}
              </div>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
