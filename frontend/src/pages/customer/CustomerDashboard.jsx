import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import CustomerSidebar from '../../components/CustomerSidebar';
import CustomerBottomNav from '../../components/CustomerBottomNav';
import { getCustomerAuth, isAdmin } from '../../utils/auth';
import { warrantiesApi } from '../../utils/api';
import {
  QrCode,
  FileCheck,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Eye,
} from 'lucide-react';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const session = getCustomerAuth();
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin() || session?.user?.role?.toUpperCase() === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    if (!session || !session.user) {
      navigate('/login', { replace: true });
      return;
    }

    const userId = session.user.id;

    Promise.all([
      warrantiesApi.getStats(userId),
      warrantiesApi.getUserRequests(userId),
    ])
      .then(([statsRes, reqsRes]) => {
        if (statsRes.data) setStats(statsRes.data);
        if (reqsRes.data) setRequests(reqsRes.data);
      })
      .catch((err) => console.error('Error fetching dashboard data', err))
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans items-center justify-center p-6 text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xs">
          <ShieldCheck className="w-12 h-12 text-orange-500 mx-auto mb-3" />
          <h2 className="text-lg font-black text-slate-900 mb-1">Sign In Required</h2>
          <p className="text-xs text-slate-500 mb-6">Please sign in to access your customer dashboard.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      <Navbar />

      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        <CustomerSidebar />

        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                Welcome, {session.user.name || 'Customer'} 👋
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage your product warranties and trace live milestone timelines</p>
            </div>
            <Link
              to="/customer/profile"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-orange-500/20 hover:scale-105 transition-all cursor-pointer shrink-0"
              title="View Customer Profile"
            >
              {session.user.name ? session.user.name.split(' ').map((n) => n[0]).join('') : 'C'}
            </Link>
          </div>

          {/* 4 Metric Cards - Responsive Grid (2 cols on mobile, 4 on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-slate-900/10">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-300">Total Requests</span>
              <div className="text-2xl sm:text-3xl font-black my-1.5 sm:my-2">{stats.total}</div>
              <Link to="/customer/warranties" className="text-[11px] sm:text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 font-medium">
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">Approved</span>
              <div className="text-3xl font-black my-2">{stats.approved}</div>
              <Link to="/customer/warranties" className="text-xs text-emerald-100 hover:text-white flex items-center gap-1 font-medium">
                <span>View details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-5 text-white shadow-lg shadow-brand-500/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-100">Pending</span>
              <div className="text-3xl font-black my-2">{stats.pending}</div>
              <span className="text-xs text-amber-100 font-medium">Under admin review</span>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-5 text-white shadow-lg shadow-rose-500/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-100">Rejected</span>
              <div className="text-3xl font-black my-2">{stats.rejected}</div>
              <span className="text-xs text-rose-100 font-medium">Check rejection feedback</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-brand-500 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-brand-600 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Choose Solar Product</h3>
                    <p className="text-[11px] text-slate-500 mt-1">Browse official Orange Solar products and apply warranty</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to="/customer/products"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-brand-700 rounded-xl text-xs font-bold transition-all"
                  >
                    <span>Browse Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-brand-500 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-brand-600 flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Request e-Warranty</h3>
                    <p className="text-[11px] text-slate-500 mt-1">Scan product QR code or enter product serial details</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to="/customer/apply"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                  >
                    <span>Request Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-indigo-500 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">My Warranties</h3>
                    <p className="text-[11px] text-slate-500 mt-1">View official certificates, timeline milestones, and PDF download</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to="/customer/warranties"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
                  >
                    <span>View My Warranties</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Requests Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Recent Requests</h3>
              <Link to="/customer/warranties" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                View all
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
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No warranty requests submitted yet.
                      </td>
                    </tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-6 font-bold text-slate-900">
                          {req.productName}
                          <span className="block text-[11px] text-slate-400 font-normal">{req.productModel}</span>
                        </td>
                        <td className="py-3.5 px-6 font-mono text-slate-600">{req.requestId}</td>
                        <td className="py-3.5 px-6 text-slate-500">{req.purchaseDate}</td>
                        <td className="py-3.5 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              req.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : req.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {req.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {req.status === 'PENDING' && <Clock className="w-3 h-3 text-amber-600" />}
                            {req.status === 'REJECTED' && <XCircle className="w-3 h-3 text-rose-600" />}
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <Link
                            to={`/customer/warranties?selected=${req.id}`}
                            className="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Timeline / Card</span>
                          </Link>
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

      <CustomerBottomNav />
    </div>
  );
}
