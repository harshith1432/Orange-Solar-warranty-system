import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  FileCheck,
  User,
} from 'lucide-react';

export default function CustomerBottomNav() {
  const location = useLocation();

  const navItems = [
    {
      href: '/customer/dashboard',
      label: 'Home',
      icon: LayoutDashboard,
    },
    {
      href: '/customer/products',
      label: 'Products',
      icon: ShoppingBag,
    },
    {
      href: '/customer/apply',
      label: 'Request',
      icon: PlusCircle,
      isPrimary: true,
    },
    {
      href: '/customer/warranties',
      label: 'Warranties',
      icon: FileCheck,
    },
    {
      href: '/customer/profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-2 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
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
                className="flex flex-col items-center -mt-5 group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-tr from-orange-600 to-amber-500 shadow-orange-500/40 ring-4 ring-orange-100'
                      : 'bg-gradient-to-tr from-orange-500 to-amber-500 shadow-orange-500/30'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 tracking-tight ${
                    isActive ? 'text-orange-600' : 'text-slate-600'
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
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all active:scale-95 ${
                isActive
                  ? 'text-orange-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-600 rounded-full" />
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
