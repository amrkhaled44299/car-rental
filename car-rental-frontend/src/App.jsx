import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
}