'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, Upload, AlertCircle, Sparkles, Flashlight } from 'lucide-react';
import { parseProductQR, ProductQRPayload } from '@/lib/qrUtils';
import { DEMO_PRODUCTS } from '@/lib/initialData';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: Partial<ProductQRPayload>) => void;
}

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }: QRScannerModalProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleDecoded(decodedText);
        },
        () => {
          // ignore scan frame errors
        }
      );
    } catch (err: any) {
      console.warn('Camera could not start:', err);
      setErrorMsg(
        'Camera access unavailable or blocked. You can upload a QR image or click a quick demo product below!'
      );
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

  const handleDecoded = (decodedText: string) => {
    stopCamera();
    const parsed = parseProductQR(decodedText);
    if (parsed && (parsed.productName || parsed.serialNumber)) {
      onScanSuccess(parsed);
      onClose();
    } else {
      setErrorMsg('Could not detect product information in this QR code.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErrorMsg(null);
      const scanner = new Html5Qrcode('file-scanner-temp');
      const result = await scanner.scanFile(file, true);
      handleDecoded(result);
    } catch (err) {
      setErrorMsg('No QR code found in uploaded image. Please try another image.');
    }
  };

  const handleDemoSelect = (item: (typeof DEMO_PRODUCTS)[0]) => {
    stopCamera();
    onScanSuccess({
      productName: item.name,
      productModel: item.model,
      serialNumber: item.serialNumber,
      purchaseDate: new Date().toISOString().split('T')[0],
      storeName: item.storeName,
      price: item.price,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Scan Product QR Code</h3>
            <p className="text-xs text-slate-500">Align QR code within the frame to auto-fill details</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 pt-3 gap-6">
          <button
            onClick={() => setActiveTab('camera')}
            className={`pb-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'camera'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            Live Camera
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload QR Image
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {activeTab === 'camera' && (
            <div>
              <div className="relative bg-slate-950 rounded-xl overflow-hidden min-h-[260px] flex items-center justify-center border border-slate-800">
                <div id="qr-reader-viewport" className="w-full h-full min-h-[260px]"></div>

                {/* Torch indicator */}
                <button
                  onClick={() => setTorchOn(!torchOn)}
                  className="absolute bottom-3 right-3 p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-full shadow-lg transition-colors text-xs flex items-center gap-1.5"
                >
                  <Flashlight className={`w-4 h-4 ${torchOn ? 'text-amber-400' : 'text-slate-400'}`} />
                </button>
              </div>
              <p className="text-center text-xs text-slate-400 mt-2">
                Position your phone camera or product warranty label inside the box
              </p>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Click to upload QR image</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP, or SVG screenshot</p>
            </div>
          )}

          <div id="file-scanner-temp" className="hidden"></div>

          {/* Quick Demo QR Fillers */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Instant 1-Click Simulation (Wireframe Products)
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Don't have a physical barcode handy? Click any product from the wireframe to simulate a scan:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_PRODUCTS.map((prod) => (
                <button
                  key={prod.name}
                  onClick={() => handleDemoSelect(prod)}
                  className="p-2.5 text-left border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">{prod.name}</p>
                  <p className="text-[11px] text-slate-500">{prod.model} • ₹{prod.price.toLocaleString('en-IN')}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
