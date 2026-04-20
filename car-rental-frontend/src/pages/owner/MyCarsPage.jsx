import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ownerAPI } from '../../services/api';
export default function MyCarsPage() {
  const [cars,setCars]=useState([]); const [loading,setLoading]=useState(true);
  const fetchCars=()=>{ setLoading(true); ownerAPI.getMyCars().then(({data})=>setCars(data.data)).finally(()=>setLoading(false)); };
  useEffect(fetchCars,[]);
  const handleDelete=async(id,label)=>{ if(!window.confirm('Delete '+label+'?')) return; try{ await ownerAPI.deleteCar(id); toast.success('Deleted'); fetchCars(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };
  return (
    <div className="page-content fade-up">
      <div className="page-header"><h1 className="page-title">My Cars</h1><Link to="/owner/cars/new" className="btn btn-primary">+ New Listing</Link></div>
      {loading?<div className="spinner"/>:cars.length===0?<div className="empty-state"><h3>No cars yet</h3><Link to="/owner/cars/new" className="btn btn-primary" style={{marginTop:'1rem'}}>Add First Car</Link></div>:
      <div className="table-wrap"><table><thead><tr><th>Car</th><th>Price/Day</th><th>Status</th><th>Rating</th><th>Actions</th></tr></thead><tbody>
        {cars.map(car=><tr key={car.id}><td><div style={{fontWeight:600}}>{car.brand} {car.model}</div><div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{car.year} · {car.location}</div></td><td style={{fontFamily:'var(--font-display)',fontWeight:700,color:'var(--accent)'}}>{car.price_per_day} EGP</td><td><span className={'badge badge-'+car.status}>{car.status}</span></td><td style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>{car.avg_rating?'★ '+car.avg_rating+' ('+car.reviews_count+')':'—'}</td><td><div style={{display:'flex',gap:'0.4rem'}}><Link to={'/owner/cars/'+car.id+'/edit'} className="btn btn-ghost btn-sm">Edit</Link><button className="btn btn-danger btn-sm" onClick={()=>handleDelete(car.id,car.brand+' '+car.model)}>Delete</button></div></td></tr>)}
      </tbody></table></div>}
    </div>
  );
}