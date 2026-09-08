'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, UserCheck, ShieldAlert, RotateCcw, Home } from 'lucide-react';
import { resetAllData } from '@/lib/storage';

export default function Navbar() {
  const pathname = usePathname();
  const isCustomer = pathname.startsWith('/customer');
  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-tight">
                E-Warranty
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                Solar
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none">Smart Warranty Platform</p>
          </div>
        </Link>

        {/* Quick Portal Switcher & Reset Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link
            href="/customer/dashboard"
            className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              isCustomer
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-sm shadow-orange-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Customer Portal</span>
          </Link>

          <Link
            href="/admin/dashboard"
            className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              isAdmin
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Admin Portal</span>
          </Link>

          <button
            onClick={() => {
              if (confirm('Reset demo data to initial wireframe state?')) {
                resetAllData();
                window.location.reload();
              }
            }}
            title="Reset prototype state to initial wireframe data"
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
