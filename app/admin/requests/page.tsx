'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';
import { getRequests } from '@/lib/storage';
import { WarrantyRequest } from '@/lib/types';
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Filter,
  FileSpreadsheet,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminRequestHistoryPage() {
  const [requests, setRequests] = useState<WarrantyRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [selectedReq, setSelectedReq] = useState<WarrantyRequest | null>(null);

  const loadData = () => {
    setRequests(getRequests());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      req.requestId.toLowerCase().includes(q) ||
      req.customerName.toLowerCase().includes(q) ||
      req.productName.toLowerCase().includes(q) ||
      req.serialNumber.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AdminSidebar />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">All Warranty Requests</h1>
              <p className="text-xs text-slate-500 mt-1">
                Audit and inspect complete warranty lifecycle logs across all customers.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Showing {filteredRequests.length} of {requests.length} entries
              </span>
            </div>
          </div>

          {/* Controls Bar: Filter Tabs & Search */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    statusFilter === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Request ID, Customer, Product..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Table Container matching Screen 8 */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3.5 px-6">Request ID</th>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Product</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No warranty requests match the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-indigo-700">{req.requestId}</td>
                        <td className="py-4 px-6 font-semibold text-slate-900">{req.customerName}</td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-slate-800">{req.productName}</span>
                          <span className="block text-[11px] text-slate-400">{req.productModel}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-500">{req.purchaseDate || req.submissionDate}</td>
                        <td className="py-4 px-6">
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
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setSelectedReq(req)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-slate-400" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Detail Inspector Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-700">{selectedReq.requestId}</span>
                <h3 className="text-lg font-black text-slate-900">{selectedReq.productName}</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedReq.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedReq.status === 'Pending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {selectedReq.status}
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl mb-5">
              <div className="grid grid-cols-2 gap-2">
                <div>Customer: <span className="font-bold text-slate-900">{selectedReq.customerName}</span></div>
                <div>Phone: <span className="font-semibold">{selectedReq.customerPhone}</span></div>
                <div>Email: <span className="font-semibold">{selectedReq.customerEmail}</span></div>
                <div>Store: <span className="font-semibold">{selectedReq.storeName}</span></div>
                <div>Model: <span className="font-semibold">{selectedReq.productModel}</span></div>
                <div>Price: <span className="font-semibold">₹{selectedReq.price.toLocaleString('en-IN')}</span></div>
                <div className="col-span-2">
                  Serial Number: <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{selectedReq.serialNumber}</span>
                </div>
                {selectedReq.certificateNo && (
                  <div className="col-span-2 pt-2 border-t border-slate-200/60">
                    Certificate No: <span className="font-mono font-bold text-emerald-700">{selectedReq.certificateNo}</span>
                  </div>
                )}
                {selectedReq.rejectionReason && (
                  <div className="col-span-2 text-rose-700 font-medium">
                    Rejection Reason: {selectedReq.rejectionReason}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                href={`/admin/customers?search=${selectedReq.customerPhone}`}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Inspect Customer Profile 360 →
              </Link>
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
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
