'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';
import { Settings, Bell, Mail, MessageCircle, ShieldCheck, Check, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [smtpHost, setSmtpHost] = useState('smtp.sendgrid.net');
  const [smtpPort, setSmtpPort] = useState('587');
  const [whatsappApiKey, setWhatsappApiKey] = useState('wa_live_sec_9938192837482');
  const [defaultWarrantyMonths, setDefaultWarrantyMonths] = useState('12');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AdminSidebar />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-black text-slate-900 mb-1">System & Gateway Settings</h1>
            <p className="text-xs text-slate-500 mb-6">
              Configure Email SMTP credentials, WhatsApp Cloud API gateway, and warranty business policies.
            </p>

            {saved && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Gateway settings successfully updated!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Email Gateway */}
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Email Dispatch (SMTP Gateway)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">SMTP Server Host</label>
                    <input
                      type="text"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Port</label>
                    <input
                      type="text"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp Gateway */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Cloud API Key</span>
                </div>
                <div>
                  <input
                    type="password"
                    value={whatsappApiKey}
                    onChange={(e) => setWhatsappApiKey(e.target.value)}
                    className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Simulated sandbox mode is active for immediate local testing.</p>
                </div>
              </div>

              {/* Warranty Policy */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Default Warranty Duration</span>
                </div>
                <div className="max-w-xs">
                  <select
                    value={defaultWarrantyMonths}
                    onChange={(e) => setDefaultWarrantyMonths(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="6">6 Months Standard</option>
                    <option value="12">12 Months (1 Year Standard)</option>
                    <option value="24">24 Months (2 Years Extended)</option>
                    <option value="36">36 Months (3 Years Platinum)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Settings</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
