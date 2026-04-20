import { Outlet, NavLink, useNavigate } from 'react-router-dom';
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
}