import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

export default function AdminUsersPage() {
  const [users,setUsers]=useState([]); const [loading,setLoading]=useState(true); const [status,setStatus]=useState('pending'); const [search,setSearch]=useState(''); const [modal,setModal]=useState(null); const [reason,setReason]=useState('');
  
  const fetchUsers=useCallback(async()=>{ setLoading(true); try{ const params={status,limit:50}; if(search) params.search=search; const {data}=await adminAPI.getUsers(params); setUsers(data.data); }finally{setLoading(false);} },[status,search]);
  
  useEffect(()=>{fetchUsers();},[fetchUsers]);
  
  useEffect(()=>{
    const handler = () => fetchUsers();
    window.addEventListener('data-refresh', handler);
    return () => window.removeEventListener('data-refresh', handler);
  },[fetchUsers]);

  const handleApprove=async(id,name)=>{ try{ await adminAPI.approveUser(id); toast.success(name+' approved'); fetchUsers(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };
  const handleReject=async()=>{ if(!reason.trim()){toast.error('Reason required');return;} try{ await adminAPI.rejectUser(modal.userId,{reason}); toast.success('Rejected'); setModal(null); setReason(''); fetchUsers(); }catch(err){toast.error(err.response?.data?.message||'Failed');} };

  return (
    <div className="page-content fade-up">
      <div className="page-header"><h1 className="page-title">Users</h1><div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>{['pending','active','rejected'].map(s=><button key={s} className={'btn btn-sm '+(status===s?'btn-primary':'btn-ghost')} onClick={()=>setStatus(s)}>{s}</button>)}<input className="form-input" placeholder="Search..." value={search} style={{width:180}} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetchUsers()}/></div></div>
      <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead><tbody>
        {loading?<tr><td colSpan={6}><div className="spinner"/></td></tr>:users.length===0?<tr><td colSpan={6} style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem'}}>No users</td></tr>:users.map(u=><tr key={u.id}><td style={{fontWeight:600}}>{u.name}</td><td style={{color:'var(--text-secondary)'}}>{u.email}</td><td><span className="badge badge-active" style={{fontSize:'0.7rem'}}>{u.role}</span></td><td><span className={'badge badge-'+u.status}>{u.status}</span></td><td style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>{new Date(u.created_at).toLocaleDateString()}</td><td><div style={{display:'flex',gap:'0.4rem'}}>{u.status==='pending'&&<><button className="btn btn-success btn-sm" onClick={()=>handleApprove(u.id,u.name)}>Approve</button><button className="btn btn-danger btn-sm" onClick={()=>{setModal({userId:u.id,name:u.name});setReason('');}}>Reject</button></>}</div></td></tr>)}
      </tbody></table></div>
      {modal&&<div className="modal-overlay" onClick={()=>setModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}><h2 className="modal-title">Reject "{modal.name}"</h2><div className="form-group"><label className="form-label">Reason</label><textarea className="form-input" rows={4} value={reason} onChange={e=>setReason(e.target.value)} style={{resize:'vertical'}}/></div><div style={{display:'flex',gap:'0.75rem',marginTop:'1.25rem',justifyContent:'flex-end'}}><button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button><button className="btn btn-danger" onClick={handleReject}>Confirm</button></div></div></div>}
    </div>
  );
}