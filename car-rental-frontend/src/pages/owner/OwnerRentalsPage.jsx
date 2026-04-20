import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ownerAPI } from '../../services/api';

export default function OwnerRentalsPage() {
  const [rentals,setRentals]=useState([]); const [loading,setLoading]=useState(true); const [status,setStatus]=useState('pending'); const [modal,setModal]=useState(null); const [reason,setReason]=useState('');

  const fetchRentals=useCallback(async()=>{ setLoading(true); try{ const {data}=await ownerAPI.getRentals({status}); setRentals(data.data); }finally{setLoading(false);} },[status]);

  useEffect(()=>{fetchRentals();},[fetchRentals]);

  useEffect(()=>{
    const handler = () => fetchRentals();
    window.addEventListener('data-refresh', handler);
    return () => window.removeEventListener('data-refresh', handler);
  },[fetchRentals]);

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
}