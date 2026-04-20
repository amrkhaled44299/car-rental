import { useState } from 'react';
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
}