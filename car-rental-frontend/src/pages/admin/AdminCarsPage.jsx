import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

function RejectModal({title,onConfirm,onClose}){ const [reason,setReason]=useState(''); return <div className="modal-overlay" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><h2 className="modal-title">{title}</h2><div className="form-group"><label className="form-label">Reason</label><textarea className="form-input" rows={4} value={reason} onChange={e=>setReason(e.target.value)} style={{resize:'vertical'}}/></div><div style={{display:'flex',gap:'0.75rem',marginTop:'1.25rem',justifyContent:'flex-end'}}><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-danger" onClick={()=>{if(reason.trim())onConfirm(reason);else toast.error('Reason required');}}>Confirm</button></div></div></div>; }

export default function AdminCarsPage() {
  const [cars,setCars]=useState([]); const [loading,setLoading]=useState(true); const [status,setStatus]=useState('pending'); const [modal,setModal]=useState(null);

  const fetchCars=useCallback(async()=>{ setLoading(true); try{ const {data}=await adminAPI.getCars({status,limit:50}); setCars(data.data); }finally{setLoading(false);} },[status]);

  useEffect(()=>{fetchCars();},[fetchCars]);

  useEffect(()=>{
    const handler = () => fetchCars();
    window.addEventListener('data-refresh', handler);
    return () => window.removeEventListener('data-refresh', handler);
  },[fetchCars]);

  const handleApprove=async(id,label)=>{ try{ await adminAPI.approveCar(id); toast.success(label+' approved'); fetchCars(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };
  const handleReject=async(id,reason)=>{ try{ await adminAPI.rejectCar(id,{reason}); toast.success('Rejected'); setModal(null); fetchCars(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };

  return (
    <div className="page-content fade-up">
      <div className="page-header"><h1 className="page-title">Cars</h1><div style={{display:'flex',gap:'0.5rem'}}>{['pending','active','rejected','rented'].map(s=><button key={s} className={'btn btn-sm '+(status===s?'btn-primary':'btn-ghost')} onClick={()=>setStatus(s)}>{s}</button>)}</div></div>
      <div className="table-wrap"><table><thead><tr><th>Car</th><th>Owner</th><th>Location</th><th>Price/Day</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        {loading?<tr><td colSpan={6}><div className="spinner"/></td></tr>:cars.length===0?<tr><td colSpan={6} style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem'}}>No cars</td></tr>:cars.map(car=><tr key={car.id}><td><div style={{fontWeight:600}}>{car.brand} {car.model}</div><div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{car.year} · {car.plate_number}</div></td><td style={{color:'var(--text-secondary)'}}>{car.owner?.name}</td><td style={{color:'var(--text-secondary)'}}>{car.location}</td><td style={{fontFamily:'var(--font-display)',fontWeight:700,color:'var(--accent)'}}>{car.price_per_day} EGP</td><td><span className={'badge badge-'+car.status}>{car.status}</span></td><td><div style={{display:'flex',gap:'0.4rem'}}>{car.status==='pending'&&<><button className="btn btn-success btn-sm" onClick={()=>handleApprove(car.id,car.brand+' '+car.model)}>Approve</button><button className="btn btn-danger btn-sm" onClick={()=>setModal(car)}>Reject</button></>}</div></td></tr>)}
      </tbody></table></div>
      {modal&&<RejectModal title={'Reject '+modal.brand+' '+modal.model+'?'} onConfirm={r=>handleReject(modal.id,r)} onClose={()=>setModal(null)}/>}
    </div>
  );
}