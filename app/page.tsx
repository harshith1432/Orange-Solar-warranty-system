import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  User,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Zap,
  FileText,
  Sun,
  BatteryCharging,
  Award,
  QrCode,
  Smartphone,
  Clock,
  FileCheck
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfd] text-slate-800 relative overflow-hidden font-sans selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* Decorative Radiant Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-amber-100/50 via-orange-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-bl from-orange-200/20 via-amber-100/15 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

      {/* 1. HOME PAGE HERO */}
      <div className="flex-1 max-w-6xl mx-auto px-4 pt-12 pb-20 sm:pt-16 sm:pb-24 flex flex-col items-center justify-center text-center relative z-10">
        
        {/* Official Company Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-orange-200 shadow-xs text-orange-900 text-xs font-medium mb-6">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span>Official Orange Solar Digital E-Warranty Platform</span>
          <span className="text-orange-300">|</span>
          <span className="text-orange-700 font-semibold">ISO 9001:2015</span>
        </div>

        {/* Brand Shield Emblem */}
        <div className="relative group mb-5">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 ring-4 ring-orange-100 transition-transform duration-300 group-hover:scale-105">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-sm border border-orange-200 flex items-center justify-center text-orange-600">
            <Sun className="w-3.5 h-3.5" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-2 sm:mb-3">
          E-Warranty System
        </h1>
        
        <p className="text-lg sm:text-xl font-semibold tracking-tight text-orange-600 mb-4">
          Secure • Fast • Paperless
        </p>

        <p className="max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-8">
          The enterprise warranty management platform by Sun Zone Solar System India Pvt. Ltd. Register manufacturer product warranties, track real-time verification milestones, and access tamper-proof digital certificates.
        </p>

        {/* Dual Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl text-left mb-16">
          {/* Customer Login Card */}
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl p-8 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/10 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all">
                <User className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Customer Portal</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Register new warranties, scan product QR barcodes, and view or download your verified e-warranty certificates.
              </p>
            </div>
            <Link
              href="/customer/dashboard"
              className="w-full py-3 px-5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-center flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <span>Customer Access</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Admin Login Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-7 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center mb-4 group-hover:bg-slate-900 group-hover:text-white transition-all">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1.5">Admin Portal</h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
                Review incoming warranty claims, verify purchase invoice data, and approve digital certificates with QR authenticity.
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-center flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <span>Admin Access</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl text-left mb-16">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3.5">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1.5">Instant Registration</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Select your product from our catalog, attach your invoice details, and submit a warranty claim in seconds.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-300 hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3.5">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1.5">Milestone Timeline</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Track live progress of your claim verification from submission, inspection, approval, to official card issuance.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3.5">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1.5">3-Way Notification</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Automatic certificate dispatch simultaneously across WhatsApp, Email, and SMS with instant QR code verification.
            </p>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="pt-10 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-4xl text-center">
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-2" />
            <span className="text-xs font-semibold text-slate-800">Fast Approval Workflow</span>
          </div>
          <div className="flex flex-col items-center">
            <QrCode className="w-5 h-5 text-orange-600 mb-2" />
            <span className="text-xs font-semibold text-slate-800">Public QR Verification</span>
          </div>
          <div className="flex flex-col items-center">
            <Smartphone className="w-5 h-5 text-amber-600 mb-2" />
            <span className="text-xs font-semibold text-slate-800">WhatsApp, SMS & Email</span>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-5 h-5 text-orange-600 mb-2" />
            <span className="text-xs font-semibold text-slate-800">Secure Digital Certificates</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-500 bg-white">
        © 2026 E-Warranty System • Orange Solar • All rights reserved.
      </footer>
    </div>
  );
}
