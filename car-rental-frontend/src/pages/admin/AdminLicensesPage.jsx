import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

function RejectModal({title,onConfirm,onClose}){ const [reason,setReason]=useState(''); return <div className="modal-overlay" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><h2 className="modal-title">{title}</h2><div className="form-group"><label className="form-label">Reason</label><textarea className="form-input" rows={4} value={reason} onChange={e=>setReason(e.target.value)} style={{resize:'vertical'}}/></div><div style={{display:'flex',gap:'0.75rem',marginTop:'1.25rem',justifyContent:'flex-end'}}><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-danger" onClick={()=>{if(reason.trim())onConfirm(reason);else toast.error('Reason required');}}>Confirm</button></div></div></div>; }

export default function AdminLicensesPage() {
  const [licenses,setLicenses]=useState([]); const [loading,setLoading]=useState(true); const [status,setStatus]=useState('pending'); const [modal,setModal]=useState(null);

  const fetchLicenses=useCallback(async()=>{ setLoading(true); try{ const {data}=await adminAPI.getLicenses({status,limit:50}); setLicenses(data.data); }finally{setLoading(false);} },[status]);

  useEffect(()=>{fetchLicenses();},[fetchLicenses]);

  useEffect(()=>{
    const handler = () => fetchLicenses();
    window.addEventListener('data-refresh', handler);
    return () => window.removeEventListener('data-refresh', handler);
  },[fetchLicenses]);

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
}