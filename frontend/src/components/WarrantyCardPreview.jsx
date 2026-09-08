import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, CheckCircle2, ShieldCheck, ExternalLink, Calendar, Store, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WarrantyCardPreview({ card, showActions = true }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (card && card.certificateNo) {
      const verifyUrl = `${window.location.origin}/verify/${card.certificateNo}`;
      QRCode.toDataURL(verifyUrl, {
        width: 280,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      }).then(setQrCodeUrl).catch(console.error);
    }
  }, [card]);

  if (!card) return null;

  const handleDownloadPdf = async () => {
    if (!cardRef.current) return;
    try {
      setIsGeneratingPdf(true);
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(cardRef.current, {
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
      pdf.save(`Official-Warranty-${card.certificateNo}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
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
      {/* Top Action Toolbar */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Official Certificate Number</span>
            <p className="text-sm font-black text-slate-900 font-mono">{card.certificateNo}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/verify/${card.certificateNo}`}
              target="_blank"
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Public Verification
            </Link>

            <button
              onClick={handlePrint}
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>
      )}

      {/* The Certificate Frame */}
      <div
        id="printable-warranty-card"
        ref={cardRef}
        className="bg-white border-8 border-double border-orange-500 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden text-slate-800"
      >
        {/* Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <ShieldCheck className="w-[500px] h-[500px] text-orange-950" />
        </div>

        {/* Certificate Header */}
        <div className="text-center pb-6 border-b-2 border-orange-100 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-black tracking-widest uppercase mb-2">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            Official Digital Warranty Certificate
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 uppercase">
            ORANGE <span className="text-orange-500">SOLAR</span>
          </h2>
          <p className="text-xs font-semibold text-slate-600 mt-0.5">
            Sun Zone Solar System India Pvt. Ltd. • Bangalore, Karnataka
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Certificate Number: <span className="font-mono font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">{card.certificateNo}</span>
          </p>
        </div>

        {/* Details Grid & Product Photo */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 items-center">
          {/* Left Column: Product Photo & QR Code */}
          <div className="md:col-span-4 flex flex-col items-center justify-center space-y-4">
            {/* Product Photo Thumbnail */}
            <div className="w-full max-w-[200px] h-32 rounded-2xl overflow-hidden bg-slate-100 border-2 border-orange-200 shadow-xs relative">
              {card.product?.imageUrl ? (
                <img
                  src={card.product.imageUrl}
                  alt={card.productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 text-orange-500">
                  <ShieldCheck className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold text-slate-700">Orange Solar Unit</span>
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-orange-100 text-center w-full max-w-[200px]">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Verification QR Code"
                  className="w-28 h-28 mx-auto rounded-lg border border-slate-300 shadow-2xs"
                />
              ) : (
                <div className="w-28 h-28 mx-auto bg-slate-200 animate-pulse rounded-lg"></div>
              )}
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mt-1.5">
                Scan with Camera to Verify
              </span>
            </div>
          </div>

          {/* Right Column: Key Details */}
          <div className="md:col-span-8 space-y-3">
            <div className="flex border-b border-slate-100 pb-2">
              <span className="w-44 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer / Owner</span>
              <span className="text-sm font-bold text-slate-900">{card.user ? card.user.name : 'Registered Owner'}</span>
            </div>

            <div className="flex border-b border-slate-100 pb-2">
              <span className="w-44 text-xs font-bold text-slate-400 uppercase tracking-wider">Product Name</span>
              <span className="text-sm font-black text-slate-900">{card.productName}</span>
            </div>

            <div className="flex border-b border-slate-100 pb-2">
              <span className="w-44 text-xs font-bold text-slate-400 uppercase tracking-wider">Serial Number</span>
              <span className="text-sm font-mono font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60">
                {card.serialNumber}
              </span>
            </div>

            <div className="flex border-b border-slate-100 pb-2">
              <span className="w-44 text-xs font-bold text-slate-400 uppercase tracking-wider">Authorized Dealer</span>
              <span className="text-sm font-medium text-slate-800">{card.storeName || 'Orange Solar Authorized Dealer'}</span>
            </div>

            <div className="flex border-b border-slate-100 pb-2">
              <span className="w-44 text-xs font-bold text-slate-400 uppercase tracking-wider">Warranty Term</span>
              <span className="text-sm font-bold text-emerald-700">{card.warrantyPeriod}</span>
            </div>

            <div className="flex border-b border-slate-100 pb-2">
              <span className="w-44 text-xs font-bold text-slate-400 uppercase tracking-wider">Effective From</span>
              <span className="text-sm font-medium text-slate-800">{card.validFrom}</span>
            </div>

            <div className="flex border-b border-slate-100 pb-2">
              <span className="w-44 text-xs font-bold text-slate-400 uppercase tracking-wider">Warranty Valid Till</span>
              <span className="text-sm font-black text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full inline-block">
                {card.validTill}
              </span>
            </div>

            {/* Official Seal Badge */}
            <div className="pt-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-amber-900 rounded-xl text-xs font-black shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-orange-600" />
                <span>ORANGE SOLAR OFFICIALLY CERTIFIED & DIGITALLY SEALED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="pt-6 border-t-2 border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="font-medium italic text-slate-600">
            Manufactured by Sun Zone Solar System India Pvt. Ltd. • Sy No. 56/1, Byadarahalli, Magadi Main Road, Bangalore
          </p>
          <p className="text-[11px] font-semibold text-orange-600">
            Helpline: +91 97400 97000 • orangesolar.co.in
          </p>
        </div>
      </div>
    </div>
  );
}
