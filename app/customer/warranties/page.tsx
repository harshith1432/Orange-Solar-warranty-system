'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import CustomerSidebar from '@/components/CustomerSidebar';
import CertificateCard from '@/components/CertificateCard';
import { getCertificates, getCustomer } from '@/lib/storage';
import { WarrantyCertificate, User } from '@/lib/types';
import { Mail, MessageCircle, FileCheck, CheckCircle2 } from 'lucide-react';

export default function CustomerWarrantiesPage() {
  const [customer, setCustomer] = useState<User | null>(null);
  const [certificates, setCertificates] = useState<WarrantyCertificate[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const loadData = () => {
    setCustomer(getCustomer());
    setCertificates(getCertificates());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage-update', loadData);
    return () => window.removeEventListener('storage-update', loadData);
  }, []);

  const activeCert = certificates[selectedIndex] || certificates[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <CustomerSidebar />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* Header Banner matching Screen 7 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  E-Warranty Approved
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Your E-Warranty is Ready!
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Dear <span className="font-semibold text-slate-800">{customer?.name || 'Rahul Sharma'}</span>,
                  your e-warranty for{' '}
                  <span className="font-semibold text-slate-800">{activeCert?.productName || 'Product'}</span> has been approved.
                  Please find your e-warranty below:
                </p>
              </div>

              {/* Delivery channel confirmation tags */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-xs font-semibold">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sent via Email</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sent via WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Certificate switcher if multiple approved */}
            {certificates.length > 1 && (
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-slate-500 shrink-0">Your Warranties:</span>
                {certificates.map((cert, idx) => (
                  <button
                    key={cert.certificateNo}
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                      selectedIndex === idx
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cert.productName} ({cert.certificateNo})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Render Certificate */}
          {activeCert ? (
            <CertificateCard certificate={activeCert} />
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
              <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Approved Warranties Yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Submit a new warranty request and once approved by admin, your official certificate will appear here.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
