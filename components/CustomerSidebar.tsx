'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  QrCode,
  FileCheck,
  User,
  HelpCircle,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export default function CustomerSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/customer/request', label: 'Request Warranty', icon: QrCode },
    { href: '/customer/warranties', label: 'My Warranties', icon: FileCheck },
    { href: '/customer/profile', label: 'Profile', icon: User },
    { href: '/customer/support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">E-Warranty</span>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-5 border-t border-slate-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
