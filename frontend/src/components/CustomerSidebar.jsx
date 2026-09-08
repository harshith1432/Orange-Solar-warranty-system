import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  QrCode,
  FileCheck,
  User,
  LogOut,
} from 'lucide-react';
import { clearCustomerAuth } from '../utils/auth';

export default function CustomerSidebar() {
  const location = useLocation();

  const links = [
    { href: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/customer/products', label: 'Choose Product', icon: ShoppingBag },
    { href: '/customer/apply', label: 'Request Warranty', icon: QrCode },
    { href: '/customer/warranties', label: 'My Warranties', icon: FileCheck },
    { href: '/customer/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col justify-between shrink-0 sticky top-16 md:top-[90px] h-[calc(100vh-4rem)] md:h-[calc(100vh-90px)] overflow-y-auto z-30 self-start">
      <div className="p-5">

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200/60 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-5 border-t border-slate-100">
        <button
          onClick={() => {
            clearCustomerAuth();
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
