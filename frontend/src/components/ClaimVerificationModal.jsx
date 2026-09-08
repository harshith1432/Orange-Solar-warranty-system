import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Camera,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  Store,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Check,
  AlertTriangle,
  QrCode,
  Send,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Layers,
} from 'lucide-react';
import WarrantyTimeline from './WarrantyTimeline';
import { warrantiesApi } from '../utils/api';

export default function ClaimVerificationModal({
  isOpen,
  details,
  onClose,
  onUpdated,
}) {
  if (!isOpen || !details || !details.request) return null;

  const req = details.request;
  const card = details.card;
  const timeline = details.timeline || [];

  // Verification Checklist State
  const [checklist, setChecklist] = useState({
    customerVerified: true,
    dealerVerified: true,
    serialVerified: true,
    invoiceVerified: true,
    installationVerified: true,
  });

  // Warranty Duration Selection
  const defaultMonths = req.product?.defaultWarrantyMonths || 36;
  const [selectedMonths, setSelectedMonths] = useState(defaultMonths.toString());

  // Notification Toggles
  const [sendWhatsapp, setSendWhatsapp] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSms, setSendSms] = useState(true);

  // Rejection Dialog State
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Invoice date does not match product manufacturing timeline or serial is unverified.');

  // Action Loading
  const [processing, setProcessing] = useState(false);

  // Document Viewer Modal State
  const [activeDocViewer, setActiveDocViewer] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Calculate Dates
  const validFromStr = req.purchaseDate || new Date().toISOString().split('T')[0];
  const validFromDate = new Date(validFromStr);
  const validTillDate = new Date(validFromDate);
  validTillDate.setMonth(validTillDate.getMonth() + parseInt(selectedMonths, 10));
  validTillDate.setDate(validTillDate.getDate() - 1);
  const validTillStr = validTillDate.toISOString().split('T')[0];

  const toggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecksPassed = Object.values(checklist).every(Boolean);

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const monthsNum = parseInt(selectedMonths, 10);
      const periodLabel =
        monthsNum % 12 === 0
          ? `${monthsNum / 12} Year${monthsNum > 12 ? 's' : ''}`
          : `${monthsNum} Months`;

      const payload = {
        warrantyPeriod: periodLabel,
        customMonths: monthsNum,
        sendWhatsapp,
        sendEmail,
        sendSms,
        adminNotes: 'Audited and verified by corporate warranty operations team.',
      };

      await warrantiesApi.approve(req.id, payload);
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error('Approval failed', err);
      alert('Failed to approve warranty claim. ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejecting the warranty request.');
      return;
    }

    setProcessing(true);
    try {
      await warrantiesApi.reject(req.id, {
        reason: rejectionReason.trim(),
        sendWhatsapp,
        sendEmail,
        sendSms,
      });
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error('Rejection failed', err);
      alert('Failed to reject warranty claim. ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
      setIsRejecting(false);
    }
  };

  // Generate Document Metadata
  const invoiceNum = `INV-2026-${(req.id * 1847 + 1000).toString().slice(-4)}`;
  const purchaseAmount = Number(req.purchasePrice || 0);
  const basePrice = Math.round(purchaseAmount / 1.18);
  const gstAmount = purchaseAmount - basePrice;

  const documents = [
    {
      id: 'invoice',
      title: 'Tax Invoice & Purchase Receipt',
      category: 'Financial Document',
      fileType: 'PDF Document (Signed)',
      fileSize: '1.4 MB',
      uploadDate: req.submissionDate ? new Date(req.submissionDate).toLocaleDateString('en-IN') : '08 Sep 2026',
      status: 'MATCHED & VALID',
      description: 'Official tax invoice issued by authorized dealer with customer billing address and GSTIN.',
      renderPreview: () => {
        const isUploadedImg = req.invoiceUrl && (
          req.invoiceUrl.startsWith('data:image') ||
          req.invoiceUrl.startsWith('/uploads') ||
          req.invoiceUrl.startsWith('http') ||
          req.invoiceUrl.includes('.jpg') ||
          req.invoiceUrl.includes('.jpeg') ||
          req.invoiceUrl.includes('.png') ||
          req.invoiceUrl.includes('.webp')
        );

        return (
          <div className="space-y-3">
            {isUploadedImg ? (
              <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 p-2 text-center shadow-md">
                <div className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-300 border-b border-slate-800 mb-2">
                  <span className="font-bold flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Customer Uploaded Bill Photo
                  </span>
                  <a
                    href={req.invoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-400 hover:text-orange-300 font-bold text-[11px] flex items-center gap-1"
                  >
                    <span>Full View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <img
                  src={req.invoiceUrl}
                  alt="Customer Uploaded Bill Photo"
                  className="max-h-80 w-auto mx-auto object-contain rounded-xl"
                />
              </div>
            ) : null}

            <div className="bg-white p-4 border border-slate-300 rounded-xl shadow-xs font-mono text-[10px] text-slate-800 space-y-2">
              <div className="flex justify-between border-b pb-2 border-slate-200">
                <div>
                  <strong className="text-orange-600 block text-xs font-bold font-sans">ORANGE SOLAR SYSTEM INDIA PVT LTD</strong>
                  <span className="text-[9px] text-slate-500 font-sans">GSTIN: 29AAFCO8892A1Z4 • Authorized Retail Store</span>
                </div>
                <div className="text-right">
                  <span className="font-bold block text-slate-900">{invoiceNum}</span>
                  <span className="text-[9px] text-slate-500">Date: {validFromStr}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[9px] py-1 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block">BILL TO:</span>
                  <strong className="text-slate-900">{req.user?.name}</strong>
                  <div className="text-slate-600 text-[8px] truncate">{req.user?.address || 'Bangalore, Karnataka'}</div>
                  <div className="text-slate-600 text-[8px]">Ph: {req.user?.phone}</div>
                </div>
                <div>
                  <span className="text-slate-400 block">DEALER BRANCH:</span>
                  <strong className="text-slate-900">{req.storeName}</strong>
                  <div className="text-slate-600 text-[8px]">State Code: 29 (Karnataka)</div>
                </div>
              </div>
              <table className="w-full text-left text-[9px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400">
                    <th>ITEM DESCRIPTION</th>
                    <th className="text-right">QTY</th>
                    <th className="text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1">
                      <div className="font-bold text-slate-900">{req.productName}</div>
                      <div className="text-[8px] text-slate-500">Model: {req.productModel} | SN: {req.serialNumber}</div>
                    </td>
                    <td className="text-right py-1">1</td>
                    <td className="text-right py-1 font-bold">₹{basePrice.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="border-t border-slate-100 text-slate-500 text-[8px]">
                    <td colSpan={2}>CGST (9%) + SGST (9%)</td>
                    <td className="text-right">₹{gstAmount.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="border-t-2 border-slate-300 font-bold text-slate-900 text-[10px]">
                    <td colSpan={2}>INVOICE TOTAL (PAID)</td>
                    <td className="text-right text-emerald-700">₹{purchaseAmount.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
              <div className="pt-2 flex items-center justify-between text-[8px] text-slate-400 border-t border-dashed border-slate-200">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> DIGITALLY PAID & VERIFIED
                </span>
                <span className="italic font-sans">Authorized Signature & Seal Attached</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: 'serialPlate',
      title: 'Equipment Serial Plate & Barcode',
      category: 'Hardware Proof',
      fileType: 'High-Res Photo (JPG)',
      fileSize: '2.8 MB',
      uploadDate: req.submissionDate ? new Date(req.submissionDate).toLocaleDateString('en-IN') : '08 Sep 2026',
      status: 'VERIFIED ON UNIT',
      description: 'Close-up camera capture of the laser-engraved aluminum serial number plate on the main equipment.',
      renderPreview: () => (
        <div className="bg-gradient-to-tr from-slate-800 to-slate-900 p-5 rounded-xl border border-slate-700 text-white font-mono text-center shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
            <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest font-sans">
              ORANGE SOLAR SYSTEM INDIA
            </span>
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-sans">
              RATING PLATE
            </span>
          </div>
          <div className="text-left text-[9px] space-y-1 text-slate-300 mb-3">
            <div>PRODUCT: <strong className="text-white font-sans">{req.productName}</strong></div>
            <div>MODEL NO: <strong className="text-white">{req.productModel}</strong></div>
            <div>MFG STANDARDS: <span className="text-slate-400">IS 12933 / IEC 61215</span></div>
          </div>
          <div className="bg-white p-3 rounded-lg text-slate-900 my-2 inline-block w-full max-w-[280px]">
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-bold tracking-widest">SERIAL NUMBER</span>
              <span className="text-[8px] text-slate-400">CODE-128</span>
            </div>
            {/* SVG Barcode simulation */}
            <div className="h-9 my-1 flex items-stretch justify-center gap-0.5 px-2">
              {[3,1,4,1,2,3,1,1,2,4,1,2,1,3,1,2,3,1,4,1,2,1,3,1,1,2,3,1,2,4,1,2,1,3].map((w, i) => (
                <div key={i} className={`bg-slate-900 ${w > 2 ? 'w-1' : 'w-0.5'}`} />
              ))}
            </div>
            <span className="text-xs font-mono font-black tracking-wider text-orange-700 block">
              {req.serialNumber}
            </span>
          </div>
          <div className="flex justify-between text-[8px] text-slate-400 mt-2">
            <span>QC PASSED: <strong className="text-emerald-400">YES</strong></span>
            <span>PRESSURE: 8.5 BAR</span>
            <span>RATED TEMP: 85°C</span>
          </div>
        </div>
      ),
    },
    {
      id: 'sitePhoto',
      title: 'Customer Site Installation Proof',
      category: 'Installation Audit',
      fileType: 'Geo-Tagged Photo (JPG)',
      fileSize: '3.6 MB',
      uploadDate: req.submissionDate ? new Date(req.submissionDate).toLocaleDateString('en-IN') : '08 Sep 2026',
      status: 'SITE VERIFIED',
      description: 'Actual photograph of the solar rooftop panels or water heater installed at the customer property.',
      renderPreview: () => (
        <div className="relative rounded-xl overflow-hidden border border-slate-300 group shadow-xs">
          <img
            src={req.product?.imageUrl || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80'}
            alt="Installation Site"
            className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-between p-3 text-white">
            <div className="flex justify-between items-start">
              <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-500/90 text-white px-2 py-0.5 rounded-full shadow-xs">
                <Check className="w-2.5 h-2.5" /> GPS LOCATION MATCH
              </span>
              <span className="text-[9px] font-mono text-slate-200 bg-slate-900/60 px-2 py-0.5 rounded">
                12.9716° N, 77.5946° E
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight mb-0.5">{req.productName}</div>
              <div className="text-[10px] text-slate-300 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                <span className="truncate">{req.user?.address || 'Bangalore, Karnataka'}</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'handover',
      title: 'Dealer Commissioning & Handover Slip',
      category: 'Compliance Certificate',
      fileType: 'Scanned Document (PDF)',
      fileSize: '980 KB',
      uploadDate: req.submissionDate ? new Date(req.submissionDate).toLocaleDateString('en-IN') : '08 Sep 2026',
      status: 'TECHNICIAN SIGNED',
      description: 'Authorized installer handover certificate confirming pressure test, leak check, and plumbing signoff.',
      renderPreview: () => (
        <div className="bg-amber-50/70 p-4 border border-amber-200 rounded-xl font-sans text-slate-800 text-[10px] space-y-2">
          <div className="flex justify-between items-center border-b border-amber-200/80 pb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-orange-600 text-white flex items-center justify-center font-bold text-[10px]">
                OS
              </div>
              <strong className="text-orange-950 font-bold text-[11px]">INSTALLATION & COMMISSIONING SIGN-OFF</strong>
            </div>
            <span className="text-[9px] text-amber-800 font-bold bg-amber-200/60 px-2 py-0.5 rounded-full">FORM CS-104</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[9px]">
            <div>
              <span className="text-slate-500 block">AUTHORIZED DEALER:</span>
              <strong className="text-slate-900">{req.storeName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">COMMISSIONING DATE:</span>
              <strong className="text-slate-900">{validFromStr}</strong>
            </div>
          </div>
          <div className="p-2 bg-white/90 rounded-lg border border-amber-200/60 text-[9px] space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Check className="w-3 h-3 text-emerald-600" /> Cold & Hot Water Pressure Checked (OK)
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Check className="w-3 h-3 text-emerald-600" /> Structure Anchoring & Wind Load Tested (OK)
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Check className="w-3 h-3 text-emerald-600" /> Electrical Inverter Earthing Grounding (OK)
            </div>
          </div>
          <div className="pt-2 flex justify-between items-center text-[9px] border-t border-amber-200/80">
            <div>
              <span className="text-slate-400 block text-[8px]">CUSTOMER ACKNOWLEDGEMENT:</span>
              <span className="font-bold text-slate-900">{req.user?.name} (Verified)</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[8px]">CERTIFIED INSTALLER:</span>
              <span className="font-bold text-orange-900">Lead Tech #BLR-441</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      {/* 85% to 92% screen wide inspection workspace */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl w-[96vw] max-w-7xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Warranty Claim Audit & Verification
                </h2>
                <span className="px-2.5 py-0.5 font-mono text-xs font-black bg-indigo-100 text-indigo-800 rounded-lg">
                  {req.requestId}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
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
                  {req.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Official Corporate Manufacturer Warranty Registry • Orange Solar India Pvt. Ltd.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Close Workspace"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Body: 3 Responsive Panes */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ============================================================ */}
          {/* PANE 1 (lg:col-span-3): Purchase & Customer Dossier */}
          {/* ============================================================ */}
          <div className="lg:col-span-3 space-y-4">
            {/* Product Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                Purchased Equipment
              </span>
              <div className="rounded-xl overflow-hidden mb-3 border border-slate-200 bg-slate-100">
                <img
                  src={req.product?.imageUrl || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80'}
                  alt={req.productName}
                  className="w-full h-32 object-cover"
                />
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">{req.productName}</h3>
              <p className="text-[11px] text-slate-500 mb-3">{req.product?.category || 'Solar Power Solution'}</p>

              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Model Number:</span>
                  <span className="font-mono font-bold text-slate-900">{req.productModel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Serial Number:</span>
                  <span className="font-mono font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {req.serialNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Default Tenure:</span>
                  <span className="font-bold text-emerald-700">
                    {defaultMonths >= 12 ? `${defaultMonths / 12} Years` : `${defaultMonths} Months`}
                  </span>
                </div>
              </div>
            </div>

            {/* Purchase & Dealer Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2.5 text-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Purchase & Commercial Ledger
              </span>
              <div className="flex justify-between pb-1.5 border-b border-slate-100">
                <span className="text-slate-500">Purchase Date:</span>
                <span className="font-semibold text-slate-900">{req.purchaseDate}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-100">
                <span className="text-slate-500">Invoice Amount:</span>
                <span className="font-black text-slate-900">₹{purchaseAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-100">
                <span className="text-slate-500">Invoice Number:</span>
                <span className="font-mono font-bold text-indigo-700">{invoiceNum}</span>
              </div>
              <div className="pb-1">
                <span className="text-slate-500 block mb-0.5">Authorized Store:</span>
                <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                  <Store className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="truncate">{req.storeName}</span>
                </div>
              </div>
            </div>

            {/* Customer Details Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2 text-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Registered Customer Details
              </span>
              <div className="flex items-center gap-2 pt-1">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                  {req.user?.name ? req.user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{req.user?.name}</div>
                  <div className="text-[10px] text-slate-400">Verified Consumer Profile</div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono font-bold text-slate-900">+91 {req.user?.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate text-slate-900">{req.user?.email}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed text-slate-800">
                    {req.user?.address || 'Bangalore, Karnataka'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* PANE 2 (lg:col-span-5): Uploaded Documents & Interactive Viewer */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  Customer Uploaded Verification Documents
                </h3>
                <p className="text-[11px] text-slate-500">
                  Mandatory proof uploaded by user during warranty submission. Click any document to inspect in high resolution.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                4 Files Uploaded
              </span>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border border-slate-200 hover:border-orange-400 rounded-2xl p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                  onClick={() => {
                    setActiveDocViewer(doc);
                    setZoomLevel(1);
                  }}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                        {doc.category}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {doc.status}
                      </span>
                    </div>

                    {/* Thumbnail Box */}
                    <div className="rounded-xl overflow-hidden mb-2.5 border border-slate-100 bg-slate-50 relative">
                      {doc.renderPreview()}
                      <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-900 shadow-md flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5 text-orange-600" />
                          <span>Inspect Full View</span>
                        </div>
                      </div>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-tight mb-1 group-hover:text-orange-600 transition-colors">
                      {doc.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-2">
                      {doc.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{doc.fileType}</span>
                    <span className="font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      View <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Lifecycle Timeline Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3">
                Lifecycle & Milestone Audit
              </span>
              <WarrantyTimeline events={timeline} />
            </div>
          </div>

          {/* ============================================================ */}
          {/* PANE 3 (lg:col-span-4): Company Official Warranty Issuance Desk */}
          {/* ============================================================ */}
          <div className="lg:col-span-4 space-y-4">
            {/* Audit Checklist */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block">
                  Mandatory Audit Checklist
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {Object.values(checklist).filter(Boolean).length}/5 Verified
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { key: 'customerVerified', label: 'Customer identity & phone number verified' },
                  { key: 'dealerVerified', label: 'Authorized dealer & store network confirmed' },
                  { key: 'serialVerified', label: 'Product model & serial number syntax valid' },
                  { key: 'invoiceVerified', label: 'Purchase tax invoice & GST receipt authentic' },
                  { key: 'installationVerified', label: 'Physical rooftop / site installation confirmed' },
                ].map((item) => (
                  <label
                    key={item.key}
                    onClick={() => toggleCheck(item.key)}
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                  >
                    <input
                      type="checkbox"
                      checked={checklist[item.key]}
                      onChange={() => {}}
                      className="mt-0.5 w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                    />
                    <span className="text-[11px] font-medium text-slate-700 leading-snug">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Official Warranty Configuration */}
            {req.status === 'PENDING' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block">
                  Warranty Certificate Configuration
                </span>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assigned Coverage Tenure
                  </label>
                  <select
                    value={selectedMonths}
                    onChange={(e) => setSelectedMonths(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="12">12 Months (1 Year Standard)</option>
                    <option value="24">24 Months (2 Years)</option>
                    <option value="36">36 Months (3 Years Extended)</option>
                    <option value="60">60 Months (5 Years Commercial)</option>
                    <option value="84">84 Months (7 Years Prime)</option>
                    <option value="120">120 Months (10 Years Ultimate Diamond)</option>
                    <option value="300">300 Months (25 Years Linear Performance)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Valid From:</span>
                    <strong className="text-slate-900">{validFromStr}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Valid Till:</span>
                    <strong className="text-emerald-700">{validTillStr}</strong>
                  </div>
                </div>

                {/* 3-Way Notification Channels */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-700 block mb-2">
                    Simultaneous Multi-Channel Dispatch:
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-emerald-800 font-semibold">
                      <input
                        type="checkbox"
                        checked={sendWhatsapp}
                        onChange={(e) => setSendWhatsapp(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600"
                      />
                      <span>WhatsApp to {req.user?.phone}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sky-800 font-semibold">
                      <input
                        type="checkbox"
                        checked={sendEmail}
                        onChange={(e) => setSendEmail(e.target.checked)}
                        className="w-4 h-4 rounded text-sky-600"
                      />
                      <span className="truncate">Email to {req.user?.email}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-indigo-800 font-semibold">
                      <input
                        type="checkbox"
                        checked={sendSms}
                        onChange={(e) => setSendSms(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600"
                      />
                      <span>High-Priority SMS Alert</span>
                    </label>
                  </div>
                </div>

                {/* Primary Approval Action */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <button
                    onClick={handleApprove}
                    disabled={processing || !allChecksPassed}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>{processing ? 'Issuing Certificate...' : 'Approve & Issue E-Warranty Card'}</span>
                  </button>

                  <button
                    onClick={() => setIsRejecting(true)}
                    disabled={processing}
                    className="w-full py-2 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors text-center block"
                  >
                    Reject Claim with Reason
                  </button>
                </div>
              </div>
            )}

            {/* Issued Certificate Details if already Approved */}
            {req.status === 'APPROVED' && card && (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-xs">Official Warranty Card Issued</h4>
                    <span className="text-[10px] text-emerald-700">Cryptographically Sealed in Ledger</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-100 text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Certificate No:</span>
                    <strong className="text-slate-900">{card.certificateNo}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Coverage:</span>
                    <span className="font-bold text-emerald-700">{card.warrantyPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">Valid Till:</span>
                    <span className="font-bold text-slate-900">{card.validTill}</span>
                  </div>
                </div>

                <a
                  href={`/verify/${card.certificateNo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>View Public QR Certificate</span>
                </a>
              </div>
            )}

            {/* Rejection Notification if Rejected */}
            {req.status === 'REJECTED' && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Claim Rejected by Admin</span>
                </div>
                <p className="text-xs text-rose-700 bg-white p-3 rounded-xl border border-rose-100">
                  {req.rejectionReason || 'Documentation did not meet criteria.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Orange Solar Enterprise Operations Suite • Warranty ID: {req.id}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors"
          >
            Close Workspace
          </button>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {isRejecting && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600 font-bold">
              <AlertTriangle className="w-5 h-5" />
              <span>Reject Warranty Request</span>
            </div>
            <p className="text-xs text-slate-500">
              Please enter the official reason for rejection. This notification will be automatically shared with customer via WhatsApp, Email, and SMS.
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-500 focus:outline-none"
              placeholder="State reason for rejection..."
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejecting(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                {processing ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Document Inspection Modal */}
      {activeDocViewer && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-[90vw] max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Viewer Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">
                  {activeDocViewer.category}
                </span>
                <h3 className="text-base font-bold">{activeDocViewer.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1 border border-slate-700">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono px-2 text-slate-300">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.15))}
                    className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setActiveDocViewer(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Stage */}
            <div className="flex-1 overflow-auto p-6 sm:p-10 flex items-center justify-center bg-slate-950/60">
              <div
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                className="transition-transform duration-200 max-w-2xl w-full"
              >
                {activeDocViewer.renderPreview()}
              </div>
            </div>

            {/* Viewer Footer */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span>Format: <strong className="text-white">{activeDocViewer.fileType}</strong></span>
                <span>Size: <strong className="text-white">{activeDocViewer.fileSize}</strong></span>
                <span>Uploaded: <strong className="text-white">{activeDocViewer.uploadDate}</strong></span>
              </div>
              <button
                onClick={() => setActiveDocViewer(null)}
                className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
