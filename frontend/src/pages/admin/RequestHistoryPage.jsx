import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import WarrantyTimeline from '../../components/WarrantyTimeline';
import ClaimVerificationModal from '../../components/ClaimVerificationModal';
import { warrantiesApi } from '../../utils/api';
import { Search, CheckCircle2, Clock, XCircle, Eye, X, ClipboardList, Filter } from 'lucide-react';

export default function RequestHistoryPage() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = () => {
    warrantiesApi.getStats()
      .then((res) => {
        if (res.data) setStats(res.data);
      })
      .catch((err) => console.error('Error fetching request stats', err));
  };

  const loadRequests = () => {
    const statusParam = filter === 'All' ? null : filter.toUpperCase();
    warrantiesApi.getAll(statusParam)
      .then((res) => {
        if (res.data) setRequests(res.data);
      })
      .catch((err) => console.error('Error fetching requests', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const handleInspect = (reqId) => {
    warrantiesApi.getDetails(reqId).then((res) => {
      setSelectedDetails(res.data);
    }).catch(console.error);
  };

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    return !search ||
      r.requestId.toLowerCase().includes(q) ||
      (r.user && r.user.name.toLowerCase().includes(q)) ||
      r.productName.toLowerCase().includes(q) ||
      r.serialNumber.toLowerCase().includes(q);
  });

  return (
    <div className="h-screen flex flex-col bg-slate-100 font-sans overflow-hidden">
      <Navbar />

      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">All Warranty Requests</h1>
              <p className="text-xs text-slate-500 mt-1">Complete historical audit log of customer warranty claims across all statuses</p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Showing {filtered.length} of {requests.length} entries
            </span>
          </div>

          {/* Interactive KPI Cards Row - Click to filter */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* All Requests Card */}
            <div
              onClick={() => setFilter('All')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                filter === 'All'
                  ? 'bg-white border-orange-500 shadow-md ring-2 ring-orange-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Total Submissions
                </span>
                <div className={`p-2 rounded-xl transition-colors ${
                  filter === 'All' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-500 group-hover:bg-orange-50 group-hover:text-orange-600'
                }`}>
                  <ClipboardList className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.total}</div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">All historical claims</span>
                {filter === 'All' && (
                  <span className="font-bold text-orange-600 flex items-center gap-1">Active ●</span>
                )}
              </div>
            </div>

            {/* Pending Requests Card */}
            <div
              onClick={() => setFilter('Pending')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                filter === 'Pending'
                  ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                  Pending Review
                </span>
                <div className={`p-2 rounded-xl transition-colors ${
                  filter === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-600'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.pending}</div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-amber-600 font-medium">Requires evaluation</span>
                {filter === 'Pending' && (
                  <span className="font-bold text-amber-600 flex items-center gap-1">Active ●</span>
                )}
              </div>
            </div>

            {/* Approved Requests Card */}
            <div
              onClick={() => setFilter('Approved')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                filter === 'Approved'
                  ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  Approved & Issued
                </span>
                <div className={`p-2 rounded-xl transition-colors ${
                  filter === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.approved}</div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-emerald-600 font-medium">Certificates granted</span>
                {filter === 'Approved' && (
                  <span className="font-bold text-emerald-600 flex items-center gap-1">Active ●</span>
                )}
              </div>
            </div>

            {/* Rejected Requests Card */}
            <div
              onClick={() => setFilter('Rejected')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                filter === 'Rejected'
                  ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                  Rejected Claims
                </span>
                <div className={`p-2 rounded-xl transition-colors ${
                  filter === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500 group-hover:bg-rose-50 group-hover:text-rose-600'
                }`}>
                  <XCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.rejected}</div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-rose-600 font-medium">Declined submissions</span>
                {filter === 'Rejected' && (
                  <span className="font-bold text-rose-600 flex items-center gap-1">Active ●</span>
                )}
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
              {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filter === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Request ID, Customer, Product..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Table Container - Matching Screen 8 */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
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
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No warranty records match filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-indigo-700">{req.requestId}</td>
                        <td className="py-4 px-6 font-semibold text-slate-900">{req.user?.name}</td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-slate-800">{req.productName}</span>
                          <span className="block text-[11px] text-slate-400 font-mono">{req.serialNumber}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-500">{req.purchaseDate}</td>
                        <td className="py-4 px-6">
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
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleInspect(req.id)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 inline-flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Inspect</span>
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

      {/* Comprehensive Corporate Verification & Audit Workspace (75-92% screen) */}
      <ClaimVerificationModal
        isOpen={Boolean(selectedDetails)}
        details={selectedDetails}
        onClose={() => setSelectedDetails(null)}
        onUpdated={() => {
          loadRequests();
          loadStats();
          setSelectedDetails(null);
        }}
      />
    </div>
  );
}
