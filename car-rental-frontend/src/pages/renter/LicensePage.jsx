import { useState, useEffect } from 'react';
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
}