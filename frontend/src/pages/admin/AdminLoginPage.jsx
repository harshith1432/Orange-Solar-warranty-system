import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { authApi } from '../../utils/api';
import { setAdminAuth } from '../../utils/auth';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@ewarranty.com');
  const [password, setPassword] = useState('admin123');
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
        role: 'ADMIN',
      });

      if (res.data && res.data.success) {
        setAdminAuth(res.data.user, res.data.token);
        navigate('/admin/dashboard');
      } else {
        setError(res.data.message || 'Invalid administrator credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend failed or unauthorized access.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-8 sm:p-10 shadow-2xl max-w-md w-full">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-black text-white">Admin Console Login</h1>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Authorized personnel login for warranty verification, product catalog management, and notification dispatch.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Staff Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span>{loading ? 'Authenticating Staff...' : 'Sign In as Administrator'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/60 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@ewarranty.com');
                setPassword('admin123');
              }}
              className="w-full py-2 px-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              1-Click Fill: System Admin (admin@ewarranty.com)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
