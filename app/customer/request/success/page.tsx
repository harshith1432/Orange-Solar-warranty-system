'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CustomerSidebar from '@/components/CustomerSidebar';
import { CheckCircle2, Mail, MessageCircle, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('id') || 'REQ12348';
  const productName = searchParams.get('product') || 'Smartphone XYZ';

  return (
    <div className="max-w-2xl mx-auto my-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-emerald-100">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
        Request Submitted Successfully!
      </h1>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
        Your e-warranty for <span className="font-bold text-slate-800">{productName}</span> has been submitted.
        You will be notified once it is reviewed by admin.
      </p>

      {/* Request ID Badge */}
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl mb-8">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Request ID:</span>
        <span className="text-base font-mono font-black text-blue-700">{requestId}</span>
      </div>

      {/* Notification indicator */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 max-w-md mx-auto">
        <p className="text-xs font-bold text-slate-600 mb-3">You will be notified via</p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-blue-200 rounded-xl text-blue-700 text-xs font-bold shadow-xs">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>Email</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold shadow-xs">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Action CTA buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/customer/dashboard"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/admin/dashboard"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <span>Review as Admin</span>
          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
        </Link>
      </div>
    </div>
  );
}

export default function RequestSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <CustomerSidebar />
        <main className="flex-1 p-6 sm:p-8 flex items-center justify-center">
          <Suspense fallback={<div>Loading submission details...</div>}>
            <SuccessContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
