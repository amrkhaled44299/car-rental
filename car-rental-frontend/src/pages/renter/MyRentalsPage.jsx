import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { renterAPI } from '../../services/api';

export default function MyRentalsPage() {
  const [rentals,setRentals]=useState([]); const [loading,setLoading]=useState(true); const [status,setStatus]=useState(''); const [modal,setModal]=useState(null); const [review,setReview]=useState({rating:5,comment:''}); const [submitting,setSubmitting]=useState(false);

  const fetchRentals=useCallback(async()=>{ setLoading(true); try{ const {data}=await renterAPI.getMyRentals(status?{status}:{}); setRentals(data.data); }finally{setLoading(false);} },[status]);

  useEffect(()=>{fetchRentals();},[fetchRentals]);

  useEffect(()=>{
    const handler = () => fetchRentals();
    window.addEventListener('data-refresh', handler);
    return () => window.removeEventListener('data-refresh', handler);
  },[fetchRentals]);

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
}