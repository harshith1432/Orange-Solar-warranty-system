'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';
import CertificateCard from '@/components/CertificateCard';
import { getCertificates } from '@/lib/storage';
import { WarrantyCertificate } from '@/lib/types';
import { ShieldCheck, Eye, ExternalLink, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AdminWarrantiesPage() {
  const [certificates, setCertificates] = useState<WarrantyCertificate[]>([]);
  const [previewCert, setPreviewCert] = useState<WarrantyCertificate | null>(null);

  useEffect(() => {
    setCertificates(getCertificates());
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AdminSidebar />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Issued E-Warranties</h1>
              <p className="text-xs text-slate-500 mt-1">
                Central ledger of all cryptographically sealed and active warranty certificates.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              Total Active: {certificates.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {certificates.map((cert) => (
              <div
                key={cert.certificateNo}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {cert.certificateNo}
                    </span>
                    <span className="text-[11px] text-slate-400">{cert.issuedAt}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{cert.productName}</h3>
                  <p className="text-xs text-slate-500">Customer: <span className="font-semibold text-slate-800">{cert.customerName}</span></p>
                  <p className="text-xs text-slate-500 font-mono">SN: {cert.serialNumber}</p>
                  <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Valid till: <strong>{cert.validTill}</strong></span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setPreviewCert(cert)}
                    className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Preview</span>
                  </button>
                  <Link
                    href={`/verify/${cert.certificateNo}`}
                    target="_blank"
                    className="py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Verify</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {previewCert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
              <div className="max-w-4xl w-full my-8">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setPreviewCert(null)}
                    className="px-4 py-2 bg-white text-slate-800 rounded-xl text-xs font-bold shadow hover:bg-slate-100"
                  >
                    Close Preview
                  </button>
                </div>
                <CertificateCard certificate={previewCert} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
