import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import CustomerSidebar from '../../components/CustomerSidebar';
import CustomerBottomNav from '../../components/CustomerBottomNav';
import ProductPhoto from '../../components/ProductPhoto';
import QRScannerModal from '../../components/QRScannerModal';
import { warrantiesApi, productsApi, uploadApi } from '../../utils/api';
import { getCustomerAuth } from '../../utils/auth';
import {
  QrCode,
  Edit3,
  Camera,
  Upload,
  ArrowRight,
  Check,
  CheckCircle2,
  Sparkles,
  Sun,
  ShieldCheck,
  Image as ImageIcon,
  Search,
  ChevronDown,
  X,
  FileText,
  AlertCircle,
  Trash2,
  Eye,
  Loader2
} from 'lucide-react';

export default function ApplyWarrantyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = getCustomerAuth();

  const selectedProduct = location.state?.selectedProduct;

  const [activeTab, setActiveTab] = useState('scan');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Form states
  const [productId, setProductId] = useState(selectedProduct ? selectedProduct.id : null);
  const [productName, setProductName] = useState(selectedProduct ? selectedProduct.name : '');
  const [productModel, setProductModel] = useState(selectedProduct ? selectedProduct.model : '');
  const [productCategory, setProductCategory] = useState(selectedProduct ? selectedProduct.category : '');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [storeName, setStoreName] = useState(selectedProduct ? selectedProduct.storeName : 'Orange Solar Authorized Dealer - Bangalore');
  const [purchasePrice, setPurchasePrice] = useState(selectedProduct ? selectedProduct.price : '');
  const [productImage, setProductImage] = useState(selectedProduct ? selectedProduct.imageUrl : '');
  const [invoiceUrl, setInvoiceUrl] = useState('');
  const [billFile, setBillFile] = useState(null);
  const [billPreview, setBillPreview] = useState(null);
  const [billUploading, setBillUploading] = useState(false);
  const [billError, setBillError] = useState('');
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const billInputRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [scannedFeedback, setScannedFeedback] = useState(false);

  const handleBillFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setBillError('File size exceeds 10MB limit. Please upload a smaller image.');
      return;
    }

    setBillError('');
    setBillFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setBillPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setBillPreview('/placeholder-bill.png');
    }

    setBillUploading(true);
    try {
      const res = await uploadApi.uploadBill(file);
      if (res.data && res.data.url) {
        setInvoiceUrl(res.data.url);
        setBillError('');
      }
    } catch (err) {
      console.warn('Backend file upload failed, falling back to local base64 storage:', err);
      const reader = new FileReader();
      reader.onload = () => {
        setInvoiceUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setBillUploading(false);
    }
  };

  const handleRemoveBill = () => {
    setBillFile(null);
    setBillPreview(null);
    setInvoiceUrl('');
    setBillError('Photo of the bill is mandatory to submit your warranty claim.');
    if (billInputRef.current) {
      billInputRef.current.value = '';
    }
  };

  const selectProduct = (prod, updateSearch = true) => {
    if (!prod) return;
    setProductId(prod.id);
    setProductName(prod.name);
    setProductModel(prod.model);
    setProductCategory(prod.category || '');
    setStoreName(prod.storeName || 'Orange Solar Authorized Dealer - Bangalore');
    setPurchasePrice(prod.price ? String(prod.price) : '');
    setProductImage(prod.imageUrl || '');
    setSerialNumber(`${prod.serialPrefix || 'OS'}-${Math.floor(100000 + Math.random() * 900000)}`);
    if (updateSearch) {
      setSearchQuery(prod.name);
    }
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!session || !session.user) {
      navigate('/login');
      return;
    }

    productsApi.getAll().then((res) => {
      if (res.data && res.data.length > 0) {
        setProductsList(res.data);
        if (selectedProduct) {
          selectProduct(selectedProduct, true);
        } else {
          const first = res.data[0];
          selectProduct(first, false);
        }
      }
    }).catch(console.error);
  }, [session?.user?.id]);

  const handleScanSuccess = (data) => {
    if (data.productName) setProductName(data.productName);
    if (data.productModel) setProductModel(data.productModel);
    if (data.category) setProductCategory(data.category);
    if (data.serialNumber) setSerialNumber(data.serialNumber);
    if (data.storeName) setStoreName(data.storeName);
    if (data.purchasePrice || data.price) setPurchasePrice(String(data.purchasePrice || data.price));
    if (data.productId) setProductId(data.productId);
    if (data.imageUrl) setProductImage(data.imageUrl);
    if (data.productName) setSearchQuery(data.productName);

    setScannedFeedback(true);
    setTimeout(() => setScannedFeedback(false), 4000);
  };

  const filteredProducts = productsList.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.model?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.serialPrefix?.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !serialNumber) {
      alert('Please fill in product name and serial number.');
      return;
    }

    const finalInvoiceUrl = invoiceUrl || billPreview;
    if (!finalInvoiceUrl) {
      setBillError('Photo of the bill is mandatory to submit your warranty request. Please upload a clear photo or copy of your purchase bill.');
      const el = document.getElementById('bill-upload-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        userId: session.user.id,
        productId: productId || (productsList[0] ? productsList[0].id : null),
        productName,
        productModel,
        serialNumber,
        purchaseDate,
        storeName,
        purchasePrice: Number(purchasePrice) || 0,
        invoiceUrl: finalInvoiceUrl,
      };

      const res = await warrantiesApi.apply(payload);
      if (res.data) {
        navigate(`/customer/success?id=${res.data.requestId}&product=${encodeURIComponent(productName)}`);
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to submit warranty application.';
      alert('Submission Error: ' + errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans items-center justify-center p-6 text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xs">
          <ShieldCheck className="w-12 h-12 text-orange-500 mx-auto mb-3" />
          <h2 className="text-lg font-black text-slate-900 mb-1">Sign In Required</h2>
          <p className="text-xs text-slate-500 mb-6">Please sign in to your authorized Orange Solar account to request a warranty.</p>
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

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      <Navbar />

      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        <CustomerSidebar />

        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
              <Sun className="w-3.5 h-3.5 text-orange-600" />
              <span>Orange Solar Warranty Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Request E-Warranty</h1>
            <p className="text-xs text-slate-500 mt-1">
              Select or scan your installed product to initiate instant digital warranty registration.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                activeTab === 'scan'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-4 h-4" />
              Scan QR Barcode
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                activeTab === 'manual'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Select & Fill Details
            </button>
          </div>

          {scannedFeedback && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold animate-in fade-in">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Product barcode successfully decoded! Product information auto-filled below.</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Box: Scanner & Product Preview with Photo */}
            <div className="lg:col-span-5 space-y-6">
              {/* Selected Product Photo Card */}
              <div className="bg-white border border-orange-200/80 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Selected Product Photo
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Certified
                  </span>
                </div>

                <div className="rounded-2xl overflow-hidden mb-3 border border-slate-200/80">
                  <ProductPhoto
                    imageUrl={productImage}
                    name={productName}
                    category={productCategory}
                    className="h-44"
                  />
                </div>

                <h4 className="text-sm font-black text-slate-900 truncate">{productName || 'Select Product'}</h4>
                <p className="text-[11px] font-mono text-orange-600 font-bold">{productModel}</p>

                {/* Searchable Product Dropdown */}
                {productsList.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100" ref={dropdownRef}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Search & Choose Model
                      </label>
                      <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                        {productsList.length} Models
                      </span>
                    </div>

                    <div className="relative">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsDropdownOpen(true);
                          }}
                          onFocus={() => setIsDropdownOpen(true)}
                          placeholder="Search by model, name, ETC, 5kW..."
                          className="w-full pl-9 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:border-orange-500 focus:outline-none shadow-2xs transition-all"
                        />
                        {searchQuery ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery('');
                              setIsDropdownOpen(true);
                            }}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <ChevronDown
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 ${
                              isDropdownOpen ? 'rotate-180 text-orange-600' : ''
                            }`}
                          />
                        )}
                      </div>

                      {/* Dropdown menu while searching */}
                      {isDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 max-h-72 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
                          {filteredProducts.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-400 font-medium">
                              No solar products found for "{searchQuery}"
                            </div>
                          ) : (
                            filteredProducts.map((p) => {
                              const isSelected = p.id === productId;
                              return (
                                <div
                                  key={p.id}
                                  onClick={() => selectProduct(p, true)}
                                  className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                                    isSelected
                                      ? 'bg-orange-50/90 hover:bg-orange-100/80 border-l-4 border-orange-500'
                                      : 'hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-9 h-9 rounded-lg bg-orange-100/60 overflow-hidden shrink-0 flex items-center justify-center border border-orange-200/50">
                                      {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <Sun className="w-4 h-4 text-orange-600" />
                                      )}
                                    </div>
                                    <div className="min-w-0 text-left">
                                      <p className="text-xs font-bold text-slate-900 truncate">
                                        {p.name}
                                      </p>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[10px] font-mono font-semibold text-orange-700 bg-orange-100/80 px-1.5 py-0.2 rounded">
                                          {p.model}
                                        </span>
                                        <span className="text-[10px] text-slate-400 truncate">
                                          {p.category}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-right shrink-0">
                                    <span className="text-xs font-black text-slate-900 block">
                                      ₹{Number(p.price).toLocaleString('en-IN')}
                                    </span>
                                    {isSelected && (
                                      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider flex items-center justify-end gap-0.5 mt-0.5">
                                        <Check className="w-2.5 h-2.5" /> Selected
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* QR Scanner Trigger */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs text-center">
                <div
                  onClick={() => setIsScannerOpen(true)}
                  className="relative group cursor-pointer bg-slate-950 rounded-2xl overflow-hidden p-6 border-2 border-dashed border-orange-400/60 hover:border-orange-500 transition-all flex flex-col items-center justify-center"
                >
                  <Camera className="w-10 h-10 text-orange-400 group-hover:scale-110 transition-transform mb-2" />
                  <p className="text-xs font-bold text-white">Scan Barcode / Serial QR</p>
                  <p className="text-[10px] text-slate-400 mt-1">Open Camera or Upload Photo</p>
                </div>
              </div>
            </div>

            {/* Right Box: Form Details */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900">Application Details</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Model Number
                    </label>
                    <input
                      type="text"
                      required
                      value={productModel}
                      onChange={(e) => setProductModel(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Serial Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      placeholder="e.g. OS-ULT-984210"
                      className="w-full px-4 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none font-bold text-orange-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Purchase / Installation Date
                    </label>
                    <input
                      type="date"
                      required
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Dealer / Store Name
                    </label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Purchase Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none font-bold text-slate-900"
                  />
                </div>

                {/* Mandatory Purchase Bill / Invoice Upload Section */}
                <div id="bill-upload-section" className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-orange-600" />
                      <span>Purchase Bill / Invoice Photo</span>
                      <span className="text-rose-600 font-black text-sm">*</span>
                    </label>
                    <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Mandatory Required
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2.5">
                    Please upload a clear photo or copy of your purchase bill / invoice. It is required to approve your warranty.
                  </p>

                  <input
                    type="file"
                    ref={billInputRef}
                    onChange={handleBillFileSelect}
                    accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
                    className="hidden"
                  />

                  {!billPreview ? (
                    <div
                      onClick={() => billInputRef.current?.click()}
                      className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center gap-2 ${
                        billError
                          ? 'border-rose-400 bg-rose-50/50 hover:bg-rose-50'
                          : 'border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/30'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-orange-600 shadow-2xs group-hover:scale-105 transition-transform">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Click to upload bill photo or take picture
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Supports JPG, PNG, WEBP or PDF (Max 10MB)
                        </p>
                      </div>
                      <button
                        type="button"
                        className="mt-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Select Bill Photo / Document</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                      {/* Thumbnail */}
                      <div
                        onClick={() => setIsBillModalOpen(true)}
                        className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-900 border border-orange-200 shrink-0 cursor-pointer group shadow-2xs"
                        title="Click to view full photo"
                      >
                        {billFile?.type?.includes('pdf') ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-rose-50 text-rose-600 p-2 text-center">
                            <FileText className="w-8 h-8 mb-1" />
                            <span className="text-[9px] font-bold">PDF BILL</span>
                          </div>
                        ) : (
                          <>
                            <img
                              src={billPreview}
                              alt="Bill Preview"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">
                              <Eye className="w-3.5 h-3.5" /> View
                            </div>
                          </>
                        )}
                      </div>

                      {/* Info & Actions */}
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-700 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Bill Photo Attached</span>
                          {billUploading && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                              <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                          {billFile?.name || 'purchase-bill-invoice.jpg'}
                        </p>
                        {billFile?.size && (
                          <p className="text-[10px] text-slate-400 font-mono">
                            {(billFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        )}

                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2.5">
                          <button
                            type="button"
                            onClick={() => setIsBillModalOpen(true)}
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-orange-300 text-slate-700 text-[11px] font-bold rounded-lg shadow-2xs flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-orange-600" /> Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => billInputRef.current?.click()}
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-orange-300 text-slate-700 text-[11px] font-bold rounded-lg shadow-2xs flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3 text-slate-500" /> Change
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveBill}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-bold rounded-lg shadow-2xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {billError && (
                    <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-bold animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{billError}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>{submitting ? 'Submitting Application to Database...' : 'Submit Warranty Request'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Bill Photo Preview Lightbox Modal */}
      {isBillModalOpen && billPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                <h4 className="text-xs font-bold text-slate-900">Purchase Bill Photo Preview</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsBillModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/5 min-h-[300px]">
              {billFile?.type?.includes('pdf') ? (
                <div className="text-center p-6">
                  <FileText className="w-16 h-16 text-rose-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800">PDF Invoice Document Attached</p>
                  <p className="text-[11px] text-slate-500 mt-1">{billFile.name}</p>
                </div>
              ) : (
                <img
                  src={billPreview}
                  alt="Full Purchase Bill"
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-md"
                />
              )}
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                {billFile?.name || 'Attached Purchase Bill'}
              </span>
              <button
                type="button"
                onClick={() => setIsBillModalOpen(false)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-xl font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        demoProducts={productsList}
      />

      <CustomerBottomNav />
    </div>
  );
}

