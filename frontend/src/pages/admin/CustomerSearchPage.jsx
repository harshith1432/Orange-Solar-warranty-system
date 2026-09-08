import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import CustomerDetailsModal from '../../components/CustomerDetailsModal';
import { customersApi, productsApi } from '../../utils/api';
import {
  Users,
  Search,
  Filter,
  MapPin,
  ShoppingBag,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  RefreshCw,
  X,
  Award,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MessageCircle,
  Smartphone,
  User,
  FileText,
  Maximize2,
  Sparkles,
  DollarSign,
  Tag,
  Building2,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   Comprehensive Inline Expanded Row
   Displays EVERYTHING on a single view:
   1. Complete Personal Details (Name, Phone, Email, Address, Area, Age, Member Since, ID)
   2. What They Bought (Product name, Model, Serial number, Price, Purchase Date, Store/Dealer)
   3. Warranties They Have (Status, Certificate No, Validity From-Till, Coverage Period, Verify Link)
   4. Documents, Proof & Audit Trail
───────────────────────────────────────────────────────────────────────────────*/
function ExpandedCustomerRow({ initialCustomer, customerId, colSpan, onClose, onOpenModal }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    customersApi
      .getById(customerId)
      .then((res) => {
        if (isMounted && res.data) {
          setData(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load customer details', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [customerId]);

  // Combine initial list item data with fetched detailed 360 data
  const customer = data?.customer || initialCustomer || {};
  const requests = data?.requests || initialCustomer?.requests || [];
  const cards = data?.cards || [];
  const timeline = data?.timeline || [];
  const area = data?.area || initialCustomer?.area || 'Bangalore';

  const totalSpent =
    requests.length > 0
      ? requests.reduce((sum, r) => sum + (Number(r.purchasePrice) || 0), 0)
      : Number(customer.totalSpent || initialCustomer?.totalSpent || 0);

  const activeWarranties =
    cards.length > 0
      ? cards.filter((c) => !c.validTill || new Date(c.validTill) >= new Date()).length
      : initialCustomer?.approvedCount || 0;

  const pendingRequests =
    requests.filter((r) => r.status === 'PENDING').length || initialCustomer?.pendingCount || 0;

  return (
    <tr>
      <td
        colSpan={colSpan}
        className="p-0 bg-gradient-to-b from-orange-50/70 via-slate-50 to-slate-100/80 border-y-2 border-orange-300"
      >
        <div className="p-6 sm:p-8 space-y-6">
          {/* ───────────────────────────────────────────────────────────
              TOP BAR: Customer Header & Quick Controls
          ───────────────────────────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-orange-500/20">
                {customer.name?.charAt(0) || 'C'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-xl font-black tracking-tight text-slate-900">
                    {customer.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                    {customer.role || 'CUSTOMER'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-200 text-slate-700">
                    ID: #{customer.id}
                  </span>
                  {loading && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-orange-600 font-semibold animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Fetching live cards...
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                  <span>Registered Member since <strong className="text-slate-700">{customer.memberSince || '2024'}</strong></span>
                  <span>•</span>
                  <span>Total Systems: <strong className="text-slate-700">{requests.length || customer.totalPurchases || 0} Solar Units</strong></span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 self-start lg:self-auto">
              <button
                onClick={() => onOpenModal && onOpenModal(customer.id)}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                title="Open full interactive modal window"
              >
                <Maximize2 className="w-3.5 h-3.5 text-orange-500" />
                <span>Open Full Screen View</span>
              </button>
              <button
                onClick={onClose}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                title="Collapse details"
              >
                <ChevronUp className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              SECTION 1: COMPLETE PERSONAL DETAILS
          ───────────────────────────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <User className="w-4 h-4 text-orange-500" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                1. Customer Personal & Contact Profile
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Phone */}
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Phone Number
                </span>
                <a
                  href={`tel:${customer.phone}`}
                  className="text-xs font-mono font-bold text-slate-900 hover:text-orange-600 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>{customer.phone || 'Not provided'}</span>
                </a>
              </div>

              {/* Email */}
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Email Address
                </span>
                <a
                  href={`mailto:${customer.email}`}
                  className="text-xs font-bold text-slate-900 hover:text-orange-600 flex items-center gap-1.5 truncate"
                  title={customer.email}
                >
                  <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="truncate">{customer.email || 'Not provided'}</span>
                </a>
              </div>

              {/* Age & Demographics */}
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Age & Demographics
                </span>
                <span className="text-xs font-bold text-slate-900 block">
                  {customer.age ? `${customer.age} Years Old` : 'Age not recorded'}
                </span>
              </div>

              {/* Cumulative Investment */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                  Lifetime Solar Investment
                </span>
                <span className="text-sm font-black text-indigo-900 block">
                  ₹{Number(totalSpent || 0).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Complete Address & Area */}
              <div className="sm:col-span-2 lg:col-span-4 p-4 bg-orange-50/40 border border-orange-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 block">
                      Rooftop Installation & Billing Address
                    </span>
                    <p className="text-xs font-medium text-slate-800 mt-0.5">
                      {customer.address || 'Address on file not provided'}
                    </p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-orange-200 text-orange-800 text-xs font-bold shrink-0">
                  <span>Region:</span>
                  <span>{area || 'Bangalore'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              SECTION 2: WHAT THEY BOUGHT & WARRANTIES THEY HAVE
          ───────────────────────────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-orange-500" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  2. Equipment Purchased & Warranty Ledger ({requests.length} Registered Products)
                </h4>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                Active Warranties: <strong className="text-emerald-600">{activeWarranties}</strong> • Pending Reviews: <strong className="text-amber-600">{pendingRequests}</strong>
              </span>
            </div>

            {requests.length === 0 ? (
              <div className="text-center py-10 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <ShieldCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-700">No solar equipment registered yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When customer purchases a system or applies for warranty, details will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {requests.map((req, idx) => {
                  const card = cards.find(
                    (c) => c.request?.id === req.id || c.serialNumber === req.serialNumber
                  );

                  return (
                    <div
                      key={req.id || idx}
                      className="border border-slate-200 hover:border-orange-300 rounded-2xl p-5 bg-gradient-to-r from-white via-slate-50/50 to-white transition-all shadow-2xs space-y-4"
                    >
                      {/* Product Header & Warranty Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] font-black bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200">
                              {req.requestId || `REQ#${req.id}`}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                req.status === 'APPROVED'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : req.status === 'PENDING'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}
                            >
                              {req.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                              {req.status === 'PENDING' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                              {req.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                              <span>
                                {req.status === 'APPROVED'
                                  ? 'Warranty Active & Verified'
                                  : req.status === 'PENDING'
                                  ? 'Warranty Pending Verification'
                                  : 'Warranty Claim Rejected'}
                              </span>
                            </span>

                            {card && (
                              <span className="px-2.5 py-0.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 font-mono text-[11px] font-bold flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-orange-500" />
                                Cert: {card.certificateNo}
                              </span>
                            )}
                          </div>

                          <h5 className="text-sm font-black text-slate-900 mt-1">
                            {req.productName}
                          </h5>
                        </div>

                        {card && (
                          <a
                            href={`/verify/${card.certificateNo}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View Official Certificate</span>
                          </a>
                        )}
                      </div>

                      {/* What they buy: Model, Serial, Dealer, Price, Purchase Date */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Product Model
                          </span>
                          <span className="font-bold text-slate-800 mt-0.5 block truncate">
                            {req.productModel || 'Standard Model'}
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Equipment Serial No
                          </span>
                          <span className="font-mono font-black text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                            {req.serialNumber}
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Purchase Price
                          </span>
                          <span className="font-black text-slate-900 mt-0.5 block">
                            ₹{Number(req.purchasePrice || 0).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Date of Purchase
                          </span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">
                            {req.purchaseDate || 'Not specified'}
                          </span>
                        </div>

                        <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-white p-3 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Dealer / Retail Store
                          </span>
                          <span className="font-semibold text-slate-800 mt-0.5 block truncate" title={req.storeName}>
                            {req.storeName || 'Orange Solar Authorized'}
                          </span>
                        </div>
                      </div>

                      {/* What warranty they have: Validity, Duration, Invoice Bill */}
                      <div className="p-3.5 bg-slate-100/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-4 text-slate-700">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <strong>Coverage:</strong>{' '}
                            {card ? (
                              <span className="text-emerald-800 font-bold">
                                {card.validFrom} to {card.validTill} ({card.warrantyPeriod || '5 Years'})
                              </span>
                            ) : req.status === 'APPROVED' ? (
                              <span className="text-emerald-700 font-bold">Active (Official Card Issued)</span>
                            ) : req.status === 'PENDING' ? (
                              <span className="text-amber-700 font-bold">Pending Review & Validation</span>
                            ) : (
                              <span className="text-rose-700 font-bold">Not Covered</span>
                            )}
                          </span>

                          {req.invoiceUrl && (
                            <a
                              href={req.invoiceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-bold underline text-xs"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Tax Invoice / Bill</span>
                            </a>
                          )}
                        </div>

                        {req.status === 'REJECTED' && req.rejectionReason && (
                          <div className="text-xs text-rose-700 font-medium">
                            <strong>Reason:</strong> {req.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ───────────────────────────────────────────────────────────
              SECTION 3: AUDIT TRAIL / MILESTONES (If Available)
          ───────────────────────────────────────────────────────────── */}
          {timeline.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <Clock className="w-4 h-4 text-orange-500" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  3. Audit & Lifecycle Milestones ({timeline.length} Events)
                </h4>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {timeline.map((event, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full -ml-[19px] flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${
                        event.status === 'COMPLETED'
                          ? 'bg-emerald-500 ring-4 ring-emerald-50'
                          : event.status === 'CURRENT'
                          ? 'bg-amber-500 ring-4 ring-amber-50 animate-pulse'
                          : 'bg-slate-300 ring-4 ring-slate-100'
                      }`}
                    >
                      {event.status === 'COMPLETED' ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="text-xs font-bold text-slate-900">{event.eventTitle}</h5>
                        <span className="text-[10px] font-mono text-slate-400">
                          {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'Pending'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{event.eventDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main CustomerSearchPage Component
───────────────────────────────────────────────────────────────────────────────*/
export default function CustomerSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const phoneParam = searchParams.get('phone');

  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalSystems: 0,
    activeWarranties: 0,
    pendingClaims: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);

  // Modal workspace state
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const loadCustomerData = async () => {
    setLoading(true);
    try {
      const [custRes, statsRes, prodRes] = await Promise.all([
        customersApi.getAll(),
        customersApi.getStats(),
        productsApi.getAll(),
      ]);
      if (custRes.data) setCustomers(custRes.data);
      if (statsRes.data) setStats(statsRes.data);
      if (prodRes.data) setAvailableProducts(prodRes.data);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerData();
  }, []);

  // Deep-link ?phone= support
  useEffect(() => {
    if (phoneParam) {
      setModalLoading(true);
      customersApi
        .search(phoneParam)
        .then((res) => {
          if (res.data) setSelectedCustomerDetail(res.data);
        })
        .catch(console.error)
        .finally(() => setModalLoading(false));
    }
  }, [phoneParam]);

  const availableAreas = useMemo(() => {
    const s = new Set();
    customers.forEach((c) => {
      if (c.area) s.add(c.area);
    });
    return Array.from(s);
  }, [customers]);

  const distinctProductNames = useMemo(() => {
    const s = new Set();
    customers.forEach((c) => c.products?.forEach((p) => s.add(p)));
    availableProducts.forEach((p) => {
      if (p.name) s.add(p.name);
    });
    return Array.from(s);
  }, [customers, availableProducts]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = cust.name?.toLowerCase().includes(q);
        const phoneMatch = cust.phone?.toLowerCase().includes(q);
        const emailMatch = cust.email?.toLowerCase().includes(q);
        const addressMatch = cust.address?.toLowerCase().includes(q);
        const areaMatch = cust.area?.toLowerCase().includes(q);
        const productMatch = cust.products?.some((p) => p.toLowerCase().includes(q));
        const serialMatch = cust.requests?.some(
          (r) => r.serialNumber && r.serialNumber.toLowerCase().includes(q)
        );

        if (
          !nameMatch &&
          !phoneMatch &&
          !emailMatch &&
          !addressMatch &&
          !areaMatch &&
          !productMatch &&
          !serialMatch
        ) {
          return false;
        }
      }

      if (selectedProduct !== 'All') {
        if (!cust.products?.some((p) => p.toLowerCase() === selectedProduct.toLowerCase())) {
          return false;
        }
      }

      if (selectedArea !== 'All') {
        if (
          cust.area?.toLowerCase() !== selectedArea.toLowerCase() &&
          !cust.address?.toLowerCase().includes(selectedArea.toLowerCase())
        ) {
          return false;
        }
      }

      if (selectedStatus !== 'All') {
        if (selectedStatus === 'ACTIVE' && (!cust.approvedCount || cust.approvedCount === 0))
          return false;
        if (selectedStatus === 'PENDING' && (!cust.pendingCount || cust.pendingCount === 0))
          return false;
        if (selectedStatus === 'NONE' && cust.requestsCount && cust.requestsCount > 0)
          return false;
      }

      return true;
    });
  }, [customers, searchQuery, selectedProduct, selectedArea, selectedStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedProduct, selectedArea, selectedStatus, rowsPerPage]);

  const totalRecords = filteredCustomers.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + rowsPerPage);

  const handleToggleRow = (id) => {
    setExpandedCustomerId((prev) => (prev === id ? null : id));
  };

  const handleOpenFullModal = (customerId) => {
    setModalLoading(true);
    customersApi
      .getById(customerId)
      .then((res) => {
        if (res.data) setSelectedCustomerDetail(res.data);
      })
      .catch((err) => {
        console.error('Failed to open modal', err);
        alert('Could not open customer 360 view');
      })
      .finally(() => setModalLoading(false));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedProduct('All');
    setSelectedArea('All');
    setSelectedStatus('All');
    setCurrentPage(1);
  };

  const COL_COUNT = 5; // Customer | Phone | Warranty Status | Lifetime Spend | Action/Chevron

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Navbar />

      <div className="flex-1 flex w-full">
        <AdminSidebar />

        <main className="flex-1 p-4 sm:p-8 pb-24 md:pb-8 overflow-y-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                  Customer Directory & CRM
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                Customer 360 & Purchase Ledger
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Click any customer to reveal their full personal profile, purchased solar products, and active warranty status.
              </p>
            </div>
            <button
              onClick={loadCustomerData}
              disabled={loading}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-orange-600' : 'text-slate-400'}`} />
              Refresh
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            {[
              { label: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-orange-500', sub: 'Verified Accounts', subColor: 'text-orange-600' },
              { label: 'Installed Systems', value: stats.totalSystems, icon: Layers, color: 'text-blue-500', sub: 'Solar Products', subColor: 'text-blue-600' },
              { label: 'Active Warranties', value: stats.activeWarranties, icon: ShieldCheck, color: 'text-emerald-500', sub: 'Certified Cards', subColor: 'text-emerald-600', valColor: 'text-emerald-600' },
              { label: 'Pending Claims', value: stats.pendingClaims, icon: Clock, color: 'text-amber-500', sub: 'Requires Verification', subColor: 'text-amber-600', valColor: 'text-amber-600' },
              { label: 'Lifetime Value', value: `₹${Number(stats.totalSpent || 0).toLocaleString('en-IN')}`, icon: ShoppingBag, color: 'text-purple-500', sub: 'Cumulative Spend', subColor: 'text-purple-600', wide: true },
            ].map(({ label, value, icon: Icon, color, sub, subColor, valColor, wide }) => (
              <div key={label} className={`${wide ? 'col-span-2 sm:col-span-1' : ''} bg-white border border-slate-200 rounded-2xl p-4 shadow-xs`}>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className={`text-xl sm:text-2xl font-bold truncate ${valColor || 'text-slate-900'}`}>{value}</div>
                <p className={`text-[11px] font-semibold mt-0.5 ${subColor}`}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, email, address, product, or serial..."
                  className="w-full pl-9 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full sm:w-52 py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:border-orange-500 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Products ({distinctProductNames.length})</option>
                  {distinctProductNames.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full sm:w-40 py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:border-orange-500 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Areas ({availableAreas.length})</option>
                  {availableAreas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full sm:w-44 py-2.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:bg-white focus:border-orange-500 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="ACTIVE">With Active Warranty</option>
                  <option value="PENDING">With Pending Claims</option>
                  <option value="NONE">No Warranties Yet</option>
                </select>

                {(searchQuery || selectedProduct !== 'All' || selectedArea !== 'All' || selectedStatus !== 'All') && (
                  <button
                    onClick={handleResetFilters}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" /> Reset
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">
                  Showing {filteredCustomers.length} of {customers.length} Customers
                </span>
                {(searchQuery || selectedProduct !== 'All' || selectedArea !== 'All' || selectedStatus !== 'All') && (
                  <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 text-[11px] font-bold">
                    Filtered view active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-slate-500 font-medium">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────
              CUSTOMERS DATA TABLE
          ───────────────────────────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Phone</th>
                    <th className="py-3.5 px-6">Warranty Status</th>
                    <th className="py-3.5 px-6 text-right">Lifetime Spend</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={COL_COUNT} className="py-16 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-orange-500 mb-2" />
                        <span className="font-semibold text-xs">Loading customer directory...</span>
                      </td>
                    </tr>
                  ) : paginatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={COL_COUNT} className="py-16 text-center text-slate-400">
                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-700">No customers match your criteria.</p>
                        <p className="text-xs text-slate-400 mt-1">Try clearing the search or changing filters.</p>
                        <button
                          onClick={handleResetFilters}
                          className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                        >
                          Clear All Filters
                        </button>
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((cust) => {
                      const isExpanded = expandedCustomerId === cust.id;

                      return (
                        <React.Fragment key={cust.id}>
                          {/* ── Minimal Summary Row ── */}
                          <tr
                            onClick={() => handleToggleRow(cust.id)}
                            className={`transition-colors cursor-pointer group ${
                              isExpanded
                                ? 'bg-orange-50/80 border-l-4 border-l-orange-500 font-medium'
                                : 'hover:bg-orange-50/40'
                            }`}
                          >
                            {/* Customer Name & Avatar */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform shrink-0">
                                  {cust.name?.charAt(0) || 'C'}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block group-hover:text-orange-600 transition-colors">
                                    {cust.name}
                                  </span>
                                  <span className="text-[11px] text-slate-400">
                                    {cust.age ? `${cust.age} yrs • ` : ''}Member since {cust.memberSince || '2024'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Phone */}
                            <td className="py-4 px-6">
                              <span className="font-mono text-[11px] font-semibold text-slate-800 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {cust.phone}
                              </span>
                            </td>

                            {/* Warranty Status */}
                            <td className="py-4 px-6">
                              {cust.approvedCount > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  {cust.approvedCount} Active Card{cust.approvedCount > 1 ? 's' : ''}
                                </span>
                              ) : cust.pendingCount > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  {cust.pendingCount} Pending
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                                  No Warranties
                                </span>
                              )}
                            </td>

                            {/* Lifetime Spend */}
                            <td className="py-4 px-6 text-right font-bold text-slate-900">
                              ₹{Number(cust.totalSpent || 0).toLocaleString('en-IN')}
                            </td>

                            {/* Action Button: Click to view details */}
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleRow(cust.id);
                                }}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs ${
                                  isExpanded
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-600'
                                }`}
                              >
                                <span>{isExpanded ? 'Hide Details' : 'View 360'}</span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </button>
                            </td>
                          </tr>

                          {/* ── Comprehensive Full Details Expanded Row ── */}
                          {isExpanded && (
                            <ExpandedCustomerRow
                              initialCustomer={cust}
                              customerId={cust.id}
                              colSpan={COL_COUNT}
                              onClose={() => setExpandedCustomerId(null)}
                              onOpenModal={handleOpenFullModal}
                            />
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-medium">
                Showing{' '}
                <span className="font-bold text-slate-800">{totalRecords > 0 ? startIndex + 1 : 0}</span>
                {' '}to{' '}
                <span className="font-bold text-slate-800">{Math.min(startIndex + rowsPerPage, totalRecords)}</span>
                {' '}of <span className="font-bold text-slate-800">{totalRecords}</span> customers
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      if (totalPages <= 7) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((page, idx, arr) => {
                      const showEllipsis = arr[idx - 1] && page - arr[idx - 1] > 1;
                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && <span className="px-1 text-slate-400 text-xs">...</span>}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                              currentPage === page
                                ? 'bg-orange-500 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Full Modal Workspace (Opens when requested or via ?phone= URL) */}
      <CustomerDetailsModal
        isOpen={Boolean(selectedCustomerDetail)}
        customerData={selectedCustomerDetail}
        onClose={() => {
          setSelectedCustomerDetail(null);
          if (phoneParam) setSearchParams({});
        }}
      />
    </div>
  );
}
