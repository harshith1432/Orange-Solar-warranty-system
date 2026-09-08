'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  ShieldCheck,
  BarChart3,
  Settings,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { getRequests } from '@/lib/storage';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

  const updateCount = () => {
    const reqs = getRequests();
    setPendingCount(reqs.filter((r) => r.status === 'Pending').length);
  };

  useEffect(() => {
    updateCount();
    window.addEventListener('storage-update', updateCount);
    return () => window.removeEventListener('storage-update', updateCount);
  }, []);

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      href: '/admin/requests',
      label: 'Requests',
      icon: ClipboardList,
      badge: pendingCount,
    },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/warranties', label: 'Warranties', icon: ShieldCheck },
    { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-6 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="font-black text-white tracking-tight">E-Warranty Admin</span>
            <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Staff Console</span>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-5 border-t border-slate-800/80">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
