import { useState, useEffect } from 'react';
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
}