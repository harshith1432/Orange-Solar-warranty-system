import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import CustomerSidebar from '../../components/CustomerSidebar';
import CustomerBottomNav from '../../components/CustomerBottomNav';
import { getCustomerAuth, setCustomerAuth } from '../../utils/auth';
import { warrantiesApi, customersApi } from '../../utils/api';
import { 
  User, Phone, Mail, MapPin, ShieldCheck, ShoppingBag, CreditCard, 
  ArrowRight, Edit3, Save, X, CheckCircle2, AlertCircle, Loader2, Lock
} from 'lucide-react';

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const session = getCustomerAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Local user state initialized from session
  const [currentUser, setCurrentUser] = useState(session?.user || null);
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    age: '',
    address: ''
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: '' }

  useEffect(() => {
    if (session?.user) {
      setCurrentUser(session.user);
      setEditForm({
        name: session.user.name || '',
        age: session.user.age ? String(session.user.age) : '',
        address: session.user.address || ''
      });
    }
  }, []);

  useEffect(() => {
    if (!session || !currentUser) {
      return;
    }

    warrantiesApi.getUserRequests(currentUser.id)
      .then((res) => {
        if (res.data) setRequests(res.data);
      })
      .catch((err) => console.error('Error fetching user warranties for profile', err))
      .finally(() => setLoading(false));
  }, [currentUser?.id]);

  if (!session || !currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans items-center justify-center p-6 text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xs">
          <ShieldCheck className="w-12 h-12 text-orange-500 mx-auto mb-3" />
          <h2 className="text-lg font-black text-slate-900 mb-1">Sign In Required</h2>
          <p className="text-xs text-slate-500 mb-6">Please sign in to view your customer profile.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleStartEdit = () => {
    setEditForm({
      name: currentUser.name || '',
      age: currentUser.age ? String(currentUser.age) : '',
      address: currentUser.address || ''
    });
    setFeedback(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: currentUser.name || '',
      age: currentUser.age ? String(currentUser.age) : '',
      address: currentUser.address || ''
    });
    setIsEditing(false);
    setFeedback(null);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setFeedback({ type: 'error', message: 'Full name cannot be empty.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const payload = {
        name: editForm.name.trim(),
        age: editForm.age ? parseInt(editForm.age, 10) : null,
        address: editForm.address.trim()
      };

      const res = await customersApi.updateProfile(currentUser.id, payload);
      
      if (res.data) {
        const updatedUser = {
          ...currentUser,
          name: res.data.name ?? payload.name,
          age: res.data.age ?? payload.age,
          address: res.data.address ?? payload.address
        };

        // Update local state
        setCurrentUser(updatedUser);

        // Update stored session so navbar, sidebar, etc. get the new name
        setCustomerAuth(updatedUser, session.token);

        setFeedback({ type: 'success', message: 'Profile details updated successfully!' });
        setIsEditing(false);

        // Clear feedback after 4 seconds
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.error || 'Failed to save changes. Please try again.'
      });
    } finally {
      setSaving(false);
    }
  };

  // Calculate real metrics from database records
  const totalSystems = requests.length;
  const totalSpent = requests.reduce((sum, r) => sum + (Number(r.purchasePrice) || 0), 0);

  // Format member since date
  const memberDate = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : 'Recent';

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      <Navbar />

      <div className="flex-1 flex w-full min-h-0 overflow-hidden">
        <CustomerSidebar />

        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8 space-y-6 sm:space-y-8">
          <div className="max-w-3xl space-y-6">
            
            {/* Header with Edit Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Customer Profile</h1>
                <p className="text-xs text-slate-500 mt-1">Verified account and contact details for warranty claims</p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Feedback Alert */}
            {feedback && (
              <div
                className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span className="text-xs font-semibold">{feedback.message}</span>
              </div>
            )}

            {/* Profile Card / Form */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              
              {/* Header Info */}
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-500/20">
                  {currentUser.name ? currentUser.name.split(' ').map((n) => n[0]).join('') : 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{currentUser.name}</h2>
                  <span className="text-xs text-slate-400">Orange Solar Customer since {memberDate}</span>
                </div>
              </div>

              {isEditing ? (
                /* EDIT FORM */
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="text-slate-700 font-bold block mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className="text-slate-700 font-bold block mb-1.5">
                        Age
                      </label>
                      <input
                        type="number"
                        min="18"
                        max="120"
                        value={editForm.age}
                        onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                        placeholder="e.g. 42"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      />
                    </div>

                    {/* Account Status (Locked) */}
                    <div>
                      <label className="text-slate-400 font-bold block mb-1.5 flex items-center justify-between">
                        <span>Account Status</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-normal">
                          <Lock className="w-3 h-3" /> System Managed
                        </span>
                      </label>
                      <div className="px-3.5 py-2.5 bg-slate-100/70 border border-slate-200 rounded-xl text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                        Verified Customer
                      </div>
                    </div>

                    {/* Phone Number (Read-only / Security) */}
                    <div>
                      <label className="text-slate-400 font-bold block mb-1.5 flex items-center justify-between">
                        <span>Phone Number</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-normal">
                          <Lock className="w-3 h-3" /> Login ID
                        </span>
                      </label>
                      <input
                        type="text"
                        disabled
                        value={currentUser.phone || 'Not provided'}
                        className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Email Address (Read-only / Security) */}
                    <div>
                      <label className="text-slate-400 font-bold block mb-1.5 flex items-center justify-between">
                        <span>Email Address</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-normal">
                          <Lock className="w-3 h-3" /> Login ID
                        </span>
                      </label>
                      <input
                        type="text"
                        disabled
                        value={currentUser.email || 'Not provided'}
                        className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Installation / Residential Address */}
                    <div className="sm:col-span-2">
                      <label className="text-slate-700 font-bold block mb-1.5">
                        Installation / Residential Address
                      </label>
                      <textarea
                        rows="3"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        placeholder="House / Flat No, Street, Landmark, Area, City, Pincode"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* READ-ONLY VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block mb-1">Phone Number</span>
                    <span className="text-sm font-bold text-slate-900">{currentUser.phone || 'Not provided'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block mb-1">Email Address</span>
                    <span className="text-sm font-bold text-slate-900">{currentUser.email || 'Not provided'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block mb-1">Age</span>
                    <span className="text-sm font-bold text-slate-900">
                      {currentUser.age ? `${currentUser.age} Years` : 'Not provided'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block mb-1">Account Status</span>
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      Verified Customer
                    </span>
                  </div>

                  <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block mb-1">Installation / Residential Address</span>
                    <span className="text-sm font-medium text-slate-800">{currentUser.address || 'Address not provided'}</span>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <span className="text-orange-700 font-bold block mb-1">Total Solar Systems</span>
                    <span className="text-lg font-black text-orange-950">{totalSystems} {totalSystems === 1 ? 'System' : 'Systems'}</span>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <span className="text-emerald-600 font-bold block mb-1">Total Investment</span>
                    <span className="text-lg font-black text-emerald-900">
                      ₹{totalSpent.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              {totalSystems === 0 && !isEditing && (
                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">No Solar Systems Registered Yet</span>
                    <p className="text-[11px] text-slate-500">Request an e-warranty for your installed solar water heater or rooftop plant.</p>
                  </div>
                  <Link
                    to="/customer/apply"
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 shrink-0"
                  >
                    <span>Request Warranty</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <CustomerBottomNav />
    </div>
  );
}

