import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import CustomerSidebar from '../../components/CustomerSidebar';
import CustomerBottomNav from '../../components/CustomerBottomNav';
import { CheckCircle2, MessageCircle, Mail, Smartphone, ArrowRight, Layers } from 'lucide-react';

export default function ApplicationSuccessPage() {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('id') || 'REQ12348';
  const productName = searchParams.get('product') || 'Selected Product';

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      <Navbar />

      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        <CustomerSidebar />

        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8 flex items-center justify-center">
          <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-xs text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-emerald-100">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Request Submitted Successfully!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
              Your e-warranty for <span className="font-bold text-slate-800">{productName}</span> has been submitted successfully. You will be notified once reviewed by admin.
            </p>

            {/* Request ID Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50/70 border border-amber-200 rounded-2xl mb-8">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Request ID:</span>
              <span className="text-base font-mono font-black text-brand-600">{requestId}</span>
            </div>

            {/* 3-Way Notification Notification Channel Badge */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 max-w-md mx-auto text-center">
              <p className="text-xs font-bold text-slate-600 mb-3">You will receive simultaneous alerts via</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold shadow-xs">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-200 rounded-xl text-brand-700 text-xs font-bold shadow-xs">
                  <Mail className="w-3.5 h-3.5 text-brand-600" />
                  <span>Email</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-xl text-indigo-700 text-xs font-bold shadow-xs">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>SMS</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/customer/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/customer/warranties"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <Layers className="w-4 h-4 text-brand-400" />
                <span>Track Milestones Timeline</span>
              </Link>
            </div>
          </div>
        </main>
      </div>

      <CustomerBottomNav />
    </div>
  );
}
