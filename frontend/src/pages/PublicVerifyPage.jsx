import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { warrantiesApi } from '../utils/api';
import { CheckCircle2, XCircle, ShieldCheck, Calendar, ArrowRight, Sun, ExternalLink } from 'lucide-react';

export default function PublicVerifyPage() {
  const { certificateNo } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (certificateNo) {
      warrantiesApi.verify(certificateNo)
        .then((res) => {
          if (res.data) setCard(res.data);
        })
        .catch(() => setCard(null))
        .finally(() => setLoading(false));
    }
  }, [certificateNo]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        {loading ? (
          <div className="bg-white p-10 rounded-3xl border border-orange-200 shadow-sm text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-slate-700">Verifying Orange Solar Warranty Authenticity...</p>
            <p className="text-xs text-slate-400 mt-1">Querying central warranty registry</p>
          </div>
        ) : card ? (
          <div className="bg-white border-2 border-orange-500 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-5 border-b border-orange-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Sun className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-900">
                    ORANGE <span className="text-orange-600">SOLAR</span>
                  </h1>
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Official E-Warranty
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-orange-50 text-orange-800 border border-orange-200 px-3 py-1 rounded-lg">
                {card.certificateNo}
              </span>
            </div>

            {/* Product Photo Thumbnail Preview */}
            {card.product?.imageUrl && (
              <div className="mb-5 p-2 bg-orange-50/60 border border-orange-100 rounded-2xl flex items-center gap-4">
                <img
                  src={card.product.imageUrl}
                  alt={card.productName}
                  className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-2xs"
                />
                <div>
                  <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider block">
                    Verified Product Unit
                  </span>
                  <h3 className="text-xs font-extrabold text-slate-900 leading-snug">{card.productName}</h3>
                  <span className="text-[11px] font-mono text-slate-500">SN: {card.serialNumber}</span>
                </div>
              </div>
            )}

            {/* Core Verification Details */}
            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-200/60">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Registered Owner</span>
                <span className="font-bold text-slate-900">{card.user?.name || 'Authorized Customer'}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Equipment Name</span>
                <span className="font-extrabold text-slate-900">{card.productName}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Serial Number</span>
                <span className="font-mono font-bold text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded border border-orange-200">
                  {card.serialNumber}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Authorized Dealer</span>
                <span className="font-medium text-slate-800">{card.storeName || 'Orange Solar Authorized Dealer'}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Warranty Coverage</span>
                <span className="font-bold text-emerald-700">{card.warrantyPeriod}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-medium">Effective Date</span>
                <span className="font-medium text-slate-800">{card.validFrom}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Coverage Valid Till</span>
                <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {card.validTill}
                </span>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-500 mb-6 space-y-1">
              <p className="font-medium text-slate-700">
                Sun Zone Solar System India Pvt. Ltd. • ISO 9001:2015 Certified
              </p>
              <p>Helpline: +91 97400 97000 • Bangalore, Karnataka</p>
            </div>

            <Link
              to="/"
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold text-center block shadow-xs transition-all"
            >
              Return to Orange Solar Portal
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Certificate Not Found</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6 font-normal">
              The certificate ID <span className="font-mono font-bold text-slate-800">{certificateNo}</span> could not be verified in our records.
            </p>
            <Link
              to="/"
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold inline-block shadow-xs"
            >
              Return Home
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

