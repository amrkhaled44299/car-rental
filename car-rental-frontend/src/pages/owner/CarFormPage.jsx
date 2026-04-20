import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ownerAPI } from '../../services/api';
export default function CarFormPage() {
  const { id } = useParams(); const navigate = useNavigate(); const isEdit=Boolean(id);
  const [form,setForm]=useState({brand:'',model:'',year:new Date().getFullYear(),color:'',plate_number:'',price_per_day:'',location:'',seats:5,transmission:'automatic',fuel_type:'petrol',description:''});
  const [images,setImages]=useState([]); const [loading,setLoading]=useState(isEdit); const [submitting,setSubmitting]=useState(false);
  useEffect(()=>{ if(!isEdit) return; ownerAPI.getCarById(id).then(({data})=>{ const c=data.data; setForm({brand:c.brand,model:c.model,year:c.year,color:c.color,plate_number:c.plate_number,price_per_day:c.price_per_day,location:c.location,seats:c.seats,transmission:c.transmission,fuel_type:c.fuel_type,description:c.description||''}); }).finally(()=>setLoading(false)); },[id,isEdit]);
  const handleSubmit=async e=>{ e.preventDefault(); setSubmitting(true); try{ const fd=new FormData(); Object.entries(form).forEach(([k,v])=>fd.append(k,v)); images.forEach(f=>fd.append('car_images',f)); if(isEdit) await ownerAPI.updateCar(id,fd); else await ownerAPI.createCar(fd); toast.success(isEdit?'Car updated!':'Submitted for approval!'); navigate('/owner/cars'); }catch(err){toast.error(err.response?.data?.message||'Failed');}finally{setSubmitting(false);} };
  const upd=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  if(loading) return <div className="spinner"/>;
  return (
    <div className="page-content fade-up" style={{maxWidth:720}}>
      <div className="page-header"><h1 className="page-title">{isEdit?'Edit Car':'List New Car'}</h1></div>
      <div className="card"><form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
        <div className="grid-2">
          <div className="form-group"><label className="form-label">Brand *</label><input className="form-input" value={form.brand} onChange={upd('brand')} placeholder="Toyota" required/></div>
          <div className="form-group"><label className="form-label">Model *</label><input className="form-input" value={form.model} onChange={upd('model')} placeholder="Corolla" required/></div>
          <div className="form-group"><label className="form-label">Year *</label><input className="form-input" type="number" value={form.year} onChange={upd('year')} min={1990} max={2026} required/></div>
          <div className="form-group"><label className="form-label">Color *</label><input className="form-input" value={form.color} onChange={upd('color')} placeholder="White" required/></div>
          <div className="form-group"><label className="form-label">Plate Number *</label><input className="form-input" value={form.plate_number} onChange={upd('plate_number')} placeholder="ABC 1234" required/></div>
          <div className="form-group"><label className="form-label">Price / Day (EGP) *</label><input className="form-input" type="number" value={form.price_per_day} onChange={upd('price_per_day')} min={0} required/></div>
          <div className="form-group"><label className="form-label">Location *</label><input className="form-input" value={form.location} onChange={upd('location')} placeholder="Cairo" required/></div>
          <div className="form-group"><label className="form-label">Seats</label><input className="form-input" type="number" value={form.seats} onChange={upd('seats')} min={2} max={20}/></div>
          <div className="form-group"><label className="form-label">Transmission</label><select className="form-select" value={form.transmission} onChange={upd('transmission')}><option value="automatic">Automatic</option><option value="manual">Manual</option></select></div>
          <div className="form-group"><label className="form-label">Fuel Type</label><select className="form-select" value={form.fuel_type} onChange={upd('fuel_type')}><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="electric">Electric</option><option value="hybrid">Hybrid</option></select></div>
        </div>
        <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={upd('description')} style={{resize:'vertical'}}/></div>
        <div className="form-group"><label className="form-label">Car Images (up to 6)</label><input className="form-input" type="file" multiple accept="image/*" onChange={e=>setImages(Array.from(e.target.files).slice(0,6))}/></div>
        <div style={{display:'flex',gap:'0.75rem',marginTop:'0.5rem'}}><button type="submit" className="btn btn-primary" disabled={submitting}>{submitting?'Saving...':isEdit?'Save Changes':'Submit Listing'}</button><button type="button" className="btn btn-ghost" onClick={()=>navigate('/owner/cars')}>Cancel</button></div>
      </form></div>
    </div>
  );
}