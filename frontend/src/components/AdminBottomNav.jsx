import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  PackagePlus,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { warrantiesApi } from '../utils/api';

export default function AdminBottomNav() {
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    warrantiesApi.getStats()
      .then((res) => {
        if (res.data && res.data.pending !== undefined) {
          setPendingCount(res.data.pending);
        }
      })
      .catch((err) => console.error('Error fetching admin stats for bottom nav', err));
  }, [location.pathname]);

  const navItems = [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/requests',
      label: 'Claims',
      icon: ClipboardList,
      badge: pendingCount,
      isPrimary: true,
    },
    {
      href: '/admin/products',
      label: 'Products',
      icon: PackagePlus,
    },
    {
      href: '/admin/customers',
      label: 'Customers',
      icon: Users,
    },
    {
      href: '/admin/warranties',
      label: 'Warranties',
      icon: ShieldCheck,
    },
  ];

  return (
    <nav
      aria-label="Admin Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.25)] text-slate-300"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex flex-col items-center -mt-5 group relative"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 relative ${
                    isActive
                      ? 'bg-gradient-to-tr from-orange-600 to-amber-500 shadow-orange-500/50 ring-4 ring-slate-900'
                      : 'bg-gradient-to-tr from-orange-500 to-amber-500 shadow-orange-500/30 ring-4 ring-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-slate-900">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 tracking-tight ${
                    isActive ? 'text-orange-400' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-orange-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full" />
                )}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 rounded-full text-[9px] font-black bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
