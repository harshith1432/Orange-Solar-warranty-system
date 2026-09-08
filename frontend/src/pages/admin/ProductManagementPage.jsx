import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/AdminSidebar';
import { productsApi } from '../../utils/api';
import {
  PackagePlus,
  ShieldCheck,
  Check,
  Trash2,
  Edit3,
  Sparkles,
  Tag,
  Upload,
  Image as ImageIcon,
  X,
  Eye,
  RefreshCw,
  Sun,
  Camera,
  ExternalLink
} from 'lucide-react';

const SOLAR_PHOTO_PRESETS = [
  {
    name: 'ETC Diamond Glass Line',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'FPC Flat Plate Collector',
    url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Domestic Heat Pump',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Rooftop Solar Plant',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80'
  }
];

export default function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('Solar Water Heater (ETC)');
  const [price, setPrice] = useState('');
  const [defaultWarrantyMonths, setDefaultWarrantyMonths] = useState('84');
  const [serialPrefix, setSerialPrefix] = useState('OS-ETC');
  const [storeName, setStoreName] = useState('Orange Solar Authorized Dealer - Bangalore');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [urlMode, setUrlMode] = useState(false);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [previewModalImg, setPreviewModalImg] = useState(null);

  const fileInputRef = useRef(null);

  const loadProducts = () => {
    productsApi.getAdminAll()
      .then((res) => {
        if (res.data) setProducts(res.data);
      })
      .catch((err) => console.error('Error fetching admin products', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Helper to compress and convert file to lightweight base64 data URL
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Canvas compression to max 800px width/height for fast database persistence
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setImageUrl(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fakeEvent = { target: { files: [file] } };
      handleFileChange(fakeEvent);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setModel('');
    setCategory('Solar Water Heater (ETC)');
    setPrice('');
    setDefaultWarrantyMonths('84');
    setSerialPrefix('OS-ETC');
    setStoreName('Orange Solar Authorized Dealer - Bangalore');
    setDescription('');
    setImageUrl('');
    setUrlMode(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setName(p.name || '');
    setModel(p.model || '');
    setCategory(p.category || 'Solar Water Heater (ETC)');
    setPrice(p.price != null ? String(p.price) : '');
    setDefaultWarrantyMonths(String(p.defaultWarrantyMonths || '84'));
    setSerialPrefix(p.serialPrefix || 'OS-ETC');
    setStoreName(p.storeName || 'Orange Solar Authorized Dealer - Bangalore');
    setDescription(p.description || '');
    setImageUrl(p.imageUrl || '');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!name.trim() || !model.trim()) {
      alert('Please fill in product name and model number.');
      return;
    }

    setSaving(true);
    const payload = {
      name: name.trim(),
      model: model.trim(),
      category,
      price: Number(price) || 0,
      defaultWarrantyMonths: Number(defaultWarrantyMonths) || 12,
      serialPrefix: serialPrefix.trim() || 'OS',
      storeName: storeName.trim() || 'Orange Solar Authorized Dealer',
      description: description.trim(),
      imageUrl: imageUrl.trim() || null,
    };

    try {
      if (editingId) {
        await productsApi.update(editingId, payload);
        setFeedback(`Product "${name}" updated successfully in catalog!`);
      } else {
        await productsApi.create(payload);
        setFeedback(`Product "${name}" created and photo saved successfully!`);
      }
      setTimeout(() => setFeedback(null), 5000);
      resetForm();
      loadProducts();
    } catch (err) {
      console.error('Error saving product', err);
      alert('Error saving product to database. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (confirm('Deactivate this product from the customer catalog?')) {
      await productsApi.delete(id);
      loadProducts();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      <Navbar />

      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        <AdminSidebar />

        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8 space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
                <Sun className="w-3.5 h-3.5 text-orange-600" />
                <span>Orange Solar Admin Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Product Catalog & Photos
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                List and manage official Orange Solar products, upload real photos, and configure warranty terms.
              </p>
            </div>

            <button
              onClick={loadProducts}
              className="self-start sm:self-auto px-4 py-2 bg-white border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-600 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Catalog</span>
            </button>
          </div>

          {feedback && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Add / Edit Product Form */}
          <div className="bg-white border border-orange-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    {editingId ? 'Edit Product & Update Photo' : 'List New Product with Photo'}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    All product fields persist directly to the central catalog
                  </p>
                </div>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel Edit</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Row 1: Name & Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Diamond Glass Line Ultimate Solar Water Heater"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Model Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. OS-ETC-ULT200"
                    className="w-full px-4 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Category, Price, Warranty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCategory(val);
                      if (val.includes('ETC')) setSerialPrefix('OS-ETC');
                      else if (val.includes('FPC')) setSerialPrefix('OS-FPC');
                      else if (val.includes('Heat Pump')) setSerialPrefix('OS-HP');
                      else if (val.includes('Rooftop')) setSerialPrefix('OS-RT');
                    }}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none font-medium"
                  >
                    <option value="Solar Water Heater (ETC)">Solar Water Heater (ETC)</option>
                    <option value="Solar Water Heater (FPC)">Solar Water Heater (FPC)</option>
                    <option value="Heat Pump">Heat Pump Water Heater</option>
                    <option value="Solar Rooftop Systems">Solar Rooftop Power Plant</option>
                    <option value="Solar Power Systems">Solar Power Systems</option>
                    <option value="Commercial & Industrial Solar">Commercial & Industrial Solar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Retail Price (₹)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 48500"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Default Warranty Period
                  </label>
                  <select
                    value={defaultWarrantyMonths}
                    onChange={(e) => setDefaultWarrantyMonths(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none font-medium"
                  >
                    <option value="12">12 Months (1 Year)</option>
                    <option value="24">24 Months (2 Years)</option>
                    <option value="36">36 Months (3 Years)</option>
                    <option value="60">60 Months (5 Years)</option>
                    <option value="84">84 Months (7 Years - Glass Line)</option>
                    <option value="120">120 Months (10 Years - Ultimate)</option>
                    <option value="300">300 Months (25 Years - Rooftop)</option>
                  </select>
                </div>
              </div>

              {/* PHOTO UPLOAD SECTION */}
              <div className="p-5 bg-orange-50/50 border border-orange-200/90 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Product Photo *
                    </span>
                    <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-semibold">
                      Real-time Database Storage
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setUrlMode(false)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                        !urlMode ? 'bg-orange-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-orange-100'
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrlMode(true)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
                        urlMode ? 'bg-orange-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-orange-100'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Upload Box / URL Input */}
                  <div className="md:col-span-2 space-y-3">
                    {!urlMode ? (
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-orange-300 hover:border-orange-500 bg-white rounded-2xl p-6 text-center cursor-pointer transition-colors group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <div className="w-12 h-12 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          Click to browse or drag & drop product photo
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          PNG, JPG, WebP supported • Automatically optimized for database speed
                        </p>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Image Web Address (URL)
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/product-image.jpg"
                            className="w-full px-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none font-mono"
                          />
                          {imageUrl && (
                            <button
                              type="button"
                              onClick={() => setImageUrl('')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Quick presets for common Orange Solar products */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold text-slate-500">Quick Samples:</span>
                      {SOLAR_PHOTO_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(preset.url)}
                          className="text-[10px] font-bold px-2 py-1 rounded bg-white hover:bg-orange-100 text-slate-700 border border-slate-200 hover:border-orange-300 transition-colors"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Photo Preview Card */}
                  <div className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-2xl min-h-[160px]">
                    {imageUrl ? (
                      <div className="relative group w-full flex flex-col items-center">
                        <img
                          src={imageUrl}
                          alt="Product Preview"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            alert('The image URL could not be loaded. Please check the URL or upload a file.');
                          }}
                          className="w-full h-32 object-cover rounded-xl border border-slate-100 shadow-2xs"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => setPreviewModalImg(imageUrl)}
                            className="text-[11px] text-orange-600 font-bold hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View Full
                          </button>
                          <span className="text-slate-300">•</span>
                          <button
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="text-[11px] text-rose-600 font-bold hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4 text-slate-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <span className="text-xs font-semibold block">No photo selected</span>
                        <span className="text-[10px] text-slate-400">Preview will show here</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 3: Serial Prefix & Store Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Serial Number Prefix
                  </label>
                  <input
                    type="text"
                    value={serialPrefix}
                    onChange={(e) => setSerialPrefix(e.target.value)}
                    placeholder="e.g. OS-ULT"
                    className="w-full px-4 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Prefixed onto customer generated warranty serial codes</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Authorized Store / Dealer Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Orange Solar Authorized Dealer - Bangalore"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Warranty & Engineering Specifications
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter specifications (e.g. Diamond glass lined tank, 3-target vacuum tubes, MNRE approved, 10-year inner tank warranty terms)..."
                  className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none h-24 leading-relaxed"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {saving
                      ? 'Saving to Database...'
                      : editingId
                      ? 'Update Product in Catalog'
                      : 'Save Product with Photo'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Existing Products Table */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  Active Orange Solar Catalog ({products.length})
                </h3>
                <p className="text-[11px] text-slate-500">Live catalog records available to customer portal</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3.5 px-4 text-center">Photo</th>
                    <th className="py-3.5 px-6">Product & Model</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Price</th>
                    <th className="py-3.5 px-6">Warranty</th>
                    <th className="py-3.5 px-6">Serial Prefix</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-orange-50/40 transition-colors">
                      {/* Photo Thumbnail */}
                      <td className="py-3 px-4 text-center">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextElementSibling) {
                                e.currentTarget.nextElementSibling.style.display = 'flex';
                              }
                            }}
                            onClick={() => setPreviewModalImg(p.imageUrl)}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-200 shadow-2xs mx-auto cursor-pointer hover:scale-105 transition-transform"
                            title="Click to view full photo"
                          />
                        ) : null}
                        <div
                          className={`w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 items-center justify-center text-orange-600 font-bold mx-auto text-[10px] ${
                            p.imageUrl ? 'hidden' : 'flex'
                          }`}
                        >
                          <Sun className="w-5 h-5 text-orange-500" />
                        </div>
                      </td>

                      <td className="py-3.5 px-6">
                        <span className="font-bold text-slate-900 block">{p.name}</span>
                        <span className="text-[11px] text-orange-600 font-mono">{p.model}</span>
                      </td>

                      <td className="py-3.5 px-6">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 font-bold text-slate-900">
                        ₹{Number(p.price || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-6">
                        <span className="inline-flex items-center gap-1 font-bold text-orange-800 bg-orange-100/70 px-2.5 py-0.5 rounded-full text-[11px]">
                          <ShieldCheck className="w-3 h-3 text-orange-600" />
                          <span>{p.defaultWarrantyMonths} Months</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-6 font-mono text-slate-600 font-semibold">
                        {p.serialPrefix}
                      </td>

                      <td className="py-3.5 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {p.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right space-x-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit Product & Photo"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {p.active && (
                          <button
                            onClick={() => handleDeactivate(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Deactivate Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Full Image Preview Modal */}
      {previewModalImg && (
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in"
          onClick={() => setPreviewModalImg(null)}
        >
          <div
            className="bg-white rounded-3xl p-4 max-w-xl w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">Product Photo Preview</span>
              <button
                onClick={() => setPreviewModalImg(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3">
              <img
                src={previewModalImg}
                alt="Full preview"
                className="w-full max-h-[70vh] object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

