const fs = require('fs');
const path = require('path');

const files = {};

files['public/index.html'] = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>DriveNow</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

files['src/index.js'] = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);`;

files['src/index.css'] = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&display=swap');
:root {
  --bg: #0d0f14; --bg-card: #141720; --bg-elevated: #1c2030;
  --border: rgba(255,255,255,0.07); --border-hover: rgba(255,255,255,0.14);
  --accent: #e8c547; --accent-dim: rgba(232,197,71,0.12); --accent-glow: rgba(232,197,71,0.25);
  --text-primary: #f0ede8; --text-secondary: #8b8d97; --text-muted: #555868;
  --success: #3ecf8e; --danger: #e85d5d; --warning: #e8a04a; --info: #5b9bd5;
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px; --radius-xl: 24px;
  --font-display: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
  --transition: 180ms ease;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text-primary); font-family: var(--font-body); font-size: 0.95rem; line-height: 1.65; -webkit-font-smoothing: antialiased; min-height: 100vh; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; font-family: inherit; border: none; background: none; }
img { max-width: 100%; display: block; }
input, textarea, select { font-family: inherit; font-size: inherit; color: var(--text-primary); }
h1,h2,h3,h4,h5 { font-family: var(--font-display); font-weight: 700; line-height: 1.2; letter-spacing: -0.02em; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--bg-elevated); border-radius: 3px; }
.card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; }
.btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.55rem 1.25rem; border-radius: var(--radius-md); font-family: var(--font-display); font-weight: 600; font-size: 0.875rem; transition: all var(--transition); white-space: nowrap; }
.btn-primary { background: var(--accent); color: #0d0f14; }
.btn-primary:hover { background: #f0cf5a; box-shadow: 0 0 20px var(--accent-glow); }
.btn-ghost { background: transparent; color: var(--text-secondary); border: 1px solid var(--border); }
.btn-ghost:hover { border-color: var(--border-hover); color: var(--text-primary); }
.btn-danger { background: rgba(232,93,93,0.15); color: var(--danger); border: 1px solid rgba(232,93,93,0.25); }
.btn-danger:hover { background: rgba(232,93,93,0.25); }
.btn-success { background: rgba(62,207,142,0.15); color: var(--success); border: 1px solid rgba(62,207,142,0.25); }
.btn-success:hover { background: rgba(62,207,142,0.25); }
.btn-sm { padding: 0.35rem 0.85rem; font-size: 0.8rem; }
.btn-lg { padding: 0.75rem 2rem; font-size: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-label { font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); letter-spacing: 0.05em; text-transform: uppercase; }
.form-input { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0.65rem 1rem; color: var(--text-primary); transition: border-color var(--transition); outline: none; width: 100%; }
.form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.form-input::placeholder { color: var(--text-muted); }
.form-select { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 0.65rem 1rem; color: var(--text-primary); outline: none; width: 100%; appearance: none; }
.form-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.badge { display: inline-flex; align-items: center; padding: 0.2rem 0.65rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
.badge-pending  { background: rgba(232,160,74,0.15); color: var(--warning); }
.badge-active   { background: rgba(62,207,142,0.15); color: var(--success); }
.badge-rejected { background: rgba(232,93,93,0.15);  color: var(--danger); }
.badge-rented   { background: rgba(91,155,213,0.15); color: var(--info); }
.badge-completed{ background: rgba(62,207,142,0.1);  color: #2ea873; }
.badge-verified { background: rgba(62,207,142,0.15); color: var(--success); }
.badge-info     { background: rgba(91,155,213,0.15); color: var(--info); }
.stars { color: var(--accent); letter-spacing: 2px; font-size: 0.85rem; }
.page-content { flex: 1; padding: 2rem 1.5rem; max-width: 1280px; margin: 0 auto; width: 100%; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap; }
.page-title { font-size: 1.75rem; font-family: var(--font-display); font-weight: 800; }
.grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.25rem; }
.grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; }
.grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.25rem; }
@media(max-width:900px){ .grid-4{grid-template-columns:repeat(2,1fr);} .grid-3{grid-template-columns:repeat(2,1fr);} }
@media(max-width:600px){ .grid-4,.grid-3,.grid-2{grid-template-columns:1fr;} .page-content{padding:1.25rem 1rem;} }
.table-wrap { overflow-x: auto; border-radius: var(--radius-lg); border: 1px solid var(--border); }
table { width: 100%; border-collapse: collapse; }
thead th { background: var(--bg-elevated); padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap; }
tbody td { padding: 0.875rem 1rem; border-top: 1px solid var(--border); font-size: 0.875rem; vertical-align: middle; }
tbody tr:hover td { background: rgba(255,255,255,0.02); }
.spinner { width: 32px; height: 32px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 3rem auto; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { text-align: center; padding: 4rem 2rem; color: var(--text-muted); }
.empty-state h3 { font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fadeUp 0.35s ease both; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.modal { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: 2rem; width: 100%; max-width: 500px; animation: fadeUp 0.25s ease; }
.modal-title { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; margin-bottom: 1.25rem; }`;

files['src/services/api.js'] = `import axios from 'axios';
const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || '/api', timeout: 15000 });
api.interceptors.request.use(config => { const token = localStorage.getItem('token'); if (token) config.headers.Authorization = 'Bearer ' + token; return config; });
api.interceptors.response.use(res => res, err => { if (err.response?.status === 401) { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'; } return Promise.reject(err); });
export const authAPI = { register: d => api.post('/auth/register', d), login: d => api.post('/auth/login', d), me: () => api.get('/auth/me'), changePassword: d => api.put('/auth/change-password', d) };
export const carsAPI = { browse: p => api.get('/cars', { params: p }), detail: id => api.get('/cars/' + id), availability: (id,p) => api.get('/cars/' + id + '/availability', { params: p }) };
export const renterAPI = { getProfile: () => api.get('/renter/profile'), updateProfile: d => api.put('/renter/profile', d, { headers: { 'Content-Type': 'multipart/form-data' } }), uploadLicense: d => api.post('/renter/license', d, { headers: { 'Content-Type': 'multipart/form-data' } }), getLicense: () => api.get('/renter/license'), createRental: d => api.post('/renter/rentals', d), getMyRentals: p => api.get('/renter/rentals', { params: p }), cancelRental: id => api.delete('/renter/rentals/' + id), submitReview: (id,d) => api.post('/renter/rentals/' + id + '/review', d) };
export const ownerAPI = { getMyCars: () => api.get('/owner/cars'), getCarById: id => api.get('/owner/cars/' + id), createCar: d => api.post('/owner/cars', d, { headers: { 'Content-Type': 'multipart/form-data' } }), updateCar: (id,d) => api.put('/owner/cars/' + id, d, { headers: { 'Content-Type': 'multipart/form-data' } }), deleteCar: id => api.delete('/owner/cars/' + id), getAvailability: (id,p) => api.get('/owner/cars/' + id + '/availability', { params: p }), getRentals: p => api.get('/owner/rentals', { params: p }), acceptRental: id => api.put('/owner/rentals/' + id + '/accept'), rejectRental: (id,d) => api.put('/owner/rentals/' + id + '/reject', d), completeRental: id => api.put('/owner/rentals/' + id + '/complete') };
export const adminAPI = { dashboard: () => api.get('/admin/dashboard'), getUsers: p => api.get('/admin/users', { params: p }), approveUser: id => api.put('/admin/users/' + id + '/approve'), rejectUser: (id,d) => api.put('/admin/users/' + id + '/reject', d), deleteUser: id => api.delete('/admin/users/' + id), getCars: p => api.get('/admin/cars', { params: p }), approveCar: id => api.put('/admin/cars/' + id + '/approve'), rejectCar: (id,d) => api.put('/admin/cars/' + id + '/reject', d), deleteCar: id => api.delete('/admin/cars/' + id), getLicenses: p => api.get('/admin/licenses', { params: p }), verifyLicense: id => api.put('/admin/licenses/' + id + '/verify'), rejectLicense: (id,d) => api.put('/admin/licenses/' + id + '/reject', d) };
export default api;`;

files['src/context/AuthContext.jsx'] = `import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } });
  const [token, setToken]   = useState(() => localStorage.getItem('token'));
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return; }
      try { const { data } = await authAPI.me(); setUser(data.data); localStorage.setItem('user', JSON.stringify(data.data)); }
      catch { logout(); }
      finally { setLoading(false); }
    };
    verify();
  }, []); // eslint-disable-line
  useEffect(() => {
    if (!token || !user) { socket?.disconnect(); setSocket(null); return; }
    const s = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', { auth: { token } });
    s.on('account_status_changed', ({ status, reason }) => { if (status === 'active') toast.success('Account approved!'); else toast.error('Account rejected: ' + reason); });
    s.on('car_status_changed', ({ car, status, reason }) => { if (status === 'active') toast.success(car.brand + ' ' + car.model + ' approved!'); else toast.error('Car rejected: ' + reason); });
    s.on('new_rental_request', ({ rental }) => toast('New rental request: ' + rental.start_date + ' to ' + rental.end_date, { icon: '🚗' }));
    s.on('rental_status_changed', ({ status, reason }) => { if (status === 'accepted') toast.success('Rental accepted!'); if (status === 'rejected') toast.error('Rental rejected: ' + reason); if (status === 'completed') toast.success('Rental completed!'); });
    s.on('license_status_changed', ({ status, reason }) => { if (status === 'verified') toast.success('License verified!'); if (status === 'rejected') toast.error('License rejected: ' + reason); });
    s.on('new_pending', ({ type }) => toast('New ' + type + ' pending review', { icon: '🔔' }));
    setSocket(s);
    return () => s.disconnect();
  }, [token]); // eslint-disable-line
  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    const { user: u, token: t } = data.data;
    setUser(u); setToken(t);
    localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('token', t);
    return u;
  }, []);
  const register = useCallback(async (formData) => {
    const { data } = await authAPI.register(formData);
    const { user: u, token: t } = data.data;
    setUser(u); setToken(t);
    localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('token', t);
    return u;
  }, []);
  const logout = useCallback(() => { setUser(null); setToken(null); socket?.disconnect(); localStorage.removeItem('user'); localStorage.removeItem('token'); }, [socket]);
  return <AuthContext.Provider value={{ user, token, socket, loading, login, register, logout, setUser }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be inside AuthProvider'); return ctx; };`;

files['src/App.jsx'] = `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/renter/HomePage';
import CarDetailPage from './pages/renter/CarDetailPage';
import RenterDashboard from './pages/renter/RenterDashboard';
import MyRentalsPage from './pages/renter/MyRentalsPage';
import LicensePage from './pages/renter/LicensePage';
import ProfilePage from './pages/renter/ProfilePage';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import MyCarsPage from './pages/owner/MyCarsPage';
import CarFormPage from './pages/owner/CarFormPage';
import OwnerRentalsPage from './pages/owner/OwnerRentalsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCarsPage from './pages/admin/AdminCarsPage';
import AdminLicensesPage from './pages/admin/AdminLicensesPage';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (user) { if (user.role === 'admin') return <Navigate to="/admin" replace />; if (user.role === 'car_owner') return <Navigate to="/owner" replace />; return <Navigate to="/browse" replace />; }
  return children;
};
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1c2030', color: '#f0ede8', border: '1px solid rgba(255,255,255,0.07)', fontFamily: "'DM Sans', sans-serif" } }} />
        <Routes>
          <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/browse" replace />} />
            <Route path="/browse"   element={<HomePage />} />
            <Route path="/cars/:id" element={<CarDetailPage />} />
            <Route path="/dashboard"  element={<ProtectedRoute roles={['renter']}><RenterDashboard /></ProtectedRoute>} />
            <Route path="/my-rentals" element={<ProtectedRoute roles={['renter']}><MyRentalsPage /></ProtectedRoute>} />
            <Route path="/license"    element={<ProtectedRoute roles={['renter']}><LicensePage /></ProtectedRoute>} />
            <Route path="/profile"    element={<ProtectedRoute roles={['renter']}><ProfilePage /></ProtectedRoute>} />
            <Route path="/owner"               element={<ProtectedRoute roles={['car_owner']}><OwnerDashboard /></ProtectedRoute>} />
            <Route path="/owner/cars"          element={<ProtectedRoute roles={['car_owner']}><MyCarsPage /></ProtectedRoute>} />
            <Route path="/owner/cars/new"      element={<ProtectedRoute roles={['car_owner']}><CarFormPage /></ProtectedRoute>} />
            <Route path="/owner/cars/:id/edit" element={<ProtectedRoute roles={['car_owner']}><CarFormPage /></ProtectedRoute>} />
            <Route path="/owner/rentals"       element={<ProtectedRoute roles={['car_owner']}><OwnerRentalsPage /></ProtectedRoute>} />
            <Route path="/admin"          element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users"    element={<ProtectedRoute roles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
            <Route path="/admin/cars"     element={<ProtectedRoute roles={['admin']}><AdminCarsPage /></ProtectedRoute>} />
            <Route path="/admin/licenses" element={<ProtectedRoute roles={['admin']}><AdminLicensesPage /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/browse" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}`;

files['src/components/layout/AppLayout.jsx'] = `import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './AppLayout.css';
const navConfig = {
  renter:    [{ to:'/browse', label:'Browse Cars' },{ to:'/dashboard', label:'Dashboard' },{ to:'/my-rentals', label:'My Rentals' },{ to:'/license', label:'License' },{ to:'/profile', label:'Profile' }],
  car_owner: [{ to:'/owner', label:'Dashboard' },{ to:'/owner/cars', label:'My Cars' },{ to:'/owner/rentals', label:'Requests' },{ to:'/browse', label:'Browse' }],
  admin:     [{ to:'/admin', label:'Dashboard' },{ to:'/admin/users', label:'Users' },{ to:'/admin/cars', label:'Cars' },{ to:'/admin/licenses', label:'Licenses' }],
};
export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/login'); };
  const links = user ? (navConfig[user.role] || navConfig.renter) : navConfig.renter;
  return (
    <div className="app-layout">
      <header className="navbar">
        <NavLink to="/browse" className="navbar-brand"><span className="brand-icon">◆</span><span className="brand-text">DriveNow</span></NavLink>
        <nav className="navbar-links">{links.map(l => <NavLink key={l.to} to={l.to} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>{l.label}</NavLink>)}</nav>
        <div className="navbar-end">
          {user ? (
            <div className="user-menu">
              <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
              <div className="user-info"><span className="user-name">{user.name}</span><span className={'badge badge-' + (user.role === 'admin' ? 'rejected' : 'active')} style={{ fontSize:'0.65rem' }}>{user.role}</span></div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <NavLink to="/login"    className="btn btn-ghost btn-sm">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">Register</NavLink>
            </div>
          )}
        </div>
      </header>
      <main className="main-content"><Outlet /></main>
    </div>
  );
}`;

files['src/components/layout/AppLayout.css'] = `.app-layout { display: flex; flex-direction: column; min-height: 100vh; }
.navbar { height: 60px; display: flex; align-items: center; padding: 0 2rem; gap: 2rem; background: rgba(13,15,20,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
.navbar-brand { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
.brand-icon { color: var(--accent); font-size: 1.1rem; }
.brand-text { font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; letter-spacing: -0.03em; }
.navbar-links { display: flex; align-items: center; gap: 0.25rem; flex: 1; }
.nav-link { padding: 0.4rem 0.85rem; border-radius: var(--radius-md); font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); transition: all var(--transition); }
.nav-link:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); }
.nav-link.active { color: var(--accent); background: var(--accent-dim); }
.navbar-end { display: flex; align-items: center; gap: 1rem; flex-shrink: 0; }
.user-menu { display: flex; align-items: center; gap: 0.75rem; }
.user-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--accent-dim); border: 1px solid var(--accent); color: var(--accent); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 700; font-size: 0.8rem; flex-shrink: 0; }
.user-info { display: flex; flex-direction: column; gap: 0.1rem; }
.user-name { font-size: 0.825rem; font-weight: 500; line-height: 1; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.main-content { flex: 1; }
@media(max-width:768px){ .navbar{ padding:0 1rem; gap:1rem; } .navbar-links{ display:none; } .user-info{ display:none; } }`;

files['src/components/common/CarCard.jsx'] = `import { Link } from 'react-router-dom';
import './CarCard.css';
const stars = n => { if (!n) return null; const r = Math.round(parseFloat(n)); return '\u2605'.repeat(r) + '\u2606'.repeat(5-r); };
export default function CarCard({ car }) {
  const img = car.images?.[0] ? (process.env.REACT_APP_API_URL?.replace('/api','') || '') + '/' + car.images[0] : null;
  return (
    <Link to={'/cars/' + car.id} className="car-card">
      <div className="car-card-img">
        {img ? <img src={img} alt={car.brand + ' ' + car.model} /> : <div className="car-card-no-img">◆</div>}
        <div className="car-card-price">{car.price_per_day} EGP<span>/day</span></div>
      </div>
      <div className="car-card-body">
        <h3 className="car-card-title">{car.brand} {car.model} <span className="car-year">'{String(car.year).slice(-2)}</span></h3>
        <p className="car-card-location">{car.location}</p>
        <div className="car-card-tags"><span className="car-tag">{car.seats} seats</span><span className="car-tag">{car.transmission}</span><span className="car-tag">{car.fuel_type}</span></div>
        {car.avg_rating && <div className="car-card-rating"><span className="stars" style={{ fontSize:'0.75rem' }}>{stars(car.avg_rating)}</span><span style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{car.avg_rating} ({car.reviews_count})</span></div>}
      </div>
    </Link>
  );
}`;

files['src/components/common/CarCard.css'] = `.car-card { display:flex; flex-direction:column; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; transition:all 0.22s ease; color:inherit; }
.car-card:hover { border-color:var(--border-hover); transform:translateY(-3px); box-shadow:0 4px 16px rgba(0,0,0,0.5); }
.car-card-img { position:relative; aspect-ratio:16/9; background:var(--bg-elevated); overflow:hidden; }
.car-card-img img { width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease; }
.car-card:hover .car-card-img img { transform:scale(1.04); }
.car-card-no-img { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:2.5rem; color:var(--text-muted); opacity:0.3; }
.car-card-price { position:absolute; bottom:0.75rem; right:0.75rem; background:rgba(13,15,20,0.85); backdrop-filter:blur(8px); border:1px solid var(--border); border-radius:var(--radius-md); padding:0.3rem 0.75rem; font-family:var(--font-display); font-weight:700; font-size:0.95rem; color:var(--accent); }
.car-card-price span { font-size:0.7rem; font-weight:400; color:var(--text-secondary); }
.car-card-body { padding:1rem; display:flex; flex-direction:column; gap:0.45rem; }
.car-card-title { font-size:1rem; font-weight:700; font-family:var(--font-display); letter-spacing:-0.01em; }
.car-year { color:var(--text-muted); font-size:0.85rem; font-weight:400; }
.car-card-location { font-size:0.8rem; color:var(--text-secondary); }
.car-card-tags { display:flex; flex-wrap:wrap; gap:0.35rem; }
.car-tag { font-size:0.72rem; padding:0.2rem 0.55rem; border-radius:20px; background:var(--bg-elevated); border:1px solid var(--border); color:var(--text-secondary); }
.car-card-rating { display:flex; align-items:center; gap:0.4rem; margin-top:0.1rem; }`;

files['src/pages/auth/AuthPages.css'] = `.auth-page { min-height:100vh; display:grid; grid-template-columns:1fr 480px; background:var(--bg); }
.auth-bg { position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; background:var(--bg-card); border-right:1px solid var(--border); }
.auth-bg-text { font-family:var(--font-display); font-size:clamp(6rem,15vw,14rem); font-weight:800; color:var(--accent); opacity:0.06; letter-spacing:-0.05em; user-select:none; }
.auth-card { display:flex; flex-direction:column; justify-content:center; padding:3rem 2.5rem; }
.auth-title { font-size:1.75rem; font-weight:800; margin-bottom:0.4rem; }
.auth-sub { color:var(--text-secondary); font-size:0.9rem; margin-bottom:2rem; }
.auth-form { display:flex; flex-direction:column; gap:1rem; }
.auth-submit { width:100%; justify-content:center; margin-top:0.5rem; }
.auth-switch { text-align:center; margin-top:1.5rem; font-size:0.875rem; color:var(--text-secondary); }
.auth-switch a { color:var(--accent); font-weight:600; }
.role-toggle { display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; }
.role-btn { padding:0.65rem; border-radius:var(--radius-md); border:1px solid var(--border); background:var(--bg-elevated); color:var(--text-secondary); font-family:var(--font-display); font-weight:600; font-size:0.875rem; transition:all var(--transition); }
.role-btn:hover { border-color:var(--border-hover); color:var(--text-primary); }
.role-btn.active { background:var(--accent-dim); border-color:var(--accent); color:var(--accent); }
@media(max-width:768px){ .auth-page{grid-template-columns:1fr;} .auth-bg{display:none;} .auth-card{padding:2rem 1.5rem;} }`;

files['src/pages/auth/LoginPage.jsx'] = `import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';
export default function LoginPage() {
  const { login } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' }); const [loading, setLoading] = useState(false);
  const handleSubmit = async e => { e.preventDefault(); setLoading(true); try { const user = await login(form.email, form.password); toast.success('Welcome back, ' + user.name + '!'); if (user.role === 'admin') navigate('/admin'); else if (user.role === 'car_owner') navigate('/owner'); else navigate('/browse'); } catch(err) { toast.error(err.response?.data?.message || 'Login failed'); } finally { setLoading(false); } };
  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-bg-text">DRIVE</div></div>
      <div className="auth-card fade-up">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'2.5rem', fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.3rem' }}>◆ DriveNow</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required /></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required /></div>
          <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}`;

files['src/pages/auth/RegisterPage.jsx'] = `import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';
export default function RegisterPage() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', role:'renter' }); const [loading, setLoading] = useState(false);
  const handleSubmit = async e => { e.preventDefault(); if (form.password.length < 8) { toast.error('Password min 8 chars'); return; } setLoading(true); try { const fd = new FormData(); Object.entries(form).forEach(([k,v]) => fd.append(k,v)); const user = await register(fd); toast.success('Welcome, ' + user.name + '!'); navigate('/browse'); } catch(err) { toast.error(err.response?.data?.message || 'Registration failed'); } finally { setLoading(false); } };
  return (
    <div className="auth-page">
      <div className="auth-bg"><div className="auth-bg-text">JOIN</div></div>
      <div className="auth-card fade-up">
        <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1.3rem', marginBottom:'2rem' }}>◆ DriveNow</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join as renter or car owner</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Ahmed Mohamed" value={form.name} onChange={e => setForm({...form,name:e.target.value})} required /></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})} required /></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+20 1xx xxxx xxxx" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Min 8 characters" value={form.password} onChange={e => setForm({...form,password:e.target.value})} required /></div>
          <div className="form-group"><label className="form-label">I want to</label><div className="role-toggle"><button type="button" className={'role-btn' + (form.role==='renter'?' active':'')} onClick={() => setForm({...form,role:'renter'})}>Rent Cars</button><button type="button" className={'role-btn' + (form.role==='car_owner'?' active':'')} onClick={() => setForm({...form,role:'car_owner'})}>List My Car</button></div></div>
          <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}`;

files['src/pages/renter/HomePage.jsx'] = `import { useState, useEffect, useCallback } from 'react';
import { carsAPI } from '../../services/api';
import CarCard from '../../components/common/CarCard';
import './HomePage.css';
const init = { brand:'', location:'', min_price:'', max_price:'', transmission:'', start_date:'', end_date:'', sort:'newest' };
export default function HomePage() {
  const [cars,setCars]=useState([]); const [filters,setFilters]=useState(init); const [loading,setLoading]=useState(true); const [page,setPage]=useState(1); const [total,setTotal]=useState(0);
  const fetchCars = useCallback(async(p=1,f=filters) => { setLoading(true); try { const params={...f,page:p,limit:12}; Object.keys(params).forEach(k=>{ if(!params[k]) delete params[k]; }); const {data}=await carsAPI.browse(params); setCars(data.data); setTotal(data.pagination.total); } catch { setCars([]); } finally { setLoading(false); } },[]);// eslint-disable-line
  useEffect(()=>{ fetchCars(1,init); },[]);// eslint-disable-line
  const upd = k => e => setFilters(f=>({...f,[k]:e.target.value}));
  return (
    <div className="home-page">
      <div className="hero"><div className="hero-content"><p className="hero-eyebrow">Find Your Ride</p><h1 className="hero-title">Drive Any Car,<br/>Any Day</h1><p className="hero-sub">Browse verified cars from trusted owners across Egypt.</p></div><div className="hero-accent">◆</div></div>
      <div className="filter-bar-wrap">
        <form className="filter-bar" onSubmit={e=>{e.preventDefault();setPage(1);fetchCars(1,filters);}}>
          <input className="form-input filter-input" placeholder="Brand..." value={filters.brand} onChange={upd('brand')} />
          <input className="form-input filter-input" placeholder="Location..." value={filters.location} onChange={upd('location')} />
          <input className="form-input filter-input" placeholder="Min price" type="number" value={filters.min_price} onChange={upd('min_price')} />
          <input className="form-input filter-input" placeholder="Max price" type="number" value={filters.max_price} onChange={upd('max_price')} />
          <select className="form-select filter-input" value={filters.transmission} onChange={upd('transmission')}><option value="">Transmission</option><option value="automatic">Automatic</option><option value="manual">Manual</option></select>
          <input className="form-input filter-input" type="date" value={filters.start_date} onChange={upd('start_date')} />
          <input className="form-input filter-input" type="date" value={filters.end_date} onChange={upd('end_date')} />
          <select className="form-select filter-input" value={filters.sort} onChange={upd('sort')}><option value="newest">Newest</option><option value="price_asc">Price ↑</option><option value="price_desc">Price ↓</option></select>
          <button className="btn btn-primary" type="submit">Search</button>
          <button className="btn btn-ghost" type="button" onClick={()=>{setFilters(init);setPage(1);fetchCars(1,init);}}>Reset</button>
        </form>
      </div>
      <div className="page-content">
        <div style={{marginBottom:'1rem',color:'var(--text-secondary)',fontSize:'0.875rem'}}>{loading?'Loading...':total+' cars found'}</div>
        {loading ? <div className="spinner"/> : cars.length===0 ? <div className="empty-state"><h3>No cars found</h3><p>Try adjusting your filters</p></div> : <div className="grid-4 fade-up">{cars.map(car=><CarCard key={car.id} car={car}/>)}</div>}
        {total>12 && <div className="pagination"><button className="btn btn-ghost btn-sm" disabled={page===1} onClick={()=>{setPage(p=>p-1);fetchCars(page-1);}}>← Prev</button><span style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>Page {page}</span><button className="btn btn-ghost btn-sm" disabled={page*12>=total} onClick={()=>{setPage(p=>p+1);fetchCars(page+1);}}>Next →</button></div>}
      </div>
    </div>
  );
}`;

files['src/pages/renter/HomePage.css'] = `.hero { position:relative; padding:5rem 2rem 4rem; background:var(--bg-card); border-bottom:1px solid var(--border); overflow:hidden; }
.hero-content { max-width:1280px; margin:0 auto; position:relative; z-index:1; }
.hero-eyebrow { font-size:0.8rem; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; color:var(--accent); margin-bottom:0.75rem; }
.hero-title { font-size:clamp(2.5rem,6vw,4.5rem); font-weight:800; letter-spacing:-0.04em; line-height:1.05; margin-bottom:1rem; }
.hero-sub { color:var(--text-secondary); font-size:1.05rem; max-width:480px; }
.hero-accent { position:absolute; right:-2rem; top:50%; transform:translateY(-50%); font-size:clamp(8rem,20vw,18rem); color:var(--accent); opacity:0.04; font-family:var(--font-display); font-weight:800; pointer-events:none; }
.filter-bar-wrap { background:var(--bg-elevated); border-bottom:1px solid var(--border); padding:1rem 2rem; position:sticky; top:60px; z-index:90; }
.filter-bar { display:flex; flex-wrap:wrap; gap:0.6rem; max-width:1280px; margin:0 auto; align-items:center; }
.filter-input { min-width:110px; flex:1; }
.pagination { display:flex; align-items:center; justify-content:center; gap:1.5rem; margin-top:2.5rem; }`;

files['src/pages/renter/CarDetailPage.jsx'] = `import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { carsAPI, renterAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
const stars = n => '\u2605'.repeat(Math.round(n)) + '\u2606'.repeat(5-Math.round(n));
export default function CarDetailPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { user } = useAuth();
  const [car,setCar]=useState(null); const [loading,setLoading]=useState(true);
  const [booking,setBooking]=useState({start_date:'',end_date:'',notes:''});
  const [submitting,setSubmitting]=useState(false); const [imgIdx,setImgIdx]=useState(0);
  useEffect(()=>{ carsAPI.detail(id).then(({data})=>setCar(data.data)).catch(()=>navigate('/browse')).finally(()=>setLoading(false)); },[id,navigate]);
  const today=new Date().toISOString().split('T')[0];
  const days=booking.start_date&&booking.end_date?Math.max(1,Math.round((new Date(booking.end_date)-new Date(booking.start_date))/86400000)):0;
  const total=car?(days*parseFloat(car.price_per_day)).toFixed(2):0;
  const base=process.env.REACT_APP_API_URL?.replace('/api','')||'';
  const handleBook=async e=>{ e.preventDefault(); if(!user){toast.error('Please login');navigate('/login');return;} if(user.role!=='renter'){toast.error('Only renters can book');return;} setSubmitting(true); try{ await renterAPI.createRental({car_id:id,...booking}); toast.success('Booking request sent!'); navigate('/my-rentals'); }catch(err){toast.error(err.response?.data?.message||'Booking failed');}finally{setSubmitting(false);} };
  if(loading) return <div className="spinner"/>;
  if(!car) return null;
  const images=car.images?.length?car.images:[];
  return (
    <div className="page-content fade-up">
      <button className="btn btn-ghost btn-sm" style={{marginBottom:'1.5rem'}} onClick={()=>navigate(-1)}>← Back</button>
      <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:'2rem',alignItems:'start'}}>
        <div>
          <div style={{borderRadius:'var(--radius-xl)',overflow:'hidden',background:'var(--bg-elevated)',aspectRatio:'16/9',marginBottom:'0.75rem',position:'relative'}}>
            {images.length>0?<img src={base+'/'+images[imgIdx]} alt={car.brand+' '+car.model} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'4rem',color:'var(--text-muted)',opacity:0.3}}>◆</div>}
            <div style={{position:'absolute',top:'1rem',left:'1rem'}}><span className={'badge badge-'+car.status}>{car.status}</span></div>
          </div>
          {images.length>1&&<div style={{display:'flex',gap:'0.5rem',overflowX:'auto'}}>{images.map((img,i)=><div key={i} onClick={()=>setImgIdx(i)} style={{width:72,height:52,borderRadius:'var(--radius-sm)',overflow:'hidden',cursor:'pointer',border:'2px solid '+(i===imgIdx?'var(--accent)':'transparent'),flexShrink:0,background:'var(--bg-elevated)'}}><img src={base+'/'+img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>)}</div>}
          <div style={{marginTop:'1.75rem'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'0.5rem'}}>
              <h1 style={{fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:800,letterSpacing:'-0.03em'}}>{car.brand} {car.model} <span style={{color:'var(--text-muted)',fontWeight:400,fontSize:'1.3rem'}}>{car.year}</span></h1>
              <div style={{textAlign:'right'}}><div style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',fontWeight:800,color:'var(--accent)'}}>{car.price_per_day} EGP</div><div style={{fontSize:'0.8rem',color:'var(--text-secondary)'}}>per day</div></div>
            </div>
            <p style={{color:'var(--text-secondary)',marginBottom:'1.25rem'}}>📍 {car.location}</p>
            {car.avg_rating&&<div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1.25rem'}}><span className="stars">{stars(car.avg_rating)}</span><span style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>{car.avg_rating} · {car.reviews_count} reviews</span></div>}
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1.5rem'}}>{[{l:'Seats',v:car.seats},{l:'Transmission',v:car.transmission},{l:'Fuel',v:car.fuel_type},{l:'Color',v:car.color}].map(({l,v})=><div key={l} className="card" style={{padding:'0.6rem 1rem',flex:'0 0 auto'}}><div style={{fontSize:'0.7rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{l}</div><div style={{fontWeight:600,fontSize:'0.9rem',marginTop:'0.15rem'}}>{v}</div></div>)}</div>
            {car.description&&<div className="card" style={{marginBottom:'1.5rem'}}><h3 style={{fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'0.5rem',fontSize:'0.95rem'}}>About this car</h3><p style={{color:'var(--text-secondary)',lineHeight:1.7}}>{car.description}</p></div>}
            <div className="card" style={{display:'flex',alignItems:'center',gap:'1rem'}}><div style={{width:44,height:44,borderRadius:'50%',background:'var(--accent-dim)',border:'1px solid var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontWeight:800,color:'var(--accent)',fontSize:'1.1rem'}}>{car.owner?.name?.[0]?.toUpperCase()}</div><div><div style={{fontWeight:600}}>{car.owner?.name}</div><div style={{fontSize:'0.8rem',color:'var(--text-secondary)'}}>{car.owner?.phone||'Car Owner'}</div></div></div>
            {car.reviews?.length>0&&<div style={{marginTop:'1.5rem'}}><h2 style={{fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'1rem',fontSize:'1.15rem'}}>Reviews</h2><div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>{car.reviews.map(r=><div key={r.id} className="card"><div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.4rem'}}><span style={{fontWeight:600,fontSize:'0.875rem'}}>{r.reviewer?.name}</span><span className="stars" style={{fontSize:'0.75rem'}}>{stars(r.rating)}</span></div>{r.comment&&<p style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>{r.comment}</p>}</div>)}</div></div>}
          </div>
        </div>
        <div style={{position:'sticky',top:'80px'}}>
          <div className="card">
            <h2 style={{fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'1.25rem',fontSize:'1.1rem'}}>Book this car</h2>
            {car.status!=='active'?<p style={{color:'var(--warning)',fontSize:'0.875rem'}}>Not available for booking.</p>
            :!user?<div><p style={{color:'var(--text-secondary)',fontSize:'0.875rem',marginBottom:'1rem'}}>Login to book</p><button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={()=>navigate('/login')}>Login to Book</button></div>
            :user.role!=='renter'?<p style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>Only renters can book.</p>
            :<form onSubmit={handleBook} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div className="form-group"><label className="form-label">Start Date</label><input className="form-input" type="date" min={today} value={booking.start_date} onChange={e=>setBooking({...booking,start_date:e.target.value})} required/></div>
              <div className="form-group"><label className="form-label">End Date</label><input className="form-input" type="date" min={booking.start_date||today} value={booking.end_date} onChange={e=>setBooking({...booking,end_date:e.target.value})} required/></div>
              <div className="form-group"><label className="form-label">Notes</label><textarea className="form-input" rows={2} value={booking.notes} onChange={e=>setBooking({...booking,notes:e.target.value})} style={{resize:'none'}}/></div>
              {days>0&&<div style={{background:'var(--bg-elevated)',borderRadius:'var(--radius-md)',padding:'1rem'}}><div style={{display:'flex',justifyContent:'space-between',fontSize:'0.875rem',color:'var(--text-secondary)'}}><span>{car.price_per_day} EGP × {days} days</span><span>{total} EGP</span></div><div style={{display:'flex',justifyContent:'space-between',fontFamily:'var(--font-display)',fontWeight:700,color:'var(--accent)',borderTop:'1px solid var(--border)',paddingTop:'0.4rem',marginTop:'0.4rem'}}><span>Total</span><span>{total} EGP</span></div></div>}
              <button className="btn btn-primary btn-lg" type="submit" disabled={submitting} style={{justifyContent:'center'}}>{submitting?'Sending...':'Request to Book'}</button>
              <p style={{fontSize:'0.75rem',color:'var(--text-muted)',textAlign:'center'}}>Request sent to owner for approval</p>
            </form>}
          </div>
        </div>
      </div>
    </div>
  );
}`;

files['src/pages/renter/MyRentalsPage.jsx'] = `import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { renterAPI } from '../../services/api';
export default function MyRentalsPage() {
  const [rentals,setRentals]=useState([]); const [loading,setLoading]=useState(true); const [status,setStatus]=useState(''); const [modal,setModal]=useState(null); const [review,setReview]=useState({rating:5,comment:''}); const [submitting,setSubmitting]=useState(false);
  const fetchRentals=useCallback(async()=>{ setLoading(true); try{ const {data}=await renterAPI.getMyRentals(status?{status}:{}); setRentals(data.data); }finally{setLoading(false);} },[status]);
  useEffect(()=>{fetchRentals();},[fetchRentals]);
  const handleCancel=async id=>{ if(!window.confirm('Cancel?')) return; try{ await renterAPI.cancelRental(id); toast.success('Cancelled'); fetchRentals(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };
  const handleReview=async e=>{ e.preventDefault(); setSubmitting(true); try{ await renterAPI.submitReview(modal.id,review); toast.success('Review submitted!'); setModal(null); fetchRentals(); }catch(err){toast.error(err.response?.data?.message||'Failed');}finally{setSubmitting(false);} };
  const sc={pending:'warning',accepted:'info',rejected:'rejected',completed:'completed'};
  return (
    <div className="page-content fade-up">
      <div className="page-header"><h1 className="page-title">My Rentals</h1><div style={{display:'flex',gap:'0.5rem'}}>{['','pending','accepted','completed','rejected'].map(s=><button key={s} className={'btn btn-sm '+(status===s?'btn-primary':'btn-ghost')} onClick={()=>setStatus(s)}>{s||'all'}</button>)}</div></div>
      {loading?<div className="spinner"/>:rentals.length===0?<div className="empty-state"><h3>No rentals yet</h3></div>:
      <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        {rentals.map(r=><div key={r.id} className="card" style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'1rem',alignItems:'center'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.5rem'}}><h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.05rem'}}>{r.car?.brand} {r.car?.model} {r.car?.year}</h3><span className={'badge badge-'+(sc[r.status]||r.status)}>{r.status}</span></div>
            <div style={{display:'flex',gap:'1.5rem',color:'var(--text-secondary)',fontSize:'0.875rem',flexWrap:'wrap'}}><span>📅 {r.start_date} → {r.end_date}</span><span style={{color:'var(--accent)',fontWeight:700}}>{r.total_price} EGP</span><span>Owner: {r.car?.owner?.name}</span></div>
            {r.rejection_reason&&<p style={{marginTop:'0.5rem',fontSize:'0.8rem',color:'var(--danger)'}}>Reason: {r.rejection_reason}</p>}
            {r.review&&<p style={{marginTop:'0.5rem',fontSize:'0.8rem',color:'var(--success)'}}>✓ Reviewed · {'★'.repeat(r.review.rating)}</p>}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'0.4rem',alignItems:'flex-end'}}>
            {r.status==='pending'&&<button className="btn btn-danger btn-sm" onClick={()=>handleCancel(r.id)}>Cancel</button>}
            {r.status==='completed'&&!r.review&&<button className="btn btn-primary btn-sm" onClick={()=>{setModal(r);setReview({rating:5,comment:''});}}>Leave Review</button>}
          </div>
        </div>)}
      </div>}
      {modal&&<div className="modal-overlay" onClick={()=>setModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <h2 className="modal-title">Review — {modal.car?.brand} {modal.car?.model}</h2>
        <form onSubmit={handleReview} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div className="form-group"><label className="form-label">Rating</label><div style={{display:'flex',gap:'0.5rem'}}>{[1,2,3,4,5].map(n=><button key={n} type="button" style={{fontSize:'1.5rem',color:n<=review.rating?'var(--accent)':'var(--text-muted)',background:'none',border:'none',cursor:'pointer'}} onClick={()=>setReview({...review,rating:n})}>★</button>)}</div></div>
          <div className="form-group"><label className="form-label">Comment</label><textarea className="form-input" rows={3} value={review.comment} onChange={e=>setReview({...review,comment:e.target.value})} style={{resize:'vertical'}}/></div>
          <div style={{display:'flex',gap:'0.75rem',justifyContent:'flex-end'}}><button type="button" className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button><button type="submit" className="btn btn-primary" disabled={submitting}>{submitting?'Submitting...':'Submit'}</button></div>
        </form>
      </div></div>}
    </div>
  );
}`;

files['src/pages/renter/LicensePage.jsx'] = `import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { renterAPI } from '../../services/api';
export default function LicensePage() {
  const [license,setLicense]=useState(null); const [loading,setLoading]=useState(true); const [form,setForm]=useState({license_number:'',expiry_date:''}); const [files,setFiles]=useState({front_image:null,back_image:null}); const [submitting,setSubmitting]=useState(false);
  useEffect(()=>{ renterAPI.getLicense().then(({data})=>setLicense(data.data)).catch(()=>setLicense(null)).finally(()=>setLoading(false)); },[]);
  const handleSubmit=async e=>{ e.preventDefault(); if(!files.front_image||!files.back_image){toast.error('Both images required');return;} setSubmitting(true); try{ const fd=new FormData(); fd.append('license_number',form.license_number); fd.append('expiry_date',form.expiry_date); fd.append('front_image',files.front_image); fd.append('back_image',files.back_image); const {data}=await renterAPI.uploadLicense(fd); setLicense(data.data); toast.success('License uploaded!'); }catch(err){toast.error(err.response?.data?.message||'Failed');}finally{setSubmitting(false);} };
  const base=process.env.REACT_APP_API_URL?.replace('/api','')||'';
  if(loading) return <div className="spinner"/>;
  return (
    <div className="page-content fade-up" style={{maxWidth:640}}>
      <h1 className="page-title" style={{marginBottom:'0.5rem'}}>Driver License</h1>
      <p style={{color:'var(--text-secondary)',marginBottom:'2rem'}}>A verified license is required before booking.</p>
      {license&&<div className="card" style={{marginBottom:'2rem',borderLeft:'3px solid var(--'+(license.status==='verified'?'success':license.status==='rejected'?'danger':'warning')+')'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}><h3 style={{fontFamily:'var(--font-display)',fontWeight:700}}>Current License</h3><span className={'badge badge-'+(license.status==='verified'?'verified':license.status)}>{license.status}</span></div>
        <div style={{fontSize:'0.875rem',color:'var(--text-secondary)'}}><div>License #: <strong style={{color:'var(--text-primary)'}}>{license.license_number}</strong></div><div>Expires: <strong style={{color:'var(--text-primary)'}}>{license.expiry_date}</strong></div></div>
        {license.rejection_reason&&<p style={{marginTop:'0.75rem',fontSize:'0.8rem',color:'var(--danger)'}}>Rejected: {license.rejection_reason}</p>}
        <div style={{display:'flex',gap:'0.75rem',marginTop:'0.75rem'}}><a href={base+'/'+license.front_image} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">View Front</a><a href={base+'/'+license.back_image} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">View Back</a></div>
      </div>}
      <div className="card"><h2 style={{fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'1.25rem',fontSize:'1rem'}}>{license?'Re-upload':'Upload'} License</h2>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div className="form-group"><label className="form-label">License Number</label><input className="form-input" value={form.license_number} onChange={e=>setForm({...form,license_number:e.target.value})} required/></div>
          <div className="form-group"><label className="form-label">Expiry Date</label><input className="form-input" type="date" value={form.expiry_date} onChange={e=>setForm({...form,expiry_date:e.target.value})} required/></div>
          <div className="form-group"><label className="form-label">Front Image</label><input className="form-input" type="file" accept="image/*" onChange={e=>setFiles({...files,front_image:e.target.files[0]})}/></div>
          <div className="form-group"><label className="form-label">Back Image</label><input className="form-input" type="file" accept="image/*" onChange={e=>setFiles({...files,back_image:e.target.files[0]})}/></div>
          <button className="btn btn-primary" type="submit" disabled={submitting} style={{alignSelf:'flex-start'}}>{submitting?'Uploading...':'Upload License'}</button>
        </form>
      </div>
    </div>
  );
}`;

files['src/pages/renter/ProfilePage.jsx'] = `import { useState } from 'react';
import toast from 'react-hot-toast';
import { renterAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
export default function ProfilePage() {
  const { user, setUser } = useAuth(); const [form,setForm]=useState({name:user?.name||'',phone:user?.phone||''}); const [file,setFile]=useState(null); const [loading,setLoading]=useState(false);
  const handleSubmit=async e=>{ e.preventDefault(); setLoading(true); try{ const fd=new FormData(); fd.append('name',form.name); if(form.phone) fd.append('phone',form.phone); if(file) fd.append('profile_image',file); const {data}=await renterAPI.updateProfile(fd); setUser(data.data); localStorage.setItem('user',JSON.stringify(data.data)); toast.success('Profile updated!'); }catch(err){toast.error(err.response?.data?.message||'Failed');}finally{setLoading(false);} };
  return (
    <div className="page-content fade-up" style={{maxWidth:520}}>
      <h1 className="page-title" style={{marginBottom:'2rem'}}>Profile</h1>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.5rem',paddingBottom:'1.5rem',borderBottom:'1px solid var(--border)'}}>
          <div style={{width:56,height:56,borderRadius:'50%',background:'var(--accent-dim)',border:'2px solid var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontWeight:800,color:'var(--accent)',fontSize:'1.4rem'}}>{user?.name?.[0]?.toUpperCase()}</div>
          <div><div style={{fontFamily:'var(--font-display)',fontWeight:700}}>{user?.name}</div><div style={{fontSize:'0.8rem',color:'var(--text-secondary)'}}>{user?.email}</div></div>
        </div>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Profile Photo</label><input className="form-input" type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])}/></div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{alignSelf:'flex-start'}}>{loading?'Saving...':'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}`;

files['src/pages/renter/RenterDashboard.jsx'] = `import { useAuth } from '../../context/AuthContext';
export default function RenterDashboard() {
  const { user } = useAuth();
  return (
    <div className="page-content fade-up">
      <div className="page-header"><h1 className="page-title">Welcome, {user?.name?.split(' ')[0]} 👋</h1></div>
      <div className="grid-3">{[{label:'Browse Cars',desc:'Find your next ride',link:'/browse',accent:'var(--accent)'},{label:'My Rentals',desc:'Track your bookings',link:'/my-rentals',accent:'var(--info)'},{label:'Driver License',desc:'Upload & verify',link:'/license',accent:'var(--success)'}].map(item=><a key={item.label} href={item.link} className="card" style={{borderTop:'2px solid '+item.accent,display:'block',textDecoration:'none'}}><div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.05rem',marginBottom:'0.3rem'}}>{item.label}</div><div style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>{item.desc}</div></a>)}</div>
    </div>
  );
}`;

files['src/pages/admin/AdminDashboard.jsx'] = `import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
const StatCard=({label,value,color})=><div className="card" style={{borderTop:'2px solid '+color}}><div style={{fontSize:'2rem',fontFamily:'var(--font-display)',fontWeight:800,color}}>{value??'—'}</div><div style={{fontWeight:600,marginTop:'0.25rem'}}>{label}</div></div>;
export default function AdminDashboard() {
  const [stats,setStats]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{ adminAPI.dashboard().then(({data})=>setStats(data.data)).finally(()=>setLoading(false)); },[]);
  if(loading) return <div className="spinner"/>;
  return (
    <div className="page-content fade-up">
      <div className="page-header"><h1 className="page-title">Admin Dashboard</h1></div>
      <div className="grid-4" style={{marginBottom:'2rem'}}>
        <StatCard label="Total Users"    value={stats?.users.total}         color="var(--info)"/>
        <StatCard label="Pending Owners" value={stats?.users.pendingOwners}  color="var(--warning)"/>
        <StatCard label="Active Cars"    value={stats?.cars.active}          color="var(--success)"/>
        <StatCard label="Pending Cars"   value={stats?.cars.pending}         color="var(--warning)"/>
        <StatCard label="Total Rentals"  value={stats?.rentals.total}        color="var(--accent)"/>
        <StatCard label="Completed"      value={stats?.rentals.completed}    color="var(--success)"/>
        <StatCard label="Pending Licenses" value={stats?.pendingLicenses}    color="var(--warning)"/>
        <StatCard label="Total Cars"     value={stats?.cars.total}           color="var(--text-secondary)"/>
      </div>
      <div className="grid-3">{[{to:'/admin/users',label:'Review Pending Users',badge:stats?.users.pendingOwners},{to:'/admin/cars',label:'Review Pending Cars',badge:stats?.cars.pending},{to:'/admin/licenses',label:'Verify Licenses',badge:stats?.pendingLicenses}].map(item=><Link key={item.to} to={item.to} className="card" style={{display:'flex',alignItems:'center',justifyContent:'space-between',textDecoration:'none'}}><span style={{fontWeight:600}}>{item.label}</span>{item.badge>0&&<span style={{background:'var(--warning)',color:'#0d0f14',borderRadius:'20px',padding:'0.15rem 0.6rem',fontSize:'0.75rem',fontWeight:700}}>{item.badge}</span>}</Link>)}</div>
    </div>
  );
}`;

files['src/pages/admin/AdminUsersPage.jsx'] = `import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
export default function AdminUsersPage() {
  const [users,setUsers]=useState([]); const [loading,setLoading]=useState(true); const [status,setStatus]=useState('pending'); const [search,setSearch]=useState(''); const [modal,setModal]=useState(null); const [reason,setReason]=useState('');
  const fetchUsers=useCallback(async()=>{ setLoading(true); try{ const params={status,limit:50}; if(search) params.search=search; const {data}=await adminAPI.getUsers(params); setUsers(data.data); }finally{setLoading(false);} },[status,search]);
  useEffect(()=>{fetchUsers();},[fetchUsers]);
  const handleApprove=async(id,name)=>{ try{ await adminAPI.approveUser(id); toast.success(name+' approved'); fetchUsers(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };
  const handleReject=async()=>{ if(!reason.trim()){toast.error('Reason required');return;} try{ await adminAPI.rejectUser(modal.userId,{reason}); toast.success('Rejected'); setModal(null); setReason(''); fetchUsers(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };
  return (
    <div className="page-content fade-up">
      <div className="page-header"><h1 className="page-title">Users</h1><div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>{['pending','active','rejected'].map(s=><button key={s} className={'btn btn-sm '+(status===s?'btn-primary':'btn-ghost')} onClick={()=>setStatus(s)}>{s}</button>)}<input className="form-input" placeholder="Search..." value={search} style={{width:180}} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetchUsers()}/></div></div>
      <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead><tbody>
        {loading?<tr><td colSpan={6}><div className="spinner"/></td></tr>:users.length===0?<tr><td colSpan={6} style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem'}}>No users</td></tr>:users.map(u=><tr key={u.id}><td style={{fontWeight:600}}>{u.name}</td><td style={{color:'var(--text-secondary)'}}>{u.email}</td><td><span className="badge badge-active" style={{fontSize:'0.7rem'}}>{u.role}</span></td><td><span className={'badge badge-'+u.status}>{u.status}</span></td><td style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>{new Date(u.created_at).toLocaleDateString()}</td><td><div style={{display:'flex',gap:'0.4rem'}}>{u.status==='pending'&&<><button className="btn btn-success btn-sm" onClick={()=>handleApprove(u.id,u.name)}>Approve</button><button className="btn btn-danger btn-sm" onClick={()=>{setModal({userId:u.id,name:u.name});setReason('');}}>Reject</button></>}</div></td></tr>)}
      </tbody></table></div>
      {modal&&<div className="modal-overlay" onClick={()=>setModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}><h2 className="modal-title">Reject "{modal.name}"</h2><div className="form-group"><label className="form-label">Reason</label><textarea className="form-input" rows={4} value={reason} onChange={e=>setReason(e.target.value)} style={{resize:'vertical'}}/></div><div style={{display:'flex',gap:'0.75rem',marginTop:'1.25rem',justifyContent:'flex-end'}}><button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-danger" onClick={handleReject}>Confirm</button></div></div></div>}
    </div>
  );
}`;

files['src/pages/admin/AdminCarsPage.jsx'] = `import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
function RejectModal({title,onConfirm,onClose}){ const [reason,setReason]=useState(''); return <div className="modal-overlay" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><h2 className="modal-title">{title}</h2><div className="form-group"><label className="form-label">Reason</label><textarea className="form-input" rows={4} value={reason} onChange={e=>setReason(e.target.value)} style={{resize:'vertical'}}/></div><div style={{display:'flex',gap:'0.75rem',marginTop:'1.25rem',justifyContent:'flex-end'}}><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-danger" onClick={()=>{if(reason.trim())onConfirm(reason);else toast.error('Reason required');}}>Confirm</button></div></div></div>; }
export default function AdminCarsPage() {
  const [cars,setCars]=useState([]); const [loading,setLoading]=useState(true); const [status,setStatus]=useState('pending'); const [modal,setModal]=useState(null);
  const fetchCars=useCallback(async()=>{ setLoading(true); try{ const {data}=await adminAPI.getCars({status,limit:50}); setCars(data.data); }finally{setLoading(false);} },[status]);
  useEffect(()=>{fetchCars();},[fetchCars]);
  const handleApprove=async(id,label)=>{ try{ await adminAPI.approveCar(id); toast.success(label+' approved'); fetchCars(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };
  const handleReject=async(id,reason)=>{ try{ await adminAPI.rejectCar(id,{reason}); toast.success('Rejected'); setModal(null); fetchCars(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };
  return (
    <div className="page-content fade-up">
      <div className="page-header"><h1 className="page-title">Cars</h1><div style={{display:'flex',gap:'0.5rem'}}>{['pending','active','rejected','rented'].map(s=><button key={s} className={'btn btn-sm '+(status===s?'btn-primary':'btn-ghost')} onClick={()=>setStatus(s)}>{s}</button>)}</div></div>
      <div className="table-wrap"><table><thead><tr><th>Car</th><th>Owner</th><th>Location</th><th>Price/Day</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        {loading?<tr><td colSpan={6}><div className="spinner"/></td></tr>:cars.length===0?<tr><td colSpan={6} style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem'}}>No cars</td></tr>:cars.map(car=><tr key={car.id}><td><div style={{fontWeight:600}}>{car.brand} {car.model}</div><div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{car.year} · {car.plate_number}</div></td><td style={{color:'var(--text-secondary)'}}>{car.owner?.name}</td><td style={{color:'var(--text-secondary)'}}>{car.location}</td><td style={{fontFamily:'var(--font-display)',fontWeight:700,color:'var(--accent)'}}>{car.price_per_day} EGP</td><td><span className={'badge badge-'+car.status}>{car.status}</span></td><td><div style={{display:'flex',gap:'0.4rem'}}>{car.status==='pending'&&<><button className="btn btn-success btn-sm" onClick={()=>handleApprove(car.id,car.brand+' '+car.model)}>Approve</button><button className="btn btn-danger btn-sm" onClick={()=>setModal(car)}>Reject</button></>}</div></td></tr>)}
      </tbody></table></div>
      {modal&&<RejectModal title={'Reject '+modal.brand+' '+modal.model+'?'} onConfirm={r=>handleReject(modal.id,r)} onClose={()=>setModal(null)}/>}
    </div>
  );
}`;

files['src/pages/admin/AdminLicensesPage.jsx'] = `import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
function RejectModal({title,onConfirm,onClose}){ const [reason,setReason]=useState(''); return <div className="modal-overlay" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><h2 className="modal-title">{title}</h2><div className="form-group"><label className="form-label">Reason</label><textarea className="form-input" rows={4} value={reason} onChange={e=>setReason(e.target.value)} style={{resize:'vertical'}}/></div><div style={{display:'flex',gap:'0.75rem',marginTop:'1.25rem',justifyContent:'flex-end'}}><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-danger" onClick={()=>{if(reason.trim())onConfirm(reason);else toast.error('Reason required');}}>Confirm</button></div></div></div>; }
export default function AdminLicensesPage() {
  const [licenses,setLicenses]=useState([]); const [loading,setLoading]=useState(true); const [status,setStatus]=useState('pending'); const [modal,setModal]=useState(null);
  const fetchLicenses=useCallback(async()=>{ setLoading(true); try{ const {data}=await adminAPI.getLicenses({status,limit:50}); setLicenses(data.data); }finally{setLoading(false);} },[status]);
  useEffect(()=>{fetchLicenses();},[fetchLicenses]);
  const handleVerify=async(id,name)=>{ try{ await adminAPI.verifyLicense(id); toast.success(name+"'s license verified"); fetchLicenses(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };
  const handleReject=async(id,reason)=>{ try{ await adminAPI.rejectLicense(id,{reason}); toast.success('Rejected'); setModal(null); fetchLicenses(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };
  const base=process.env.REACT_APP_API_URL?.replace('/api','')||'';
  return (
    <div className="page-content fade-up">
      <div className="page-header"><h1 className="page-title">Driver Licenses</h1><div style={{display:'flex',gap:'0.5rem'}}>{['pending','verified','rejected'].map(s=><button key={s} className={'btn btn-sm '+(status===s?'btn-primary':'btn-ghost')} onClick={()=>setStatus(s)}>{s}</button>)}</div></div>
      <div className="table-wrap"><table><thead><tr><th>Renter</th><th>License #</th><th>Expiry</th><th>Images</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        {loading?<tr><td colSpan={6}><div className="spinner"/></td></tr>:licenses.length===0?<tr><td colSpan={6} style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem'}}>No licenses</td></tr>:licenses.map(lic=><tr key={lic.id}><td><div style={{fontWeight:600}}>{lic.user?.name}</div><div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{lic.user?.email}</div></td><td style={{fontFamily:'monospace',color:'var(--text-secondary)'}}>{lic.license_number}</td><td style={{color:new Date(lic.expiry_date)<new Date()?'var(--danger)':'var(--text-secondary)'}}>{lic.expiry_date}</td><td><div style={{display:'flex',gap:'0.5rem'}}><a href={base+'/'+lic.front_image} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">Front</a><a href={base+'/'+lic.back_image} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">Back</a></div></td><td><span className={'badge badge-'+lic.status}>{lic.status}</span></td><td>{lic.status==='pending'&&<div style={{display:'flex',gap:'0.4rem'}}><button className="btn btn-success btn-sm" onClick={()=>handleVerify(lic.id,lic.user?.name)}>Verify</button><button className="btn btn-danger btn-sm" onClick={()=>setModal(lic)}>Reject</button></div>}</td></tr>)}
      </tbody></table></div>
      {modal&&<RejectModal title={"Reject "+modal.user?.name+"'s license?"} onConfirm={r=>handleReject(modal.id,r)} onClose={()=>setModal(null)}/>}
    </div>
  );
}`;

files['src/pages/owner/OwnerDashboard.jsx'] = `import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ownerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
export default function OwnerDashboard() {
  const { user } = useAuth(); const [stats,setStats]=useState({cars:0,pending:0,active:0});
  useEffect(()=>{ Promise.all([ownerAPI.getMyCars(),ownerAPI.getRentals({})]).then(([c,r])=>{ setStats({cars:c.data.data.length,pending:r.data.data.filter(x=>x.status==='pending').length,active:r.data.data.filter(x=>x.status==='accepted').length}); }).catch(()=>{}); },[]);
  if(user?.status!=='active') return <div className="page-content fade-up"><div className="card" style={{maxWidth:520,borderLeft:'3px solid var(--warning)'}}><h2 style={{fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'0.5rem'}}>Account Pending Approval</h2><p style={{color:'var(--text-secondary)'}}>Awaiting admin approval.</p></div></div>;
  return (
    <div className="page-content fade-up">
      <div className="page-header"><h1 className="page-title">Owner Dashboard</h1><Link to="/owner/cars/new" className="btn btn-primary">+ List New Car</Link></div>
      <div className="grid-3" style={{marginBottom:'2rem'}}>{[{label:'My Cars',value:stats.cars,color:'var(--accent)'},{label:'Pending Requests',value:stats.pending,color:'var(--warning)'},{label:'Active Rentals',value:stats.active,color:'var(--success)'}].map(s=><div key={s.label} className="card" style={{borderTop:'2px solid '+s.color}}><div style={{fontSize:'2rem',fontFamily:'var(--font-display)',fontWeight:800,color:s.color}}>{s.value}</div><div style={{fontWeight:600,marginTop:'0.25rem'}}>{s.label}</div></div>)}</div>
      <div className="grid-2">{[{to:'/owner/cars',label:'Manage Cars',desc:'Add, edit, or remove listings'},{to:'/owner/rentals',label:'Rental Requests',desc:'Accept or reject requests'}].map(item=><Link key={item.to} to={item.to} className="card" style={{textDecoration:'none'}}><div style={{fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'0.3rem'}}>{item.label}</div><div style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>{item.desc}</div></Link>)}</div>
    </div>
  );
}`;

files['src/pages/owner/MyCarsPage.jsx'] = `import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ownerAPI } from '../../services/api';
export default function MyCarsPage() {
  const [cars,setCars]=useState([]); const [loading,setLoading]=useState(true);
  const fetchCars=()=>{ setLoading(true); ownerAPI.getMyCars().then(({data})=>setCars(data.data)).finally(()=>setLoading(false)); };
  useEffect(fetchCars,[]);
  const handleDelete=async(id,label)=>{ if(!window.confirm('Delete '+label+'?')) return; try{ await ownerAPI.deleteCar(id); toast.success('Deleted'); fetchCars(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };
  return (
    <div className="page-content fade-up">
      <div className="page-header"><h1 className="page-title">My Cars</h1><Link to="/owner/cars/new" className="btn btn-primary">+ New Listing</Link></div>
      {loading?<div className="spinner"/>:cars.length===0?<div className="empty-state"><h3>No cars yet</h3><Link to="/owner/cars/new" className="btn btn-primary" style={{marginTop:'1rem'}}>Add First Car</Link></div>:
      <div className="table-wrap"><table><thead><tr><th>Car</th><th>Price/Day</th><th>Status</th><th>Rating</th><th>Actions</th></tr></thead><tbody>
        {cars.map(car=><tr key={car.id}><td><div style={{fontWeight:600}}>{car.brand} {car.model}</div><div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{car.year} · {car.location}</div></td><td style={{fontFamily:'var(--font-display)',fontWeight:700,color:'var(--accent)'}}>{car.price_per_day} EGP</td><td><span className={'badge badge-'+car.status}>{car.status}</span></td><td style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>{car.avg_rating?'★ '+car.avg_rating+' ('+car.reviews_count+')':'—'}</td><td><div style={{display:'flex',gap:'0.4rem'}}><Link to={'/owner/cars/'+car.id+'/edit'} className="btn btn-ghost btn-sm">Edit</Link><button className="btn btn-danger btn-sm" onClick={()=>handleDelete(car.id,car.brand+' '+car.model)}>Delete</button></div></td></tr>)}
      </tbody></table></div>}
    </div>
  );
}`;

files['src/pages/owner/CarFormPage.jsx'] = `import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ownerAPI } from '../../services/api';
export default function CarFormPage() {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit=Boolean(id);
  const [form,setForm]=useState({brand:'',model:'',year:new Date().getFullYear(),color:'',plate_number:'',price_per_day:'',location:'',seats:5,transmission:'automatic',fuel_type:'petrol',description:''});
  const [images,setImages]=useState([]); const [loading,setLoading]=useState(isEdit); const [submitting,setSubmitting]=useState(false);
  useEffect(()=>{ if(!isEdit) return; ownerAPI.getCarById(id).then(({data})=>{ const c=data.data; setForm({brand:c.brand,model:c.model,year:c.year,color:c.color,plate_number:c.plate_number,price_per_day:c.price_per_day,location:c.location,seats:c.seats,transmission:c.transmission,fuel_type:c.fuel_type,description:c.description||''}); }).finally(()=>setLoading(false)); },[id,isEdit]);
  const handleSubmit=async e=>{ e.preventDefault(); setSubmitting(true); try{ const fd=new FormData(); Object.entries(form).forEach(([k,v])=>fd.append(k,v)); images.forEach(f=>fd.append('car_images',f)); if(isEdit) await ownerAPI.updateCar(id,fd); else await ownerAPI.createCar(fd); toast.success(isEdit?'Car updated!':'Submitted for approval!'); navigate('/owner/cars'); }catch(err){toast.error(err.response?.data?.message||'Failed');}finally{setSubmitting(false);} };
  const upd=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  if(loading) return <div className="spinner"/>;
  return (
    <div className="page-content fade-up" style={{maxWidth:720}}>
      <div className="page-header"><h1 className="page-title">{isEdit?'Edit Car':'List New Car'}</h1></div>
      <div className="card"><form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">Brand *</label><input className="form-input" value={form.brand} onChange={upd('brand')} placeholder="Toyota" required/></div>
          <div className="form-group"><label className="form-label">Model *</label><input className="form-input" value={form.model} onChange={upd('model')} placeholder="Corolla" required/></div>
          <div className="form-group"><label className="form-label">Year *</label><input className="form-input" type="number" value={form.year} onChange={upd('year')} min={1990} max={2026} required/></div>
          <div className="form-group"><label className="form-label">Color *</label><input className="form-input" value={form.color} onChange={upd('color')} placeholder="White" required/></div>
          <div className="form-group"><label className="form-label">Plate Number *</label><input className="form-input" value={form.plate_number} onChange={upd('plate_number')} placeholder="ABC 1234" required/></div>
          <div className="form-group"><label className="form-label">Price / Day (EGP) *</label><input className="form-input" type="number" value={form.price_per_day} onChange={upd('price_per_day')} min={0} required/></div>
          <div className="form-group"><label className="form-label">Location *</label><input className="form-input" value={form.location} onChange={upd('location')} placeholder="Cairo" required/></div>
          <div className="form-group"><label className="form-label">Seats</label><input className="form-input" type="number" value={form.seats} onChange={upd('seats')} min={2} max={20}/></div>
          <div className="form-group"><label className="form-label">Transmission</label><select className="form-select" value={form.transmission} onChange={upd('transmission')}><option value="automatic">Automatic</option><option value="manual">Manual</option></select></div>
          <div className="form-group"><label className="form-label">Fuel Type</label><select className="form-select" value={form.fuel_type} onChange={upd('fuel_type')}><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="electric">Electric</option><option value="hybrid">Hybrid</option></select></div>
        </div>
        <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={upd('description')} style={{resize:'vertical'}}/></div>
        <div className="form-group"><label className="form-label">Car Images (up to 6)</label><input className="form-input" type="file" multiple accept="image/*" onChange={e=>setImages(Array.from(e.target.files).slice(0,6))}/></div>
        <div style={{display:'flex',gap:'0.75rem',marginTop:'0.5rem'}}><button type="submit" className="btn btn-primary" disabled={submitting}>{submitting?'Saving...':isEdit?'Save Changes':'Submit Listing'}</button><button type="button" className="btn btn-ghost" onClick={()=>navigate('/owner/cars')}>Cancel</button></div>
      </form></div>
    </div>
  );
}`;

files['src/pages/owner/OwnerRentalsPage.jsx'] = `import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ownerAPI } from '../../services/api';
export default function OwnerRentalsPage() {
  const [rentals,setRentals]=useState([]); const [loading,setLoading]=useState(true); const [status,setStatus]=useState('pending'); const [modal,setModal]=useState(null); const [reason,setReason]=useState('');
  const fetchRentals=useCallback(async()=>{ setLoading(true); try{ const {data}=await ownerAPI.getRentals({status}); setRentals(data.data); }finally{setLoading(false);} },[status]);
  useEffect(()=>{fetchRentals();},[fetchRentals]);
  const handleAccept=async id=>{ try{ await ownerAPI.acceptRental(id); toast.success('Accepted!'); fetchRentals(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };
  const handleReject=async()=>{ if(!reason.trim()){toast.error('Reason required');return;} try{ await ownerAPI.rejectRental(modal.id,{reason}); toast.success('Rejected'); setModal(null); setReason(''); fetchRentals(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };
  const handleComplete=async id=>{ if(!window.confirm('Mark as completed?')) return; try{ await ownerAPI.completeRental(id); toast.success('Completed!'); fetchRentals(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };
  const sc={pending:'warning',accepted:'info',rejected:'rejected',completed:'completed'};
  return (
    <div className="page-content fade-up">
      <div className="page-header"><h1 className="page-title">Rental Requests</h1><div style={{display:'flex',gap:'0.5rem'}}>{['pending','accepted','completed','rejected'].map(s=><button key={s} className={'btn btn-sm '+(status===s?'btn-primary':'btn-ghost')} onClick={()=>setStatus(s)}>{s}</button>)}</div></div>
      {loading?<div className="spinner"/>:rentals.length===0?<div className="empty-state"><h3>No {status} requests</h3></div>:
      <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        {rentals.map(r=><div key={r.id} className="card" style={{display:'grid',gridTemplateColumns:'1fr auto',gap:'1rem',alignItems:'center'}}>
          <div><div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.5rem'}}><span style={{fontFamily:'var(--font-display)',fontWeight:700}}>{r.car?.brand} {r.car?.model}</span><span className={'badge badge-'+(sc[r.status]||r.status)}>{r.status}</span></div>
          <div style={{display:'flex',gap:'1.5rem',color:'var(--text-secondary)',fontSize:'0.875rem',flexWrap:'wrap'}}><span>Renter: <strong style={{color:'var(--text-primary)'}}>{r.renter?.name}</strong></span><span>📅 {r.start_date} → {r.end_date}</span><span style={{color:'var(--accent)',fontWeight:700}}>{r.total_price} EGP</span></div></div>
          <div style={{display:'flex',flexDirection:'column',gap:'0.4rem',alignItems:'flex-end'}}>
            {r.status==='pending'&&<><button className="btn btn-success btn-sm" onClick={()=>handleAccept(r.id)}>Accept</button><button className="btn btn-danger btn-sm" onClick={()=>{setModal(r);setReason('');}}>Reject</button></>}
            {r.status==='accepted'&&<button className="btn btn-ghost btn-sm" onClick={()=>handleComplete(r.id)}>Mark Complete</button>}
          </div>
        </div>)}
      </div>}
      {modal&&<div className="modal-overlay" onClick={()=>setModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}><h2 className="modal-title">Reject Request</h2><p style={{color:'var(--text-secondary)',fontSize:'0.875rem',marginBottom:'1rem'}}>{modal.renter?.name} · {modal.start_date} → {modal.end_date}</p><div className="form-group"><label className="form-label">Reason *</label><textarea className="form-input" rows={3} value={reason} onChange={e=>setReason(e.target.value)} style={{resize:'vertical'}}/></div><div style={{display:'flex',gap:'0.75rem',marginTop:'1.25rem',justifyContent:'flex-end'}}><button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-danger" onClick={handleReject}>Confirm</button></div></div></div>}
    </div>
  );
}`;

// Write all files
Object.entries(files).forEach(([filePath, content]) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Created:', filePath);
});

console.log('\n🎉 All files created successfully!');