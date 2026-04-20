import { useState } from 'react';
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
}