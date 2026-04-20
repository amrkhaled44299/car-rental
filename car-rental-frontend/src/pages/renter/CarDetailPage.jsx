import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { carsAPI, renterAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
const stars = n => '★'.repeat(Math.round(n)) + '☆'.repeat(5-Math.round(n));
export default function CarDetailPage() {
  const { id } = useParams(); const navigate = useNavigate(); const { user } = useAuth();
  const [car,setCar]=useState(null); const [loading,setLoading]=useState(true);
  const [booking,setBooking]=useState({start_date:'',end_date:'',notes:''});
  const [submitting,setSubmitting]=useState(false); const [imgIdx,setImgIdx]=useState(0);
  useEffect(()=>{ carsAPI.detail(id).then(({data})=>setCar(data.data)).catch(()=>navigate('/browse')).finally(()=>setLoading(false)); },[id,navigate]);
  const today=new Date().toISOString().split('T')[0];
  const days=booking.start_date&&booking.end_date?Math.max(1,Math.round((new Date(booking.end_date)-new Date(booking.start_date))/86400000)):0;
  const total=car?(days*parseFloat(car.price_per_day)).toFixed(2):0;
  const base=process.env.REACT_APP_API_URL?.replace('/api','')||'';
  const handleBook=async e=>{ e.preventDefault(); if(!user){toast.error('Please login');navigate('/login');return;} if(user.role!=='renter'){toast.error('Only renters can book');return;} setSubmitting(true); try{ await renterAPI.createRental({car_id:id,...booking}); toast.success('Booking request sent!'); navigate('/my-rentals'); }catch(err){toast.error(err.response?.data?.message||'Booking failed');}finally{setSubmitting(false);} };
  if(loading) return <div className="spinner"/>;
  if(!car) return null;
  const images=car.images?.length?car.images:[];
  return (
    <div className="page-content fade-up">
      <button className="btn btn-ghost btn-sm" style={{marginBottom:'1.5rem'}} onClick={()=>navigate(-1)}>← Back</button>
      <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:'2rem',alignItems:'start'}}>
        <div>
          <div style={{borderRadius:'var(--radius-xl)',overflow:'hidden',background:'var(--bg-elevated)',aspectRatio:'16/9',marginBottom:'0.75rem',position:'relative'}}>
            {images.length>0?<img src={base+'/'+images[imgIdx]} alt={car.brand+' '+car.model} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'4rem',color:'var(--text-muted)',opacity:0.3}}>◆</div>}
            <div style={{position:'absolute',top:'1rem',left:'1rem'}}><span className={'badge badge-'+car.status}>{car.status}</span></div>
          </div>
          {images.length>1&&<div style={{display:'flex',gap:'0.5rem',overflowX:'auto'}}>{images.map((img,i)=><div key={i} onClick={()=>setImgIdx(i)} style={{width:72,height:52,borderRadius:'var(--radius-sm)',overflow:'hidden',cursor:'pointer',border:'2px solid '+(i===imgIdx?'var(--accent)':'transparent'),flexShrink:0,background:'var(--bg-elevated)'}}><img src={base+'/'+img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>)}</div>}
          <div style={{marginTop:'1.75rem'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'0.5rem'}}>
              <h1 style={{fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:800,letterSpacing:'-0.03em'}}>{car.brand} {car.model} <span style={{color:'var(--text-muted)',fontWeight:400,fontSize:'1.3rem'}}>{car.year}</span></h1>
              <div style={{textAlign:'right'}}><div style={{fontFamily:'var(--font-display)',fontSize:'1.5rem',fontWeight:800,color:'var(--accent)'}}>{car.price_per_day} EGP</div><div style={{fontSize:'0.8rem',color:'var(--text-secondary)'}}>per day</div></div>
            </div>
            <p style={{color:'var(--text-secondary)',marginBottom:'1.25rem'}}>📍 {car.location}</p>
            {car.avg_rating&&<div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1.25rem'}}><span className="stars">{stars(car.avg_rating)}</span><span style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>{car.avg_rating} · {car.reviews_count} reviews</span></div>}
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1.5rem'}}>{[{l:'Seats',v:car.seats},{l:'Transmission',v:car.transmission},{l:'Fuel',v:car.fuel_type},{l:'Color',v:car.color}].map(({l,v})=><div key={l} className="card" style={{padding:'0.6rem 1rem',flex:'0 0 auto'}}><div style={{fontSize:'0.7rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{l}</div><div style={{fontWeight:600,fontSize:'0.9rem',marginTop:'0.15rem'}}>{v}</div></div>)}</div>
            {car.description&&<div className="card" style={{marginBottom:'1.5rem'}}><h3 style={{fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'0.5rem',fontSize:'0.95rem'}}>About this car</h3><p style={{color:'var(--text-secondary)',lineHeight:1.7}}>{car.description}</p></div>}
            <div className="card" style={{display:'flex',alignItems:'center',gap:'1rem'}}><div style={{width:44,height:44,borderRadius:'50%',background:'var(--accent-dim)',border:'1px solid var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontWeight:800,color:'var(--accent)',fontSize:'1.1rem'}}>{car.owner?.name?.[0]?.toUpperCase()}</div><div><div style={{fontWeight:600}}>{car.owner?.name}</div><div style={{fontSize:'0.8rem',color:'var(--text-secondary)'}}>{car.owner?.phone||'Car Owner'}</div></div></div>
            {car.reviews?.length>0&&<div style={{marginTop:'1.5rem'}}><h2 style={{fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'1rem',fontSize:'1.15rem'}}>Reviews</h2><div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>{car.reviews.map(r=><div key={r.id} className="card"><div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.4rem'}}><span style={{fontWeight:600,fontSize:'0.875rem'}}>{r.reviewer?.name}</span><span className="stars" style={{fontSize:'0.75rem'}}>{stars(r.rating)}</span></div>{r.comment&&<p style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>{r.comment}</p>}</div>)}</div></div>}
          </div>
        </div>
        <div style={{position:'sticky',top:'80px'}}>
          <div className="card">
            <h2 style={{fontFamily:'var(--font-display)',fontWeight:700,marginBottom:'1.25rem',fontSize:'1.1rem'}}>Book this car</h2>
            {car.status!=='active'?<p style={{color:'var(--warning)',fontSize:'0.875rem'}}>Not available for booking.</p>
            :!user?<div><p style={{color:'var(--text-secondary)',fontSize:'0.875rem',marginBottom:'1rem'}}>Login to book</p><button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={()=>navigate('/login')}>Login to Book</button></div>
            :user.role!=='renter'?<p style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>Only renters can book.</p>
            :<form onSubmit={handleBook} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div className="form-group"><label className="form-label">Start Date</label><input className="form-input" type="date" min={today} value={booking.start_date} onChange={e=>setBooking({...booking,start_date:e.target.value})} required/></div>
              <div className="form-group"><label className="form-label">End Date</label><input className="form-input" type="date" min={booking.start_date||today} value={booking.end_date} onChange={e=>setBooking({...booking,end_date:e.target.value})} required/></div>
              <div className="form-group"><label className="form-label">Notes</label><textarea className="form-input" rows={2} value={booking.notes} onChange={e=>setBooking({...booking,notes:e.target.value})} style={{resize:'none'}}/></div>
              {days>0&&<div style={{background:'var(--bg-elevated)',borderRadius:'var(--radius-md)',padding:'1rem'}}><div style={{display:'flex',justifyContent:'space-between',fontSize:'0.875rem',color:'var(--text-secondary)'}}><span>{car.price_per_day} EGP × {days} days</span><span>{total} EGP</span></div><div style={{display:'flex',justifyContent:'space-between',fontFamily:'var(--font-display)',fontWeight:700,color:'var(--accent)',borderTop:'1px solid var(--border)',paddingTop:'0.4rem',marginTop:'0.4rem'}}><span>Total</span><span>{total} EGP</span></div></div>}
              <button className="btn btn-primary btn-lg" type="submit" disabled={submitting} style={{justifyContent:'center'}}>{submitting?'Sending...':'Request to Book'}</button>
              <p style={{fontSize:'0.75rem',color:'var(--text-muted)',textAlign:'center'}}>Request sent to owner for approval</p>
            </form>}
          </div>
        </div>
      </div>
    </div>
  );
}