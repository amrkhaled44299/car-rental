import { Link } from 'react-router-dom';
import './CarCard.css';
const stars = n => { if (!n) return null; const r = Math.round(parseFloat(n)); return '★'.repeat(r) + '☆'.repeat(5-r); };
export default function CarCard({ car }) {
  const img = car.images?.[0] ? (process.env.REACT_APP_API_URL?.replace('/api','') || '') + '/' + car.images[0] : null;
  return (
    <Link to={'/cars/' + car.id} className="car-card">
      <div className="car-card-img">
        {img ? <img src={img} alt={car.brand + ' ' + car.model} /> : <div className="car-card-no-img">◆</div>}
        <div className="car-card-price">{car.price_per_day} EGP<span>/day</span></div>
      </div>
      <div className="car-card-body">
        <h3 className="car-card-title">{car.brand} {car.model} <span className="car-year">'{String(car.year).slice(-2)}</span></h3>
        <p className="car-card-location">{car.location}</p>
        <div className="car-card-tags"><span className="car-tag">{car.seats} seats</span><span className="car-tag">{car.transmission}</span><span className="car-tag">{car.fuel_type}</span></div>
        {car.avg_rating && <div className="car-card-rating"><span className="stars" style={{ fontSize:'0.75rem' }}>{stars(car.avg_rating)}</span><span style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{car.avg_rating} ({car.reviews_count})</span></div>}
      </div>
    </Link>
  );
}