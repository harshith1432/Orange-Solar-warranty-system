import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LogOut,
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  ClipboardList,
  PackagePlus,
  Users,
} from 'lucide-react';
import { getAuthUser, isAuthenticated, clearAuth, isAdmin } from '../utils/auth';
import OrangeSolarLogo from './OrangeSolarLogo';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const loggedIn = isAuthenticated();
  const user = getAuthUser();
  const isAdministrator = isAdmin();

  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);

  useEffect(() => {
    setAdminDrawerOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { href: '/admin/requests', label: 'Incoming Claims', icon: ClipboardList },
    { href: '/admin/products', label: 'Product Catalog', icon: PackagePlus },
    { href: '/admin/customers', label: 'Customer 360', icon: Users },
    { href: '/admin/warranties', label: 'Active Warranties', icon: ShieldCheck },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50 shadow-xs">
      {/* Top mini-bar matching orangesolar.co.in (desktop only) */}
      <div className="hidden md:block bg-slate-900 text-slate-300 text-[11px] py-1 px-4 border-b border-slate-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span>📞 Helpline: <strong className="text-orange-400">+91 97400 97000</strong></span>
            <span>✉️ <a href="mailto:info@sunzonesolar.in" className="hover:text-white">info@sunzonesolar.in</a></span>
            <span>🕒 Mon - Sat: 9:00 am - 6:00 pm</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Bangalore, Karnataka • ISO 9001:2015 Certified</span>
            <a href="https://orangesolar.co.in" target="_blank" rel="noreferrer" className="text-orange-400 hover:text-orange-300 font-semibold underline">
              orangesolar.co.in ↗
            </a>
          </div>
        </div>
      </div>

      <div className="w-full px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: 3-line menu for Admin on mobile + Brand */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink min-w-0">
          {loggedIn && isAdministrator && (
            <button
              onClick={() => setAdminDrawerOpen((prev) => !prev)}
              className="md:hidden p-1.5 -ml-1 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 active:scale-95 shrink-0 transition-all flex items-center justify-center"
              aria-label="Open Admin Menu"
              title="Admin Menu"
            >
              {adminDrawerOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* Brand Logo matching Sun Zone Orange Solar Official Guidelines */}
          <Link to="/" className="flex items-center gap-2 group shrink min-w-0">
            <div className="h-9 sm:h-10 py-0.5 flex items-center">
              <OrangeSolarLogo className="h-8 sm:h-9 w-auto group-hover:scale-[1.02] transition-transform duration-200" />
            </div>
            <span className="hidden lg:inline-flex items-center text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-orange-100/90 text-orange-800 border border-orange-200/80 whitespace-nowrap shadow-2xs">
              E-Warranty
            </span>
          </Link>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {!loggedIn ? (
            <>
              {/* Login Button */}
              <Link
                to="/login"
                className="text-xs font-bold text-slate-700 hover:text-slate-900 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl hover:bg-slate-100 border border-slate-200 shadow-2xs transition-all whitespace-nowrap"
              >
                Login
              </Link>

              {/* Get Started Button */}
              <Link
                to="/register"
                className="text-xs font-bold btn-supreme px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center gap-1 sm:gap-1.5 transition-all whitespace-nowrap"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
              </Link>
            </>
          ) : (
            <>
              {/* User badge - Clickable Link (Compact on mobile) */}
              <Link
                to={isAdministrator ? '/admin/dashboard' : '/customer/profile'}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-orange-50/70 hover:bg-orange-100/90 border border-orange-200/80 hover:border-orange-300 transition-all cursor-pointer group shadow-2xs"
                title={isAdministrator ? 'Open Admin Dashboard' : 'View Customer Profile'}
              >
                <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 group-hover:bg-orange-600 group-hover:text-white transition-colors flex items-center justify-center text-xs font-bold shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden xs:block sm:block max-w-[110px] sm:max-w-none">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-orange-950 transition-colors leading-none truncate">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-[10px] text-orange-600 font-medium capitalize mt-0.5">
                    {isAdministrator ? 'Administrator' : 'Customer'}
                  </div>
                </div>
              </Link>

              {/* Direct Logout Button for both Mobile & Desktop */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center p-2 sm:p-2 rounded-xl text-rose-600 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/80 transition-all cursor-pointer active:scale-95 shadow-2xs shrink-0"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-4.5 h-4.5 sm:w-4 sm:h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Admin Mobile Slide-out Drawer Menu (Rendered via React Portal directly into body) */}
      {adminDrawerOpen && isAdministrator && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-xs flex animate-in fade-in duration-200"
          onClick={() => setAdminDrawerOpen(false)}
        >
          <div
            className="bg-slate-900 text-slate-200 w-4/5 max-w-xs h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-5 border-r border-slate-800 animate-in slide-in-from-left duration-200 z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <OrangeSolarLogo variant="white" className="h-7 w-auto" />
                </div>
                <button
                  onClick={() => setAdminDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Close Admin Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Options */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
                  Navigation Menu
                </span>
                {adminLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setAdminDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Logout Action in Drawer */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setAdminDrawerOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-400 bg-rose-950/40 hover:bg-rose-900/50 rounded-xl border border-rose-800/50 transition-colors cursor-pointer active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Admin</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
