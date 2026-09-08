'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CustomerSidebar from '@/components/CustomerSidebar';
import { getRequests, getCustomer } from '@/lib/storage';
import { WarrantyRequest, User } from '@/lib/types';
import {
  QrCode,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const [customer, setCustomer] = useState<User | null>(null);
  const [requests, setRequests] = useState<WarrantyRequest[]>([]);
  const [selectedReqForModal, setSelectedReqForModal] = useState<WarrantyRequest | null>(null);

  const loadData = () => {
    setCustomer(getCustomer());
    // Filter to requests belonging to Rahul Sharma
    const all = getRequests();
    const userReqs = all.filter((r) => r.customerName === 'Rahul Sharma');
    setRequests(userReqs.length > 0 ? userReqs : all);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  const totalCount = requests.length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <CustomerSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                Welcome, {customer?.name || 'Rahul Sharma'} 👋
              </h1>
              <p className="text-sm text-slate-500 mt-1">Manage your product warranties easily</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                RS
              </div>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Requests */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">Total Requests</span>
              <div className="text-3xl font-black my-2">{totalCount}</div>
              <Link
                href="/customer/warranties"
                className="text-xs text-blue-100 hover:text-white flex items-center gap-1 font-medium group"
              >
                <span>View all requests</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Approved */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Approved</span>
              <div className="text-3xl font-black my-2">{approvedCount}</div>
              <Link
                href="/customer/warranties"
                className="text-xs text-emerald-100 hover:text-white flex items-center gap-1 font-medium group"
              >
                <span>View details</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Pending */}
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg shadow-amber-500/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">Pending</span>
              <div className="text-3xl font-black my-2">{pendingCount}</div>
              <span className="text-xs text-amber-100 flex items-center gap-1 font-medium">
                Under review by admin
              </span>
            </div>

            {/* Rejected */}
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-5 text-white shadow-lg shadow-rose-500/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-100">Rejected</span>
              <div className="text-3xl font-black my-2">{rejectedCount}</div>
              <span className="text-xs text-rose-100 flex items-center gap-1 font-medium">
                Review rejection notes
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Request e-Warranty</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Scan product QR code or enter product details to request warranty
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <Link
                    href="/customer/request"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
                  >
                    <span>Request Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-indigo-500/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">My Warranties</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      View and download all your approved e-warranties and certificates
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <Link
                    href="/customer/warranties"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    <span>View My Warranties</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Requests Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Recent Requests</h3>
              <Link href="/customer/warranties" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                See all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    <th className="py-3 px-6">Product</th>
                    <th className="py-3 px-6">Request ID</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900">{req.productName}</td>
                      <td className="py-3.5 px-6 font-mono text-slate-600">{req.requestId}</td>
                      <td className="py-3.5 px-6 text-slate-500">{req.purchaseDate || req.submissionDate}</td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            req.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {req.status === 'Approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {req.status === 'Pending' && <Clock className="w-3 h-3 text-amber-600" />}
                          {req.status === 'Rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        {req.status === 'Approved' ? (
                          <Link
                            href="/customer/warranties"
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            View Certificate
                          </Link>
                        ) : (
                          <button
                            onClick={() => setSelectedReqForModal(req)}
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline"
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Details Modal for Pending/Rejected */}
      {selectedReqForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Warranty Request Details</h3>
            <p className="text-xs font-mono text-slate-500 mb-4">{selectedReqForModal.requestId}</p>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl mb-4">
              <div>
                <span className="text-slate-400">Product:</span>{' '}
                <span className="font-bold">{selectedReqForModal.productName}</span>
              </div>
              <div>
                <span className="text-slate-400">Model:</span>{' '}
                <span>{selectedReqForModal.productModel}</span>
              </div>
              <div>
                <span className="text-slate-400">Serial No:</span>{' '}
                <span className="font-mono">{selectedReqForModal.serialNumber}</span>
              </div>
              <div>
                <span className="text-slate-400">Purchase Date:</span>{' '}
                <span>{selectedReqForModal.purchaseDate}</span>
              </div>
              <div>
                <span className="text-slate-400">Store Name:</span>{' '}
                <span>{selectedReqForModal.storeName}</span>
              </div>
              <div>
                <span className="text-slate-400">Status:</span>{' '}
                <span className="font-bold">{selectedReqForModal.status}</span>
              </div>
              {selectedReqForModal.rejectionReason && (
                <div className="text-rose-600 mt-2 font-medium">
                  Reason: {selectedReqForModal.rejectionReason}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedReqForModal(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
