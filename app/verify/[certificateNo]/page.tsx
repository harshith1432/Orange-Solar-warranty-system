'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { getCertificates } from '@/lib/storage';
import { WarrantyCertificate } from '@/lib/types';
import { CheckCircle2, ShieldCheck, XCircle, Calendar, Store, Tag } from 'lucide-react';
import Link from 'next/link';

export default function VerifyCertificatePage() {
  const params = useParams();
  const certNo = typeof params.certificateNo === 'string' ? params.certificateNo : '';

  const [certificate, setCertificate] = useState<WarrantyCertificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const certs = getCertificates();
    const found = certs.find(
      (c) => c.certificateNo.toLowerCase() === certNo.toLowerCase()
    );
    setCertificate(found || null);
    setLoading(false);
  }, [certNo]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        {loading ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-slate-600">Verifying Warranty Authenticity...</p>
          </div>
        ) : certificate ? (
          <div className="bg-white border-2 border-emerald-500 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-base font-black text-slate-900">Valid E-Warranty</h1>
                  <span className="text-xs text-emerald-600 font-bold">Official Manufacturer Record</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                {certificate.certificateNo}
              </span>
            </div>

            {/* Core Verification Details */}
            <div className="space-y-3.5 text-xs text-slate-700 bg-slate-50 p-5 rounded-2xl mb-6">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Registered Owner</span>
                <span className="font-bold text-slate-900">{certificate.customerName}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Product Name</span>
                <span className="font-bold text-slate-900">{certificate.productName}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Serial Number</span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {certificate.serialNumber}
                </span>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Purchase Date</span>
                <span className="font-medium text-slate-800">{certificate.purchaseDate}</span>
              </div>

              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Warranty Coverage</span>
                <span className="font-bold text-emerald-700">{certificate.warrantyPeriod}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Valid Through</span>
                <span className="font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {certificate.validTill}
                </span>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 mb-6">
              This certificate was electronically generated and authenticated on {certificate.issuedAt}.
            </div>

            <Link
              href="/customer/warranties"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold text-center block transition-colors"
            >
              View Full Certificate Document
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-slate-900 mb-1">Certificate Not Found</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              The warranty certificate number <span className="font-mono font-bold text-slate-800">{certNo}</span> could not be verified in the registry.
            </p>
            <Link
              href="/"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold inline-block"
            >
              Return Home
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
