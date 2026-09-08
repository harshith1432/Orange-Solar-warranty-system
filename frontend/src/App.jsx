import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth } from './utils/auth';

// Public & Unified Auth Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicVerifyPage from './pages/PublicVerifyPage';

// Customer Portal Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ProductCatalogPage from './pages/customer/ProductCatalogPage';
import ApplyWarrantyPage from './pages/customer/ApplyWarrantyPage';
import ApplicationSuccessPage from './pages/customer/ApplicationSuccessPage';
import MyWarrantiesPage from './pages/customer/MyWarrantiesPage';
import CustomerProfilePage from './pages/customer/CustomerProfilePage';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import RequestHistoryPage from './pages/admin/RequestHistoryPage';
import CustomerSearchPage from './pages/admin/CustomerSearchPage';
import AdminWarrantiesPage from './pages/admin/AdminWarrantiesPage';
import NotificationAuditPage from './pages/admin/NotificationAuditPage';

// Route Guards
function ProtectedAdminRoute({ children }) {
  const auth = getAuth();
  const user = auth?.user;
  if (!auth || !user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role?.toUpperCase() !== 'ADMIN') {
    return <Navigate to="/customer/dashboard" replace />;
  }
  return children;
}

function ProtectedCustomerRoute({ children }) {
  const auth = getAuth();
  const user = auth?.user;
  if (!auth || !user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role?.toUpperCase() === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

function RoleDashboardRedirect() {
  const auth = getAuth();
  const user = auth?.user;
  if (!auth || !user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role?.toUpperCase() === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/customer/dashboard" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<HomePage />} />

        {/* Unified Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Smart Dashboard Redirect */}
        <Route path="/dashboard" element={<RoleDashboardRedirect />} />

        {/* Legacy Auth Route Redirects */}
        <Route path="/customer/login" element={<Navigate to="/login" replace />} />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />

        {/* Customer Portal (Protected from Admins & Guests) */}
        <Route path="/customer/dashboard" element={<ProtectedCustomerRoute><CustomerDashboard /></ProtectedCustomerRoute>} />
        <Route path="/customer/products" element={<ProtectedCustomerRoute><ProductCatalogPage /></ProtectedCustomerRoute>} />
        <Route path="/customer/apply" element={<ProtectedCustomerRoute><ApplyWarrantyPage /></ProtectedCustomerRoute>} />
        <Route path="/customer/success" element={<ProtectedCustomerRoute><ApplicationSuccessPage /></ProtectedCustomerRoute>} />
        <Route path="/customer/warranties" element={<ProtectedCustomerRoute><MyWarrantiesPage /></ProtectedCustomerRoute>} />
        <Route path="/customer/profile" element={<ProtectedCustomerRoute><CustomerProfilePage /></ProtectedCustomerRoute>} />

        {/* Admin Portal (Protected from Customers & Guests) */}
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin/products" element={<ProtectedAdminRoute><ProductManagementPage /></ProtectedAdminRoute>} />
        <Route path="/admin/requests" element={<ProtectedAdminRoute><RequestHistoryPage /></ProtectedAdminRoute>} />
        <Route path="/admin/customers" element={<ProtectedAdminRoute><CustomerSearchPage /></ProtectedAdminRoute>} />
        <Route path="/admin/warranties" element={<ProtectedAdminRoute><AdminWarrantiesPage /></ProtectedAdminRoute>} />
        <Route path="/admin/notifications" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Public QR Verification */}
        <Route path="/verify/:certificateNo" element={<PublicVerifyPage />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
