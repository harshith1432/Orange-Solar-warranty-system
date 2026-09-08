import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Upload, AlertCircle, Sparkles } from 'lucide-react';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess, demoProducts = [] }) {
  const [activeTab, setActiveTab] = useState('camera');
  const [errorMsg, setErrorMsg] = useState(null);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    try {
      setErrorMsg(null);
      const scanner = new Html5Qrcode('qr-reader-viewport');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          handleDecoded(decodedText);
        },
        () => {}
      );
    } catch (err) {
      console.warn('Camera could not start:', err);
      setErrorMsg('Camera access unavailable or blocked. You can upload a QR image or click a quick product below!');
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch (err) {
        console.error('Error stopping scanner', err);
      }
      scannerRef.current = null;
    }
  };

  const handleDecoded = (decodedText) => {
    stopCamera();
    try {
      const data = JSON.parse(decodedText);
      onScanSuccess(data);
      onClose();
    } catch {
      onScanSuccess({ serialNumber: decodedText });
      onClose();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErrorMsg(null);
      const scanner = new Html5Qrcode('file-scanner-temp');
      const result = await scanner.scanFile(file, true);
      handleDecoded(result);
    } catch (err) {
      setErrorMsg('No QR code detected in this file. Please try another image.');
    }
  };

  const handleDemoSelect = (item) => {
    stopCamera();
    onScanSuccess({
      productId: item.id,
      productName: item.name,
      productModel: item.model,
      serialNumber: `${item.serialPrefix || 'SN'}-${Math.floor(100000 + Math.random() * 900000)}`,
      storeName: item.storeName || 'Official Dealer',
      purchasePrice: item.price,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Scan Product QR Code</h3>
            <p className="text-xs text-slate-500">Align barcode or QR within frame to auto-fill product details</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-6 pt-3 gap-6">
          <button
            onClick={() => setActiveTab('camera')}
            className={`pb-2 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'camera'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            Live Camera
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload QR Image
          </button>
        </div>

        {/* Scanner View */}
        <div className="p-6 flex-1 overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="relative bg-slate-950 rounded-2xl overflow-hidden min-h-[250px] flex items-center justify-center border border-slate-800">
              <div id="qr-reader-viewport" className="w-full h-full min-h-[250px]"></div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div
              className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-brand-500 hover:bg-amber-50/50 transition-all cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="w-12 h-12 rounded-full bg-amber-100 text-brand-600 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">Click to upload QR barcode image</p>
              <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, or WEBP screenshot</p>
            </div>
          )}

          <div id="file-scanner-temp" className="hidden"></div>

          {/* Quick 1-Click Product Selection Simulation */}
          {demoProducts && demoProducts.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                Quick 1-Click Fill from Database Catalog
              </div>
              <div className="grid grid-cols-2 gap-2">
                {demoProducts.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleDemoSelect(p)}
                    className="p-2.5 text-left border border-slate-200 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all group"
                  >
                    <p className="text-xs font-bold text-slate-900 group-hover:text-sky-700">{p.name}</p>
                    <p className="text-[11px] text-slate-500">{p.model} • ₹{Number(p.price).toLocaleString('en-IN')}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
