import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import NotificationModal from '../../components/NotificationModal';
import ClaimVerificationModal from '../../components/ClaimVerificationModal';
import { getAdminAuth } from '../../utils/auth';
import { warrantiesApi } from '../../utils/api';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  X,
  MessageCircle,
  Mail,
  Smartphone,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import OrangeSolarLogo from '../../components/OrangeSolarLogo';
import SolarWatermark from '../../components/SolarWatermark';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = getAdminAuth();

  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Corporate Claim Verification Workspace Modal (75-92% Screen)
  const [selectedVerificationDetails, setSelectedVerificationDetails] = useState(null);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [latestNotifs, setLatestNotifs] = useState([]);

  const loadData = () => {
    Promise.all([
      warrantiesApi.getStats(),
      warrantiesApi.getAll('PENDING'),
    ])
      .then(([statsRes, reqsRes]) => {
        if (statsRes.data) setStats(statsRes.data);
        if (reqsRes.data) setPendingRequests(reqsRes.data);
      })
      .catch((err) => console.error('Error loading admin dashboard', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!session || !session.user) {
      navigate('/login', { replace: true });
      return;
    }
    if (session.user.role?.toUpperCase() !== 'ADMIN') {
      navigate('/customer/dashboard', { replace: true });
      return;
    }
    loadData();
  }, [session?.user?.id]);

  const handleOpenReview = (req) => {
    warrantiesApi.getDetails(req.id)
      .then((res) => {
        setSelectedVerificationDetails(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch warranty details', err);
      });
  };

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100 font-sans items-center justify-center p-6 text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xs">
          <ShieldAlert className="w-12 h-12 text-orange-500 mx-auto mb-3" />
          <h2 className="text-lg font-black text-slate-900 mb-1">Admin Access Required</h2>
          <p className="text-xs text-slate-500 mb-6">Please sign in with administrator credentials to access the Control Center.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 font-sans overflow-hidden">
      <Navbar />

      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8 relative">
          {/* Subtle Watermark */}
          <SolarWatermark variant="emblem" size={380} className="opacity-[0.02]" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 mb-8 shadow-xs relative z-10">
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <OrangeSolarLogo className="h-12 w-auto" showTagline={true} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  Sun Zone Solar System India Pvt. Ltd. • ISO 9001:2015
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Admin Operations Control Center</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify customer warranty claims, validate equipment serials, issue tamper-proof certificates, and audit 3-way dispatches.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 block">{session.user.name}</span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  System Online
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-orange-500/20">
                AD
              </div>
            </div>
          </div>

          <div className="relative z-10">

          {/* Metric Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Review</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{stats.pending}</div>
              <p className="text-[11px] text-amber-600 mt-1 font-semibold">Requires admin evaluation</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Approved Cards</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{stats.approved}</div>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Official certificates issued</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Rejected Claims</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{stats.rejected}</div>
              <p className="text-[11px] text-rose-600 mt-1 font-semibold">Declined documentation</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Database Records</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{stats.total}</div>
              <p className="text-[11px] text-slate-400 mt-1 font-semibold">Lifetime warranty requests</p>
            </div>
          </div>

          {/* Pending Requests Review Queue */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-black text-slate-900">Recent Incoming Queries & Claims</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Showing Recent {Math.min(pendingRequests.length, 6)} of {pendingRequests.length} Pending
                </span>
              </div>
              <Link to="/admin/requests" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 transition-colors">
                <span>View All Inbound Claims ({pendingRequests.length})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-60" />
                <p className="text-sm font-bold text-slate-700">All pending requests have been reviewed!</p>
                <p className="text-xs text-slate-400 mt-1">New requests submitted from the customer portal will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4">Request ID</th>
                      <th className="py-3.5 px-4">Customer Details</th>
                      <th className="py-3.5 px-4">Product & Serial No.</th>
                      <th className="py-3.5 px-4">Store & Amount</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {pendingRequests.slice(0, 6).map((req) => (
                      <tr
                        key={req.id}
                        className="hover:bg-orange-50/40 transition-colors group"
                      >
                        {/* Request ID */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg text-xs inline-block">
                            {req.requestId}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs shrink-0">
                              {req.user?.name ? req.user.name.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                                {req.user?.name || 'Customer'}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {req.user?.phone || 'No phone'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Product & Model & Serial Number */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-bold text-slate-900 truncate" title={req.productName}>
                            {req.productName}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                            <span className="font-medium text-slate-600">{req.productModel}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                              SN: {req.serialNumber}
                            </span>
                          </div>
                        </td>

                        {/* Store & Price */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-800 text-[11px] truncate max-w-[180px]" title={req.storeName}>
                            {req.storeName || 'Orange Solar Dealer'}
                          </div>
                          <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                            ₹{Number(req.purchasePrice || 0).toLocaleString('en-IN')}
                          </div>
                        </td>

                        {/* Submission Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-slate-800 font-medium">
                            {req.purchaseDate || (req.submissionDate ? new Date(req.submissionDate).toLocaleDateString('en-IN') : 'Recent')}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {req.submissionDate ? new Date(req.submissionDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Online Claim'}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Pending Review
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleOpenReview(req)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Verify & Review</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          </div>
        </main>
      </div>

      {/* Comprehensive Corporate Verification & Audit Workspace (75-92% screen) */}
      <ClaimVerificationModal
        isOpen={Boolean(selectedVerificationDetails)}
        details={selectedVerificationDetails}
        onClose={() => setSelectedVerificationDetails(null)}
        onUpdated={() => {
          loadData();
          setSelectedVerificationDetails(null);
        }}
      />

      {/* 3-Way Notification Transmission Feed Modal */}
      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        notifications={latestNotifs}
      />
    </div>
  );
}
