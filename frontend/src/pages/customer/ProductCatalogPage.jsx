import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import CustomerSidebar from '../../components/CustomerSidebar';
import CustomerBottomNav from '../../components/CustomerBottomNav';
import ProductPhoto from '../../components/ProductPhoto';
import { productsApi } from '../../utils/api';
import {
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Tag,
  Store,
  Sun,
  Search,
  CheckCircle2,
  Camera
} from 'lucide-react';

export default function ProductCatalogPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    productsApi.getAll()
      .then((res) => {
        if (res.data) setProducts(res.data);
      })
      .catch((err) => console.error('Error loading products', err))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = (product) => {
    navigate('/customer/apply', { state: { selectedProduct: product } });
  };

  const categories = ['ALL', 'Solar Water Heater (ETC)', 'Solar Water Heater (FPC)', 'Heat Pump', 'Solar Rooftop Systems'];

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory || (selectedCategory.includes('ETC') && p.category?.includes('ETC')) || (selectedCategory.includes('FPC') && p.category?.includes('FPC'));
    const matchSearch = !searchTerm.trim() || 
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      <Navbar />

      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        <CustomerSidebar />

        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8 space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
                <Sun className="w-3.5 h-3.5 text-orange-600" />
                <span>Authorized Orange Solar Products</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Choose Your Product</h1>
              <p className="text-xs text-slate-500 mt-1">
                Select your installed Orange Solar water heater or solar power plant to register instant warranty coverage.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search models, Diamond Glass..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-orange-500 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
                    : 'bg-white text-slate-600 hover:bg-orange-50 hover:text-orange-700 border border-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Solar Equipment' : cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400 font-medium">Loading Orange Solar catalog...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No products match your filter</h3>
              <p className="text-xs text-slate-400 mt-1">Try selecting "All Solar Equipment" or clearing your search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Foolproof Product Photo Banner with Fallback & Zero Badging Overlap */}
                    <ProductPhoto
                      imageUrl={p.imageUrl}
                      name={p.name}
                      category={p.category}
                      warrantyMonths={p.defaultWarrantyMonths}
                      className="h-52"
                    />

                    <div className="p-6">
                      {/* Model and Prefix Pills - Clean and Distinct */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-mono font-bold bg-amber-50 text-orange-700 px-2.5 py-1 rounded-lg border border-amber-200/60">
                          {p.model}
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">
                          Prefix: <span className="font-mono text-slate-700 font-bold">{p.serialPrefix || 'OS'}</span>
                        </span>
                      </div>

                      {/* Product Name */}
                      <h3 className="text-base font-black text-slate-900 mb-2 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                        {p.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                        {p.description || 'Authentic Orange Solar system engineered for superior thermal efficiency, corrosion protection, and long lifecycle.'}
                      </p>

                      {/* Recessed Pricing & Source Card */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mb-2">
                        <div className="flex items-baseline justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Retail Price</span>
                          <span className="font-black text-slate-900 text-base tracking-tight">
                            {p.price ? `₹${Number(p.price).toLocaleString('en-IN')}` : 'MRP Contact Dealer'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200/60 text-slate-500">
                          <span>Authorized Source</span>
                          <span className="font-semibold text-slate-700 truncate max-w-[170px]" title={p.storeName}>
                            {p.storeName || 'Orange Solar Authorized Depot'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => handleApply(p)}
                      className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 flex items-center justify-center gap-2 transition-all transform group-hover:translate-y-[-1px]"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Select for E-Warranty</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <CustomerBottomNav />
    </div>
  );
}
