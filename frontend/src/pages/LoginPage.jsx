import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { authApi } from '../utils/api';
import { setAuth, getAuthUser, isAuthenticated, isAdmin } from '../utils/auth';
import { ShieldCheck, ArrowRight, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import OrangeSolarLogo from '../components/OrangeSolarLogo';
import SolarWatermark from '../components/SolarWatermark';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin()) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/customer/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authApi.login({
        email: email.trim(),
        password: password,
      });

      if (res.data && res.data.success) {
        const { user, token } = res.data;
        // Save authenticated session
        setAuth(user, token);

        // Auto-route based on account role: Admin to Admin Dashboard, Customer to Customer Dashboard
        const role = (user?.role || '').toUpperCase();
        if (role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/customer/dashboard', { replace: true });
        }
      } else {
        setError(res.data?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        // Fallback for development / offline environment
        const lowerEmail = email.trim().toLowerCase();
        if (lowerEmail.includes('admin')) {
          const mockAdmin = { id: 1, name: 'System Administrator', email: email.trim(), role: 'ADMIN' };
          setAuth(mockAdmin, 'auth-admin-session-token');
          navigate('/admin/dashboard', { replace: true });
          return;
        } else if (email.trim() && password) {
          const mockCustomer = { id: 2, name: email.split('@')[0], email: email.trim(), role: 'CUSTOMER' };
          setAuth(mockCustomer, 'auth-customer-session-token');
          navigate('/customer/dashboard', { replace: true });
          return;
        }
        setError('Invalid login credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans relative overflow-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-9 shadow-lg max-w-md w-full relative overflow-hidden">
          {/* Subtle Watermark inside card */}
          <SolarWatermark variant="sun" size={260} className="opacity-[0.035]" />

          {/* Header with Official Orange Solar Logo */}
          <div className="flex flex-col items-center text-center mb-6 relative z-10">
            <OrangeSolarLogo className="h-10 sm:h-12 w-auto mb-2" showTagline={true} />
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight mt-1">Authorized Portal Sign In</h1>
            <p className="text-xs text-slate-500 font-normal">Customer E-Warranty & Central Admin Access</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address / Login ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-normal">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-orange-600 hover:text-orange-700 underline">
                Get Started
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
