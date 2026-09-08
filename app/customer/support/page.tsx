'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import CustomerSidebar from '@/components/CustomerSidebar';
import { HelpCircle, Mail, Phone, MessageCircle, ShieldCheck } from 'lucide-react';

export default function CustomerSupportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <CustomerSidebar />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-black text-slate-900 mb-1">Help & Support</h1>
            <p className="text-xs text-slate-500 mb-8">Frequently asked questions and support helpline for e-warranties.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
                <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <h3 className="text-xs font-bold text-slate-900">Email Helpdesk</h3>
                <p className="text-[11px] text-slate-500 mt-1">support@ewarranty.com</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
                <Phone className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <h3 className="text-xs font-bold text-slate-900">Toll-Free Support</h3>
                <p className="text-[11px] text-slate-500 mt-1">1800-200-9842</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
                <MessageCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-xs font-bold text-slate-900">WhatsApp Desk</h3>
                <p className="text-[11px] text-slate-500 mt-1">+91 9876543210</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-900">How long does warranty approval take?</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Once your QR code and invoice details are submitted, the admin team typically verifies and issues your certificate within 2 to 24 business hours.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-900">How do I verify the authenticity of my certificate?</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Every certificate has an encrypted QR code. Anyone can scan the QR code with their mobile phone to open the public verification portal.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900">Can I download my certificate offline?</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Yes, you can click "Download PDF" on your warranties page at any time to save an official copy to your phone or computer.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
