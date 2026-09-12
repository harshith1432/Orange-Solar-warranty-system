import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  PackagePlus,
  Users,
  ShieldCheck,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { clearAdminAuth } from '../utils/auth';
import { warrantiesApi } from '../utils/api';
import AdminBottomNav from './AdminBottomNav';
import OrangeSolarLogo from './OrangeSolarLogo';

export default function AdminSidebar() {
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    warrantiesApi.getStats()
      .then((res) => {
        if (res.data && res.data.pending !== undefined) {
          setPendingCount(res.data.pending);
        }
      })
      .catch((err) => console.error('Error fetching admin stats', err));
  }, [location.pathname]);

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      href: '/admin/requests',
      label: 'Incoming Claims',
      icon: ClipboardList,
      badge: pendingCount,
    },
    { href: '/admin/products', label: 'Product Catalog', icon: PackagePlus },
    { href: '/admin/customers', label: 'Customer 360', icon: Users },
    { href: '/admin/warranties', label: 'Active Warranties', icon: ShieldCheck },
  ];

  return (
    <>
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col justify-between shrink-0 sticky top-16 md:top-[90px] h-[calc(100vh-4rem)] md:h-[calc(100vh-90px)] overflow-y-auto z-30 self-start border-r border-slate-800">
        <div className="p-5">
          {/* Admin Brand Banner */}
          <div className="pb-4 mb-4 border-b border-slate-800 flex flex-col items-start">
            <OrangeSolarLogo variant="white" className="h-8 w-auto mb-1.5" showTagline={true} />
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Central Admin Console</span>
            </div>
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
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
          <button
            onClick={() => {
              clearAdminAuth();
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* Admin Mobile Bottom Navigation */}
      <AdminBottomNav />
    </>
  );
}
