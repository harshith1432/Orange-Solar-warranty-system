import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Clock,
  XCircle,
  Award,
  FileText,
  ExternalLink,
  MessageCircle,
  Smartphone,
  CheckCircle2,
  X,
  ZoomIn,
  ZoomOut,
  Download,
  Eye,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

export default function CustomerDetailsModal({ isOpen, customerData, onClose }) {
  if (!isOpen || !customerData) return null;

  const { customer, requests = [], cards = [], timeline = [], notifications = [], area } = customerData;
  const [activeTab, setActiveTab] = useState('warranties'); // 'warranties' | 'documents' | 'timeline' | 'notifications'
  const [inspectDoc, setInspectDoc] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  const totalSpent = requests.reduce((sum, r) => sum + (Number(r.purchasePrice) || 0), 0);
  const activeWarranties = cards.filter((c) => {
    if (!c.validTill) return true;
    return new Date(c.validTill) >= new Date();
  }).length;
  const pendingRequests = requests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-50 rounded-3xl w-[95vw] max-w-[1350px] h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden font-sans">
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/25">
              {customer.name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">{customer.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  {customer.role || 'CUSTOMER'}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: #{customer.id}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-orange-400" />
                  <a href={`tel:${customer.phone}`} className="hover:underline text-slate-200 font-semibold">{customer.phone}</a>
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-slate-200">{customer.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-slate-300">{area || 'Bangalore'}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Customer Metrics Overview Bar */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 sm:py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 shrink-0 shadow-xs">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Registered Systems</span>
            <span className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 block">{requests.length} Solar Products</span>
            <span className="text-[11px] text-slate-500 font-medium">{customer.totalPurchases || requests.length} Lifetime Units</span>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Active Warranties</span>
            <span className="text-lg sm:text-xl font-black text-emerald-700 mt-0.5 block">{activeWarranties} Covered</span>
            <span className="text-[11px] text-emerald-600 font-medium">Certified E-Warranty Cards</span>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">Pending Reviews</span>
            <span className="text-lg sm:text-xl font-black text-amber-700 mt-0.5 block">{pendingRequests} Awaiting Action</span>
            <span className="text-[11px] text-amber-600 font-medium">Incoming verification claims</span>
          </div>

          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">Lifetime Investment</span>
            <span className="text-lg sm:text-xl font-black text-indigo-900 mt-0.5 block truncate">
              ₹{totalSpent.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-indigo-600 font-medium truncate block">Member since {customer.memberSince || '2024'}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'warranties', label: `Warranty Ledger (${requests.length})`, icon: ShieldCheck },
            { id: 'documents', label: 'Uploaded Documents', icon: FileText },
            { id: 'timeline', label: `Audit Milestones (${timeline.length})`, icon: Clock },
            { id: 'notifications', label: `3-Way Dispatches (${notifications.length})`, icon: MessageCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6">
          {/* TAB 1: WARRANTY LEDGER & PRODUCTS */}
          {activeTab === 'warranties' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Registered Equipment & Warranty Ledger</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official records of solar water heaters, panels, and equipment registered by {customer.name}.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {requests.length} Records Found
                </span>
              </div>

              {requests.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                  <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-700">No warranty claims registered yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Claims submitted by the customer will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {requests.map((req) => {
                    const card = cards.find((c) => c.request?.id === req.id || c.serialNumber === req.serialNumber);
                    return (
                      <div
                        key={req.id}
                        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-orange-400 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-mono text-xs font-black bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                              {req.requestId}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                                req.status === 'APPROVED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : req.status === 'PENDING'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {req.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                              {req.status === 'PENDING' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                              {req.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                              <span>{req.status}</span>
                            </span>

                            {card && (
                              <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 font-mono text-xs font-bold flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-orange-500" />
                                {card.certificateNo}
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-black text-slate-900">{req.productName}</h4>
                          <p className="text-xs text-slate-500 font-medium">
                            Model: <span className="text-slate-800 font-semibold">{req.productModel}</span> • Serial Number: <span className="font-mono font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">{req.serialNumber}</span>
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-slate-100 text-slate-600">
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Purchase Date</span>
                              <span className="font-semibold text-slate-800">{req.purchaseDate}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Purchase Amount</span>
                              <span className="font-semibold text-slate-800">₹{Number(req.purchasePrice || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Dealer / Retailer</span>
                              <span className="font-semibold text-slate-800 truncate block">{req.storeName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-bold">Coverage Period</span>
                              <span className="font-semibold text-emerald-600">
                                {card ? `${card.validFrom} to ${card.validTill}` : 'Pending Admin Verification'}
                              </span>
                            </div>
                          </div>

                          {req.status === 'REJECTED' && req.rejectionReason && (
                            <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                              <span className="font-bold">Rejection Note: </span>
                              {req.rejectionReason}
                            </div>
                          )}
                        </div>

                        {card && (
                          <div className="shrink-0 flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto">
                            <a
                              href={`/verify/${card.certificateNo}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>View Certificate</span>
                            </a>
                            <span className="text-[10px] text-slate-400 text-right">
                              Verified Official Certificate
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: UPLOADED DOCUMENTS AUDIT */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Customer Proof Documentation</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tax invoices, warranty slips, serial plate photos, and site photos submitted for verification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'Tax Invoice & GST Bill',
                    tag: 'Financial Proof',
                    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
                    meta: 'Verified Retail Receipt',
                  },
                  {
                    title: 'Serial Number Plate & Barcode',
                    tag: 'Equipment Serial',
                    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
                    meta: 'Physical Tag Match',
                  },
                  {
                    title: 'Site Installation Photo',
                    tag: 'Site Verification',
                    img: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80',
                    meta: 'Rooftop Setup Complete',
                  },
                  {
                    title: 'Dealer Commissioning Signoff',
                    tag: 'Handover Slip',
                    img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
                    meta: 'Authorized Dealer Stamp',
                  },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-orange-500 transition-all flex flex-col"
                  >
                    <div className="relative h-44 bg-slate-100 overflow-hidden group">
                      <img
                        src={doc.img}
                        alt={doc.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 text-white font-mono text-[10px] font-bold backdrop-blur-xs">
                        {doc.tag}
                      </span>
                      <button
                        onClick={() => {
                          setInspectDoc(doc);
                          setZoomLevel(100);
                        }}
                        className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Inspect & Zoom</span>
                      </button>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{doc.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{doc.meta}</p>
                      </div>
                      <button
                        onClick={() => {
                          setInspectDoc(doc);
                          setZoomLevel(100);
                        }}
                        className="mt-3 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View High-Res</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT MILESTONES & TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Warranty Audit & Milestone Lifecycle</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete immutable audit trail of customer submission, technical document check, and certificate issuance.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                {timeline.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No milestone events recorded yet.
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {timeline.map((event, idx) => (
                      <div key={idx} className="relative flex items-start gap-4">
                        <div
                          className={`w-5 h-5 rounded-full -ml-[19px] flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${
                            event.status === 'COMPLETED'
                              ? 'bg-emerald-500 ring-4 ring-emerald-50'
                              : event.status === 'IN_PROGRESS'
                              ? 'bg-amber-500 ring-4 ring-amber-50 animate-pulse'
                              : 'bg-slate-300 ring-4 ring-slate-100'
                          }`}
                        >
                          {event.status === 'COMPLETED' ? '✓' : idx + 1}
                        </div>
                        <div className="flex-1 bg-slate-50 border border-slate-200/60 rounded-2xl p-4">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="text-xs font-bold text-slate-900">{event.eventTitle}</h4>
                            <span className="text-[10px] font-mono text-slate-400">
                              {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'Pending'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium">{event.eventDescription}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: 3-WAY NOTIFICATIONS AUDIT */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900">3-Way Customer Communications Ledger</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified multi-channel notification dispatches sent to {customer.name} via WhatsApp, Email, and SMS.
                </p>
              </div>

              {notifications.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-400 text-xs">
                  No automated dispatches logged yet for this customer.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {notifications.map((notif, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                            notif.channel === 'WHATSAPP'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : notif.channel === 'EMAIL'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {notif.channel === 'WHATSAPP' && <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />}
                          {notif.channel === 'EMAIL' && <Mail className="w-3.5 h-3.5 text-sky-600" />}
                          {notif.channel === 'SMS' && <Smartphone className="w-3.5 h-3.5 text-indigo-600" />}
                          <span>{notif.channel} Dispatched</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {notif.sentAt ? new Date(notif.sentAt).toLocaleString() : 'Recent'}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-mono text-slate-700 whitespace-pre-line">
                        {notif.content}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>Recipient: {notif.recipientPhone || notif.recipientEmail}</span>
                        <span className="font-bold text-emerald-600 uppercase">
                          Status: {notif.deliveryStatus || 'DELIVERED'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white px-6 sm:px-8 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Customer Profile & Historical Ledger • {customer.address || 'Address on file'}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Close Profile
          </button>
        </div>
      </div>

      {/* High-Resolution Document Inspection Modal */}
      {inspectDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in">
          <div className="bg-slate-900 text-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-700 shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white">{inspectDoc.title}</h4>
                <p className="text-xs text-slate-400">{inspectDoc.meta}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(70, z - 20))}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-300 w-12 text-center">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(200, z + 20))}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setInspectDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-slate-950/60">
              <img
                src={inspectDoc.img}
                alt={inspectDoc.title}
                style={{ transform: `scale(${zoomLevel / 100})`, transition: 'transform 0.2s ease-out' }}
                className="max-h-[65vh] object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
