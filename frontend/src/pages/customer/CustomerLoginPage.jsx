import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { authApi } from '../../utils/api';
import { setCustomerAuth } from '../../utils/auth';
import { User, Lock, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export default function CustomerLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('rahul@gmail.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authApi.login({
        email,
        password,
        role: 'CUSTOMER',
      });

      if (res.data && res.data.success) {
        setCustomerAuth(res.data.user, res.data.token);
        navigate('/customer/dashboard');
      } else {
        setError(res.data.message || 'Login failed. Please verify email and password.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend failed or invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm max-w-md w-full">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-brand-600 border border-amber-100 flex items-center justify-center mb-4">
            <User className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-black text-slate-900">Orange Solar Customer Login</h1>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Access your registered solar products, request warranty claims, and inspect live timelines.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In as Customer'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Demo Fill */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Wireframe Demo Account
            </span>
            <button
              type="button"
              onClick={() => {
                setEmail('rahul@gmail.com');
                setPassword('password123');
              }}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              1-Click Fill: Rahul Sharma (rahul@gmail.com)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
