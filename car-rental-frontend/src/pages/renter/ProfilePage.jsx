import { useState } from 'react';
import toast from 'react-hot-toast';
import { renterAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
export default function ProfilePage() {
  const { user, setUser } = useAuth(); const [form,setForm]=useState({name:user?.name||'',phone:user?.phone||''}); const [file,setFile]=useState(null); const [loading,setLoading]=useState(false);
  const handleSubmit=async e=>{ e.preventDefault(); setLoading(true); try{ const fd=new FormData(); fd.append('name',form.name); if(form.phone) fd.append('phone',form.phone); if(file) fd.append('profile_image',file); const {data}=await renterAPI.updateProfile(fd); setUser(data.data); localStorage.setItem('user',JSON.stringify(data.data)); toast.success('Profile updated!'); }catch(err){toast.error(err.response?.data?.message||'Failed');}finally{setLoading(false);} };
  return (
    <div className="page-content fade-up" style={{maxWidth:520}}>
      <h1 className="page-title" style={{marginBottom:'2rem'}}>Profile</h1>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.5rem',paddingBottom:'1.5rem',borderBottom:'1px solid var(--border)'}}>
          <div style={{width:56,height:56,borderRadius:'50%',background:'var(--accent-dim)',border:'2px solid var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontWeight:800,color:'var(--accent)',fontSize:'1.4rem'}}>{user?.name?.[0]?.toUpperCase()}</div>
          <div><div style={{fontFamily:'var(--font-display)',fontWeight:700}}>{user?.name}</div><div style={{fontSize:'0.8rem',color:'var(--text-secondary)'}}>{user?.email}</div></div>
        </div>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
          <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Profile Photo</label><input className="form-input" type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])}/></div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{alignSelf:'flex-start'}}>{loading?'Saving...':'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}