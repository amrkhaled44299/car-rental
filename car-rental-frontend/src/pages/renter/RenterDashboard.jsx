import { useAuth } from '../../context/AuthContext';
export default function RenterDashboard() {
  const { user } = useAuth();
  return (
    <div className="page-content fade-up">
      <div className="page-header"><h1 className="page-title">Welcome, {user?.name?.split(' ')[0]} 👋</h1></div>
      <div className="grid-3">{[{label:'Browse Cars',desc:'Find your next ride',link:'/browse',accent:'var(--accent)'},{label:'My Rentals',desc:'Track your bookings',link:'/my-rentals',accent:'var(--info)'},{label:'Driver License',desc:'Upload & verify',link:'/license',accent:'var(--success)'}].map(item=><a key={item.label} href={item.link} className="card" style={{borderTop:'2px solid '+item.accent,display:'block',textDecoration:'none'}}><div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.05rem',marginBottom:'0.3rem'}}>{item.label}</div><div style={{color:'var(--text-secondary)',fontSize:'0.875rem'}}>{item.desc}</div></a>)}</div>
    </div>
  );
}