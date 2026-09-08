'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';
import { getRequests, updateRequestStatus, getCertificates } from '@/lib/storage';
import { WarrantyRequest } from '@/lib/types';
import { triggerNotification } from '@/components/NotificationToast';
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  MessageCircle,
  ExternalLink,
  Users,
  Search,
  Check,
  X,
  Eye,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [requests, setRequests] = useState<WarrantyRequest[]>([]);
  const [activeModalReq, setActiveModalReq] = useState<WarrantyRequest | null>(null);
  const [acceptedSuccessData, setAcceptedSuccessData] = useState<{
    request: WarrantyRequest;
    certNo?: string;
  } | null>(null);

  // Send channel toggles
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsapp, setSendWhatsapp] = useState(true);

  // Rejection reason prompt state
  const [rejectPromptReq, setRejectPromptReq] = useState<WarrantyRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Invoice proof is blurred or does not match store details.');

  const loadData = () => {
    const all = getRequests();
    setRequests(all);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  const pendingRequests = requests.filter((r) => r.status === 'Pending');
  const approvedRequests = requests.filter((r) => r.status === 'Approved');

  const handleOpenReview = (req: WarrantyRequest) => {
    setActiveModalReq(req);
  };

  const handleAcceptRequest = () => {
    if (!activeModalReq) return;

    const result = updateRequestStatus(activeModalReq.requestId, 'Approved', {
      sendEmail,
      sendWhatsapp,
    });

    if (result.request) {
      // Trigger live notifications
      if (sendEmail) {
        triggerNotification({
          type: 'email',
          recipient: result.request.customerEmail,
          title: 'E-Warranty Certificate Issued',
          message: `Your warranty for ${result.request.productName} has been APPROVED! Certificate: ${result.certificate?.certificateNo}`,
        });
      }

      if (sendWhatsapp) {
        triggerNotification({
          type: 'whatsapp',
          recipient: result.request.customerPhone,
          title: 'E-Warranty Ready',
          message: `Congratulations ${result.request.customerName}! Your official e-warranty certificate is now ready for download.`,
        });
      }

      setAcceptedSuccessData({
        request: result.request,
        certNo: result.certificate?.certificateNo,
      });
      setActiveModalReq(null);
    }
  };

  const handleRejectRequest = () => {
    if (!rejectPromptReq) return;

    const result = updateRequestStatus(rejectPromptReq.requestId, 'Rejected', {
      reason: rejectionReason,
    });

    if (result.request) {
      triggerNotification({
        type: 'email',
        recipient: result.request.customerEmail,
        title: 'Warranty Request Status Update',
        message: `Your warranty request (${result.request.requestId}) was not approved. Reason: ${rejectionReason}`,
      });
      setRejectPromptReq(null);
      setActiveModalReq(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AdminSidebar />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Admin Dashboard</h1>
              <p className="text-xs text-slate-500 mt-1">
                Monitor incoming warranty claims, review invoices, and issue digital certificates.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 block">System Administrator</span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Active Session
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow">
                AD
              </div>
            </div>
          </div>

          {/* Metric Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Review</span>
                <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">{pendingRequests.length}</div>
              <p className="text-[11px] text-amber-600 mt-1 font-semibold">Requires admin evaluation</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Approved Warranties</span>
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">{approvedRequests.length}</div>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Certificates issued</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Requests</span>
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <ClipboardList className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">{requests.length}</div>
              <p className="text-[11px] text-slate-400 mt-1 font-semibold">Lifetime warranty queue</p>
            </div>
          </div>

          {/* Pending Requests Review Queue */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-black text-slate-900">Incoming Requests Queue</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {pendingRequests.length} Pending
                </span>
              </div>
              <Link
                href="/admin/requests"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View Full History</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-60" />
                <p className="text-sm font-bold text-slate-700">All pending requests have been reviewed!</p>
                <p className="text-xs text-slate-400 mt-1">New requests from customers will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="border border-slate-200 rounded-2xl p-5 hover:border-indigo-500 hover:shadow-md transition-all bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {req.requestId}
                        </span>
                        <span className="text-[11px] text-slate-400">{req.submissionDate}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{req.productName}</h3>
                      <p className="text-xs text-slate-500">{req.productModel} • Serial: {req.serialNumber}</p>

                      <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs space-y-1 text-slate-600">
                        <div>Customer: <span className="font-semibold text-slate-800">{req.customerName}</span></div>
                        <div>Phone: <span className="font-semibold text-slate-800">{req.customerPhone}</span></div>
                        <div>Store: <span className="font-semibold text-slate-800">{req.storeName}</span> (₹{req.price.toLocaleString('en-IN')})</div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenReview(req)}
                        className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review & Decide</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 5. ADMIN DASHBOARD (REQUEST POPUP MODAL) - MATCHING SCREEN 5 */}
      {activeModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-black text-slate-900">New Warranty Request</h3>
                <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Request ID: {activeModalReq.requestId}
                </span>
              </div>
              <button
                onClick={() => setActiveModalReq(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with details from Screen 5 */}
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Customer Name</span>
                  <span className="text-sm font-bold text-slate-900">{activeModalReq.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Phone Number</span>
                  <span className="text-sm font-semibold text-slate-800">{activeModalReq.customerPhone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block mb-0.5">Email</span>
                  <span className="text-sm font-semibold text-slate-800">{activeModalReq.customerEmail}</span>
                </div>

                <div className="col-span-2 pt-3 border-t border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Product</span>
                  <span className="text-sm font-bold text-slate-900">
                    {activeModalReq.productName} ({activeModalReq.productModel})
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Serial Number</span>
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    {activeModalReq.serialNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Purchase Date</span>
                  <span className="text-xs font-semibold text-slate-800">{activeModalReq.purchaseDate}</span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Purchase Price</span>
                  <span className="text-sm font-bold text-slate-900">
                    ₹{activeModalReq.price.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Store Name</span>
                  <span className="text-xs font-semibold text-slate-800">{activeModalReq.storeName}</span>
                </div>
              </div>

              {/* Notification channel selections */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-2">Send e-Warranty certificate via:</p>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-700">Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendWhatsapp}
                      onChange={(e) => setSendWhatsapp(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-700">WhatsApp</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Actions matching Screen 5: [Reject] [View More Details] [Accept] */}
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setRejectPromptReq(activeModalReq)}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Reject
              </button>

              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/customers?search=${activeModalReq.customerPhone}`}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  View More Details
                </Link>

                <button
                  onClick={handleAcceptRequest}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. ADMIN - ACCEPTED CONFIRMATION POPUP (MATCHING SCREEN 6) */}
      {acceptedSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">Request Accepted!</h3>
            <p className="text-xs text-slate-500 mb-6">E-warranty has been generated and sent to customer.</p>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl mb-6">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Send via
              </span>
              <div className="flex items-center justify-center gap-3">
                {sendEmail && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </span>
                )}
                {sendWhatsapp && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </span>
                )}
              </div>
            </div>

            {/* Customer card from Screen 6 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-6 text-xs">
              <span className="text-slate-400 font-semibold block mb-1">Customer</span>
              <p className="font-bold text-slate-900 text-sm">{acceptedSuccessData.request.customerName}</p>
              <p className="text-slate-600 font-medium">{acceptedSuccessData.request.customerPhone}</p>
              <p className="text-slate-600 font-medium">{acceptedSuccessData.request.customerEmail}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setAcceptedSuccessData(null)}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Back to Dashboard
              </button>
              <Link
                href="/customer/warranties"
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
              >
                <span>View Certificate</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Prompt Modal */}
      {rejectPromptReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900 mb-2">Reject Warranty Request</h3>
            <p className="text-xs text-slate-500 mb-4">
              Specify reason for rejecting request <span className="font-mono font-bold text-rose-600">{rejectPromptReq.requestId}</span>:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full h-24 p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl mb-4 focus:outline-none focus:border-rose-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectPromptReq(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectRequest}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
