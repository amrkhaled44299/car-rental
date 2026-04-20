import { useState, useEffect } from 'react';
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
}