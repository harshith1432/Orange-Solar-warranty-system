import React from 'react';
import { X, MessageCircle, Mail, Smartphone, CheckCircle2 } from 'lucide-react';

export default function NotificationModal({ isOpen, onClose, notifications }) {
  if (!isOpen || !notifications || notifications.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">3-Way Multi-Channel Notification Dispatch</h3>
              <p className="text-xs text-slate-500">Transmitted simultaneously across WhatsApp, Email, and SMS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Feeds */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {notifications.map((notif, idx) => {
            const isWa = notif.channel === 'WHATSAPP';
            const isEmail = notif.channel === 'EMAIL';
            const isSms = notif.channel === 'SMS';

            return (
              <div
                key={notif.id || idx}
                className={`border rounded-2xl p-4 transition-all ${
                  isWa
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : isEmail
                    ? 'border-amber-200 bg-amber-50/50'
                    : 'border-indigo-200 bg-indigo-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isWa && (
                      <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                        <MessageCircle className="w-4 h-4" />
                      </span>
                    )}
                    {isEmail && (
                      <span className="p-1.5 rounded-lg bg-brand-500 text-white">
                        <Mail className="w-4 h-4" />
                      </span>
                    )}
                    {isSms && (
                      <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                        <Smartphone className="w-4 h-4" />
                      </span>
                    )}
                    <div>
                      <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        {notif.channel} Transmission
                      </span>
                      <span className="block text-[11px] text-slate-500 font-medium">
                        To: {notif.channel === 'EMAIL' ? notif.recipientEmail : notif.recipientPhone}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    DELIVERED
                  </span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-slate-200/80 text-xs font-mono text-slate-800 whitespace-pre-line shadow-xs">
                  {notif.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
