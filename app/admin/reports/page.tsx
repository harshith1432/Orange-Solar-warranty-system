'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';
import { BarChart3, TrendingUp, Users, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AdminSidebar />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900">Warranty Reports & Analytics</h1>
            <p className="text-xs text-slate-500 mt-1">
              Operational metrics on claim velocities, turnaround time, and retail store statistics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Approval Rate</span>
              <div className="text-3xl font-black text-emerald-600 my-2">87.5%</div>
              <p className="text-[11px] text-slate-400">Above target benchmark (80%)</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg. Review Time</span>
              <div className="text-3xl font-black text-indigo-600 my-2">3.4 hrs</div>
              <p className="text-[11px] text-slate-400">Same-day turnaround</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Warranties</span>
              <div className="text-3xl font-black text-slate-900 my-2">₹2.4M</div>
              <p className="text-[11px] text-slate-400">Insured retail value</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Paperless Savings</span>
              <div className="text-3xl font-black text-blue-600 my-2">99.8%</div>
              <p className="text-[11px] text-slate-400">Zero printed documentation</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Top Retail Stores by Claims</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-900">Tech Store (Main Branch)</span>
                <span className="font-semibold text-slate-600">62% of requests</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-900">Mega Electronics</span>
                <span className="font-semibold text-slate-600">24% of requests</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-900">Sound Wave Audio</span>
                <span className="font-semibold text-slate-600">14% of requests</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
