// Unified authentication utility using sessionStorage & localStorage
const AUTH_SESSION_KEY = 'ewarranty_auth_session';
const CUSTOMER_SESSION_KEY = 'ewarranty_customer_session';
const ADMIN_SESSION_KEY = 'ewarranty_admin_session';

export function getAuth() {
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);
    if (raw) return JSON.parse(raw);
    
    // Fallback checks
    const cust = sessionStorage.getItem(CUSTOMER_SESSION_KEY) || localStorage.getItem(CUSTOMER_SESSION_KEY);
    if (cust) return JSON.parse(cust);
    
    const adm = sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(ADMIN_SESSION_KEY);
    if (adm) return JSON.parse(adm);
    
    return null;
  } catch (e) {
    return null;
  }
}

export function getAuthToken() {
  const auth = getAuth();
  return auth?.token || null;
}

export function getAuthUser() {
  const auth = getAuth();
  return auth?.user || null;
}

export function isAuthenticated() {
  const token = getAuthToken();
  return Boolean(token);
}

export function isAdmin() {
  const user = getAuthUser();
  return user?.role?.toUpperCase() === 'ADMIN';
}

export function isCustomer() {
  const user = getAuthUser();
  return user?.role?.toUpperCase() === 'CUSTOMER';
}

export function setAuth(user, token) {
  const session = { user, token, loggedAt: new Date().toISOString() };
  const serialized = JSON.stringify(session);
  try {
    sessionStorage.setItem(AUTH_SESSION_KEY, serialized);
    localStorage.setItem(AUTH_SESSION_KEY, serialized);
    
    if (user?.role?.toUpperCase() === 'ADMIN') {
      sessionStorage.setItem(ADMIN_SESSION_KEY, serialized);
      localStorage.setItem(ADMIN_SESSION_KEY, serialized);
      sessionStorage.removeItem(CUSTOMER_SESSION_KEY);
      localStorage.removeItem(CUSTOMER_SESSION_KEY);
    } else {
      sessionStorage.setItem(CUSTOMER_SESSION_KEY, serialized);
      localStorage.setItem(CUSTOMER_SESSION_KEY, serialized);
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed to write auth session', e);
  }
}

export function clearAuth() {
  try {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(CUSTOMER_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(CUSTOMER_SESSION_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear auth session', e);
  }
}

// Helpers for customer portal (strictly non-admin)
export function getCustomerAuth() {
  const auth = getAuth();
  if (auth && auth.user && auth.user.role?.toUpperCase() !== 'ADMIN') return auth;
  try {
    const raw = sessionStorage.getItem(CUSTOMER_SESSION_KEY) || localStorage.getItem(CUSTOMER_SESSION_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && parsed.user && parsed.user.role?.toUpperCase() !== 'ADMIN') return parsed;
    return null;
  } catch (e) {
    return null;
  }
}

export function setCustomerAuth(user, token) {
  setAuth({ ...user, role: user?.role || 'CUSTOMER' }, token);
}

export function clearCustomerAuth() {
  clearAuth();
}

// Helpers for admin portal (strictly ADMIN role)
export function getAdminAuth() {
  const auth = getAuth();
  if (auth?.user?.role?.toUpperCase() === 'ADMIN') return auth;
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(ADMIN_SESSION_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.user?.role?.toUpperCase() === 'ADMIN') return parsed;
    return null;
  } catch (e) {
    return null;
  }
}

export function setAdminAuth(user, token) {
  setAuth({ ...user, role: 'ADMIN' }, token);
}

export function clearAdminAuth() {
  clearAuth();
}
