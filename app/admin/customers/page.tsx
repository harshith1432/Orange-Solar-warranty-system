'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AdminSidebar from '@/components/AdminSidebar';
import { getCustomer, getCustomerPurchases, getCertificates } from '@/lib/storage';
import { User, PurchaseItem, WarrantyCertificate } from '@/lib/types';
import {
  Search,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

function CustomerSearchContent() {
  const searchParams = useSearchParams();
  const initialPhone = searchParams.get('search') || '9876543210';

  const [inputPhone, setInputPhone] = useState(initialPhone);
  const [searchedCustomer, setSearchedCustomer] = useState<User | null>(null);
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [certificates, setCertificates] = useState<WarrantyCertificate[]>([]);

  useEffect(() => {
    // Default load Rahul Sharma
    const cust = getCustomer();
    setSearchedCustomer(cust);
    setPurchases(getCustomerPurchases());
    setCertificates(getCertificates());
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = getCustomer();
    // In our prototype, searching phone returns Rahul Sharma's 360 profile
    if (inputPhone.trim().includes('9876543210') || inputPhone.trim().toLowerCase().includes('rahul')) {
      setSearchedCustomer(cust);
      setPurchases(getCustomerPurchases());
    } else {
      // Return simulated customer with input phone
      setSearchedCustomer({
        ...cust,
        phone: inputPhone,
        name: 'Verified Customer',
        email: `customer_${inputPhone.slice(-4)}@example.com`,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Customer 360 & Purchase History</h1>
        <p className="text-xs text-slate-500 mt-1">
          Search customer by contact number to inspect identity, loyalty stats, and purchase logs.
        </p>
      </div>

      {/* Search Bar - Matching Screen 9 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputPhone}
              onChange={(e) => setInputPhone(e.target.value)}
              placeholder="Enter Phone Number (e.g. 9876543210)"
              className="w-full pl-9 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-600 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>
      </div>

      {searchedCustomer && (
        <div className="space-y-8">
          {/* Customer Details Card - Matching Screen 9 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <UserIcon className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">{searchedCustomer.name}</h2>
                <p className="text-xs text-slate-400">Verified Consumer Account</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Phone Number</span>
                <span className="text-sm font-bold text-slate-900">{searchedCustomer.phone}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Email Address</span>
                <span className="text-sm font-bold text-slate-900 truncate block">{searchedCustomer.email}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Age</span>
                <span className="text-sm font-bold text-slate-900">{searchedCustomer.age} Years</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Aadhar Number</span>
                <span className="text-sm font-mono font-bold text-slate-900">{searchedCustomer.aadharNumber}</span>
              </div>

              <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Residential Address</span>
                <span className="text-sm font-semibold text-slate-800">{searchedCustomer.address}</span>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                <span className="text-blue-600 font-semibold block mb-1">Total Purchases</span>
                <span className="text-base font-black text-blue-900">{searchedCustomer.totalPurchases} Orders</span>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                <span className="text-emerald-600 font-semibold block mb-1">Total Spent</span>
                <span className="text-base font-black text-emerald-900">
                  ₹{searchedCustomer.totalSpent?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Purchase History Table - Matching Screen 9 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Purchase History</h3>
              <span className="text-xs text-slate-500 font-semibold">{purchases.length} Items Found</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3.5 px-6">Product</th>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Price</th>
                    <th className="py-3.5 px-6">Discount</th>
                    <th className="py-3.5 px-6">Amount</th>
                    <th className="py-3.5 px-6 text-right">Warranty Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {purchases.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-900 block">{item.product}</span>
                        <span className="text-[11px] text-slate-400">{item.model} • {item.serialNumber}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">{item.date}</td>
                      <td className="py-4 px-6 font-medium">₹{item.price.toLocaleString('en-IN')}</td>
                      <td className="py-4 px-6 text-emerald-600 font-medium">
                        ₹{item.discount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {item.hasWarranty ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Covered</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                            <span>Not Claimed</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCustomersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AdminSidebar />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <Suspense fallback={<div>Loading customer records...</div>}>
            <CustomerSearchContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
