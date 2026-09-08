'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CustomerSidebar from '@/components/CustomerSidebar';
import { getCustomer } from '@/lib/storage';
import { User } from '@/lib/types';
import { User as UserIcon, Phone, Mail, MapPin, ShieldCheck, Check } from 'lucide-react';

export default function CustomerProfilePage() {
  const [customer, setCustomer] = useState<User | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCustomer(getCustomer());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (customer && typeof window !== 'undefined') {
      localStorage.setItem('ewarranty_customer', JSON.stringify(customer));
      window.dispatchEvent(new Event('storage-update'));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (!customer) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <CustomerSidebar />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-black text-slate-900 mb-1">Customer Profile</h1>
            <p className="text-xs text-slate-500 mb-6">Manage your contact details and registered identity information.</p>

            {saved && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  RS
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{customer.name}</h2>
                  <p className="text-xs text-slate-500">Member since {customer.memberSince}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Aadhaar / ID Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value={customer.aadharNumber || 'XXXX XXXX 5678'}
                    className="w-full px-4 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Address
                  </label>
                  <textarea
                    value={customer.address || ''}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none h-20"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
