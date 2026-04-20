import { useState, useEffect, useCallback } from 'react';
import { carsAPI } from '../../services/api';
import CarCard from '../../components/common/CarCard';
import './HomePage.css';
const init = { brand:'', location:'', min_price:'', max_price:'', transmission:'', start_date:'', end_date:'', sort:'newest' };
export default function HomePage() {
  const [cars,setCars]=useState([]); const [filters,setFilters]=useState(init); const [loading,setLoading]=useState(true); const [page,setPage]=useState(1); const [total,setTotal]=useState(0);
  const fetchCars = useCallback(async(p=1,f=filters) => { setLoading(true); try { const params={...f,page:p,limit:12}; Object.keys(params).forEach(k=>{ if(!params[k]) delete params[k]; }); const {data}=await carsAPI.browse(params); setCars(data.data); setTotal(data.pagination.total); } catch { setCars([]); } finally { setLoading(false); } },[]);// eslint-disable-line
  useEffect(()=>{ fetchCars(1,init); },[]);// eslint-disable-line
  const upd = k => e => setFilters(f=>({...f,[k]:e.target.value}));
  return (
    <div className="home-page">
      <div className="hero"><div className="hero-content"><p className="hero-eyebrow">Find Your Ride</p><h1 className="hero-title">Drive Any Car,<br/>Any Day</h1><p className="hero-sub">Browse verified cars from trusted owners across Egypt.</p></div><div className="hero-accent">◆</div></div>
      <div className="filter-bar-wrap">
        <form className="filter-bar" onSubmit={e=>{e.preventDefault();setPage(1);fetchCars(1,filters);}}>
          <input className="form-input filter-input" placeholder="Brand..." value={filters.brand} onChange={upd('brand')} />
          <input className="form-input filter-input" placeholder="Location..." value={filters.location} onChange={upd('location')} />
          <input className="form-input filter-input" placeholder="Min price" type="number" value={filters.min_price} onChange={upd('min_price')} />
          <input className="form-input filter-input" placeholder="Max price" type="number" value={filters.max_price} onChange={upd('max_price')} />
          <select className="form-select filter-input" value={filters.transmission} onChange={upd('transmission')}><option value="">Transmission</option><option value="automatic">Automatic</option><option value="manual">Manual</option></select>
          <input className="form-input filter-input" type="date" value={filters.start_date} onChange={upd('start_date')} />
          <input className="form-input filter-input" type="date" value={filters.end_date} onChange={upd('end_date')} />
          <select className="form-select filter-input" value={filters.sort} onChange={upd('sort')}><option value="newest">Newest</option><option value="price_asc">Price ↑</option><option value="price_desc">Price ↓</option></select>
          <button className="btn btn-primary" type="submit">Search</button>
          <button className="btn btn-ghost" type="button" onClick={()=>{setFilters(init);setPage(1);fetchCars(1,init);}}>Reset</button>
        </form>
      </div>
      <div className="page-content">
        <div style={{marginBottom:'1rem',color:'var(--text-secondary)',fontSize:'0.875rem'}}>{loading?'Loading...':total+' cars found'}</div>
        {loading ? <div className="spinner"/> : cars.length===0 ? <div className="empty-state"><h3>No cars found</h3><p>Try adjusting your filters</p></div> : <div className="grid-4 fade-up">{cars.map(car=><CarCard key={car.id} car={car}/>)}</div>}
        {total>12 && <div className="pagination"><button className="btn btn-ghost btn-sm" disabled={page===1} onClick={()=>{setPage(p=>p-1);fetchCars(page-1);}}>← Prev</button><span style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>Page {page}</span><button className="btn btn-ghost btn-sm" disabled={page*12>=total} onClick={()=>{setPage(p=>p+1);fetchCars(page+1);}}>Next →</button></div>}
      </div>
    </div>
  );
}