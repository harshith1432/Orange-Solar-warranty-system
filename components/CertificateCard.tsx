'use client';

import React, { useEffect, useState, useRef } from 'react';
import { WarrantyCertificate } from '@/lib/types';
import { generateQRDataUrl } from '@/lib/qrUtils';
import { Download, Printer, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface CertificateCardProps {
  certificate: WarrantyCertificate;
  showActions?: boolean;
}

export default function CertificateCard({ certificate, showActions = true }: CertificateCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate verification QR
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const verificationUrl = `${origin}/verify/${certificate.certificateNo}`;
    generateQRDataUrl(verificationUrl).then((url) => setQrCodeUrl(url));
  }, [certificate.certificateNo]);

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 20);
      pdf.save(`E-Warranty-${certificate.certificateNo}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      // Fallback to print dialog
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      {showActions && (
        <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certificate ID</span>
            <p className="text-sm font-bold text-slate-900">{certificate.certificateNo}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/verify/${certificate.certificateNo}`}
              target="_blank"
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Verify Link
            </Link>

            <button
              onClick={handlePrint}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>
      )}

      {/* The Printable Certificate Container */}
      <div
        id="printable-certificate"
        ref={certRef}
        className="bg-white border-8 border-double border-blue-900/40 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden text-slate-800"
      >
        {/* Subtle Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <ShieldCheck className="w-[500px] h-[500px] text-blue-950" />
        </div>

        {/* Certificate Header */}
        <div className="text-center pb-6 border-b-2 border-slate-100 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold tracking-widest uppercase mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Official Digital Warranty
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
            E-Warranty Certificate
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Certificate Number: <span className="font-mono font-bold text-slate-800">{certificate.certificateNo}</span>
          </p>
        </div>

        {/* Certificate Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 items-center">
          {/* Left / Center: Details Table */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex border-b border-slate-100 pb-2">
              <span className="w-40 text-xs font-semibold text-slate-500">Customer Name</span>
              <span className="text-sm font-bold text-slate-900">{certificate.customerName}</span>
            </div>

            <div className="flex border-b border-slate-100 pb-2">
              <span className="w-40 text-xs font-semibold text-slate-500">Product</span>
              <span className="text-sm font-bold text-slate-900">{certificate.productName}</span>
            </div>

            <div className="flex border-b border-slate-100 pb-2">
              <span className="w-40 text-xs font-semibold text-slate-500">Serial Number</span>
              <span className="text-sm font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {certificate.serialNumber}
              </span>
            </div>

            <div className="flex border-b border-slate-100 pb-2">
              <span className="w-40 text-xs font-semibold text-slate-500">Purchase Date</span>
              <span className="text-sm font-medium text-slate-800">{certificate.purchaseDate}</span>
            </div>

            <div className="flex border-b border-slate-100 pb-2">
              <span className="w-40 text-xs font-semibold text-slate-500">Store / Retailer</span>
              <span className="text-sm font-medium text-slate-800">{certificate.storeName}</span>
            </div>

            <div className="flex border-b border-slate-100 pb-2">
              <span className="w-40 text-xs font-semibold text-slate-500">Warranty Period</span>
              <span className="text-sm font-bold text-emerald-700">{certificate.warrantyPeriod}</span>
            </div>

            <div className="flex border-b border-slate-100 pb-2">
              <span className="w-40 text-xs font-semibold text-slate-500">Valid Till</span>
              <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                {certificate.validTill}
              </span>
            </div>
          </div>

          {/* Right: Official Verification Stamp & QR Code */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="Verification QR Code"
                className="w-32 h-32 rounded-lg border border-slate-300 shadow-sm"
              />
            ) : (
              <div className="w-32 h-32 bg-slate-200 animate-pulse rounded-lg"></div>
            )}
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-2">
              Scan to Verify Online
            </span>

            {/* Official Stamp badge */}
            <div className="mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-full text-xs font-black">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              AUTHENTICATED
            </div>
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="pt-6 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="font-medium italic">Thank you for choosing our product!</p>
          <p className="text-[11px]">Authorized by E-Warranty System • Digitally Signed & Sealed</p>
        </div>
      </div>
    </div>
  );
}
