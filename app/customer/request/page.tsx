'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CustomerSidebar from '@/components/CustomerSidebar';
import QRScannerModal from '@/components/QRScannerModal';
import { addWarrantyRequest } from '@/lib/storage';
import { triggerNotification } from '@/components/NotificationToast';
import { DEMO_PRODUCTS } from '@/lib/initialData';
import {
  QrCode,
  Edit3,
  Camera,
  Upload,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

export default function RequestWarrantyPage() {
  const router = useRouter();

  // Mode: "scan" or "manual"
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Form fields
  const [productName, setProductName] = useState('Smartphone XYZ');
  const [productModel, setProductModel] = useState('XYZ-2024');
  const [serialNumber, setSerialNumber] = useState('SN123456789');
  const [purchaseDate, setPurchaseDate] = useState('20 May 2024');
  const [storeName, setStoreName] = useState('Tech Store');
  const [price, setPrice] = useState('35999');
  const [invoiceFile, setInvoiceFile] = useState<string | null>('invoice_sample.pdf');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scannedFeedback, setScannedFeedback] = useState(false);

  const handleScanSuccess = (data: any) => {
    if (data.productName) setProductName(data.productName);
    if (data.productModel) setProductModel(data.productModel);
    if (data.serialNumber) setSerialNumber(data.serialNumber);
    if (data.purchaseDate) setPurchaseDate(data.purchaseDate);
    if (data.storeName) setStoreName(data.storeName);
    if (data.price) setPrice(data.price.toString());

    setScannedFeedback(true);
    setTimeout(() => setScannedFeedback(false), 4000);
  };

  const handleDemoFill = (item: (typeof DEMO_PRODUCTS)[0]) => {
    setProductName(item.name);
    setProductModel(item.model);
    setSerialNumber(item.serialNumber);
    setPurchaseDate('20 May 2024');
    setStoreName(item.storeName);
    setPrice(item.price.toString());

    setScannedFeedback(true);
    setTimeout(() => setScannedFeedback(false), 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !serialNumber) {
      alert('Please fill in product name and serial number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReq = addWarrantyRequest({
        productName,
        productModel,
        serialNumber,
        purchaseDate,
        storeName,
        price: Number(price) || 0,
      });

      // Dispatch simulated acknowledgement notifications
      triggerNotification({
        type: 'email',
        recipient: 'rahul@gmail.com',
        title: 'Warranty Request Received',
        message: `Your warranty request (${newReq.requestId}) for ${productName} has been submitted for admin review.`,
      });

      triggerNotification({
        type: 'whatsapp',
        recipient: '+91 9876543210',
        title: 'E-Warranty Notification',
        message: `Hi Rahul, request ${newReq.requestId} has been created. You will receive an alert once approved!`,
      });

      // Navigate to Screen 4 (Request Submitted)
      router.push(`/customer/request/success?id=${newReq.requestId}&product=${encodeURIComponent(productName)}`);
    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <CustomerSidebar />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900">Request E-Warranty</h1>
            <p className="text-xs text-slate-500 mt-1">
              Submit product registration details to generate your official digital warranty certificate.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-4 border-b border-slate-200 pb-3 mb-6">
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                activeTab === 'scan'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-4 h-4" />
              Scan QR Code
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                activeTab === 'manual'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Enter Details Manually
            </button>
          </div>

          {scannedFeedback && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-in fade-in">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Product QR successfully decoded! The fields have been auto-filled below.</span>
            </div>
          )}

          {/* Form Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: QR Scan Viewfinder Box (Matching Wireframe Screen 3) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Scan the product QR code</h3>
                    <p className="text-[11px] text-slate-400">Align the QR code within the frame to scan</p>
                  </div>
                  <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <QrCode className="w-5 h-5" />
                  </span>
                </div>

                {/* Simulated Camera Viewfinder Frame */}
                <div
                  onClick={() => setIsScannerOpen(true)}
                  className="relative group cursor-pointer bg-slate-950 rounded-2xl overflow-hidden aspect-square flex flex-col items-center justify-center p-6 border-4 border-slate-800 hover:border-blue-500 transition-all shadow-inner"
                >
                  {/* Viewfinder Target Reticle */}
                  <div className="relative w-48 h-48 border-2 border-dashed border-blue-400/80 rounded-2xl flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 group-hover:scale-105 transition-transform">
                    <div className="w-32 h-32 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                      <Camera className="w-10 h-10 text-white/80 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <p className="text-xs font-bold text-white mt-4 flex items-center gap-1.5">
                    <span>Click to Launch Live Camera</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Webcam or Mobile Back Camera</p>
                </div>

                {/* Or Upload Image option */}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsScannerOpen(true)}
                    className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload QR Image
                  </button>
                </div>
              </div>

              {/* Wireframe Demo Autofill Quick Picker */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Quick Fill from Wireframe Catalog
                </div>
                <div className="space-y-1.5">
                  {DEMO_PRODUCTS.slice(0, 3).map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleDemoFill(item)}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-blue-400 hover:bg-blue-50/50 flex items-center justify-between text-xs transition-all"
                    >
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="text-[11px] text-blue-600 font-bold">₹{item.price.toLocaleString('en-IN')}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Product Details Form (Matching Wireframe Screen 3) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">Product Details (Auto-filled)</h3>
                <span className="text-[11px] font-semibold text-slate-400">Step 1 of 2</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Smartphone XYZ"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Product Model
                    </label>
                    <input
                      type="text"
                      required
                      value={productModel}
                      onChange={(e) => setProductModel(e.target.value)}
                      placeholder="e.g. XYZ-2024"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      required
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      placeholder="e.g. SN123456789"
                      className="w-full px-4 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Purchase Date
                    </label>
                    <input
                      type="text"
                      required
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      placeholder="e.g. 20 May 2024"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Store Name
                    </label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. Tech Store"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="35999"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>{isSubmitting ? 'Submitting Request...' : 'Submit Request'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}
