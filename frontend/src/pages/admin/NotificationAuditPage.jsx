import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import { notificationsApi } from '../../utils/api';
import { BellRing, MessageCircle, Mail, Smartphone, CheckCircle2, Search } from 'lucide-react';

export default function NotificationAuditPage() {
  const [logs, setLogs] = useState([]);
  const [filterChannel, setFilterChannel] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsApi.getAll()
      .then((res) => {
        if (res.data) setLogs(res.data);
      })
      .catch((err) => console.error('Error fetching notifications', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter((log) => {
    return filterChannel === 'ALL' || log.channel === filterChannel;
  });

  return (
    <div className="h-screen flex flex-col bg-slate-100 font-sans overflow-hidden">
      <Navbar />

      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 h-full overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                <BellRing className="w-3.5 h-3.5" />
                <span>3-Way Multi-Channel Broadcasting</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900">Notification Transmission Log</h1>
              <p className="text-xs text-slate-500 mt-1">
                Real-time audit log of all automated dispatches sent via WhatsApp, Email, and SMS.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs">
              {['ALL', 'WHATSAPP', 'EMAIL', 'SMS'].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setFilterChannel(ch)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filterChannel === ch
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                No notification transmission logs found.
              </div>
            ) : (
              filtered.map((log) => {
                const isWa = log.channel === 'WHATSAPP';
                const isEmail = log.channel === 'EMAIL';
                const isSms = log.channel === 'SMS';

                return (
                  <div
                    key={log.id}
                    className={`bg-white border rounded-3xl p-5 shadow-xs transition-all ${
                      isWa ? 'border-emerald-200' : isEmail ? 'border-amber-200' : 'border-indigo-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        {isWa && (
                          <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                            <MessageCircle className="w-4 h-4" />
                          </span>
                        )}
                        {isEmail && (
                          <span className="p-2 rounded-xl bg-brand-500 text-white shadow-xs">
                            <Mail className="w-4 h-4" />
                          </span>
                        )}
                        {isSms && (
                          <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                            <Smartphone className="w-4 h-4" />
                          </span>
                        )}
                        <div>
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                            {log.channel} Transmission
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Recipient: <strong>{log.recipientName}</strong> • {log.channel === 'EMAIL' ? log.recipientEmail : log.recipientPhone}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {log.deliveryStatus}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(log.sentAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-mono text-slate-800 whitespace-pre-line">
                      {log.content}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
