import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import WarrantyCardPreview from '../../components/WarrantyCardPreview';
import { warrantiesApi } from '../../utils/api';
import { ShieldCheck, Eye, ExternalLink, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminWarrantiesPage() {
  const [cards, setCards] = useState([]);
  const [previewCard, setPreviewCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    warrantiesApi.getAllCards()
      .then((res) => {
        if (res.data) setCards(res.data);
      })
      .catch((err) => console.error('Error fetching cards', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-screen flex flex-col bg-slate-100 font-sans overflow-hidden">
      <Navbar />

      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Active Warranty Certificates</h1>
              <p className="text-xs text-slate-500 mt-1">
                Central registry of all cryptographically sealed warranty certificates.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              Total Active: {cards.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:border-indigo-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {c.certificateNo}
                    </span>
                    <span className="text-[11px] text-slate-400">{c.validFrom}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{c.productName}</h3>
                  <p className="text-xs text-slate-500">Customer: <strong className="text-slate-800">{c.user?.name}</strong></p>
                  <p className="text-xs text-slate-500 font-mono">SN: {c.serialNumber}</p>
                  <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Valid through: <strong className="text-emerald-700">{c.validTill}</strong></span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setPreviewCard(c)}
                    className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Card</span>
                  </button>
                  <Link
                    to={`/verify/${c.certificateNo}`}
                    target="_blank"
                    className="py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {previewCard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
              <div className="max-w-4xl w-full my-8">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setPreviewCard(null)}
                    className="px-4 py-2 bg-white text-slate-800 rounded-xl text-xs font-bold shadow hover:bg-slate-100 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Close Preview</span>
                  </button>
                </div>
                <WarrantyCardPreview card={previewCard} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
