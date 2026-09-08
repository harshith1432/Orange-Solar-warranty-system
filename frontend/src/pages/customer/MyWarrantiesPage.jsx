import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import CustomerSidebar from '../../components/CustomerSidebar';
import CustomerBottomNav from '../../components/CustomerBottomNav';
import WarrantyCardPreview from '../../components/WarrantyCardPreview';
import WarrantyTimeline from '../../components/WarrantyTimeline';
import { warrantiesApi } from '../../utils/api';
import { getCustomerAuth } from '../../utils/auth';
import { MessageCircle, Mail, Smartphone, CheckCircle2, FileCheck, ArrowRight, ShieldCheck, Sun, Clock, XCircle } from 'lucide-react';

export default function MyWarrantiesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedParam = searchParams.get('selected');
  const session = getCustomerAuth();

  const [cards, setCards] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeRequestDetails, setActiveRequestDetails] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }

    const userId = session.user.id;

    Promise.all([
      warrantiesApi.getUserCards(userId),
      warrantiesApi.getUserRequests(userId),
    ])
      .then(([cardsRes, reqsRes]) => {
        const fetchedCards = cardsRes.data || [];
        const fetchedReqs = reqsRes.data || [];
        setCards(fetchedCards);
        setRequests(fetchedReqs);

        const targetReq = selectedParam
          ? fetchedReqs.find((r) => String(r.id) === String(selectedParam))
          : fetchedReqs[0];

        if (targetReq) {
          loadRequestDetails(targetReq.id);
        }
      })
      .catch((err) => console.error('Error fetching warranties', err))
      .finally(() => setLoading(false));
  }, [session?.user?.id, selectedParam]);

  const loadRequestDetails = (reqId) => {
    warrantiesApi.getDetails(reqId).then((res) => {
      setActiveRequestDetails(res.data);
    }).catch(console.error);
  };

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans items-center justify-center p-6 text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xs">
          <ShieldCheck className="w-12 h-12 text-orange-500 mx-auto mb-3" />
          <h2 className="text-lg font-black text-slate-900 mb-1">Sign In Required</h2>
          <p className="text-xs text-slate-500 mb-6">Please sign in to your authorized Orange Solar account to view warranties.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[selectedCardIndex] || (activeRequestDetails ? activeRequestDetails.card : null);
  const hasRequests = requests.length > 0;
  const hasApprovedCard = Boolean(currentCard);

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      <Navbar />

      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        <CustomerSidebar />

        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8 space-y-6 sm:space-y-8">
          {/* Header Banner */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
                  <Sun className="w-3.5 h-3.5 text-orange-600" />
                  <span>E-Warranty Digital Vault</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Your E-Warranty Certificates & Timeline
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Dear <span className="font-bold text-slate-800">{session.user.name}</span>, here is your officially generated warranty card and live milestone timeline.
                </p>
              </div>

              {/* Only show 3-way notification badges if cards or requests exist */}
              {hasApprovedCard && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold shadow-xs">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Sent</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-orange-700 text-xs font-bold shadow-xs">
                    <Mail className="w-3.5 h-3.5 text-orange-600" />
                    <span>Email Sent</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 text-xs font-bold shadow-xs">
                    <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>SMS Sent</span>
                  </div>
                </div>
              )}
            </div>

            {/* Claims Switcher */}
            {requests.length > 1 && (
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Your Claims:</span>
                {requests.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => loadRequestDetails(r.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      activeRequestDetails?.request?.id === r.id
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {r.productName} ({r.requestId})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Empty State when no requests exist */}
          {!hasRequests && !loading && (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4 border border-orange-100 shadow-inner">
                <FileCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">No Active Warranties Registered Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                You have not registered any Orange Solar products yet. Select an installed solar water heater or rooftop power plant to initiate your digital certificate.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/customer/apply"
                  className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Request E-Warranty</span>
                </Link>
                <Link
                  to="/customer/products"
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  Browse Product Catalog
                </Link>
              </div>
            </div>
          )}

          {/* Official Warranty Card Section if user has requests */}
          {hasRequests && (
            <>
              {currentCard ? (
                <WarrantyCardPreview card={currentCard} />
              ) : (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">Warranty Request Under Review</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Your application for <strong>{activeRequestDetails?.request?.productName || 'your solar product'}</strong> has been submitted and is currently being verified by the engineering team.
                  </p>
                </div>
              )}

              {/* Milestone Timeline Section */}
              {activeRequestDetails && activeRequestDetails.timeline && (
                <WarrantyTimeline events={activeRequestDetails.timeline} />
              )}
            </>
          )}
        </main>
      </div>

      <CustomerBottomNav />
    </div>
  );
}
