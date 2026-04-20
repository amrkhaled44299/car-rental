const { Op } = require('sequelize');
const { Car, User, RentalRequest, Availability, Review, DriverLicense } = require('../models/associations');
const { notifyOwnerNewRentalRequest, notifyAdminNewPending } = require('../config/socket');

const browseCars = async (req, res) => {
  try {
    const { brand, location, min_price, max_price, transmission, fuel_type, start_date, end_date, sort='newest' } = req.query;
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const where = { status: 'active' };
    if (brand)        where.brand        = { [Op.like]: `%${brand}%` };
    if (location)     where.location     = { [Op.like]: `%${location}%` };
    if (transmission) where.transmission = transmission;
    if (fuel_type)    where.fuel_type    = fuel_type;
    if (min_price || max_price) { where.price_per_day = {}; if (min_price) where.price_per_day[Op.gte] = parseFloat(min_price); if (max_price) where.price_per_day[Op.lte] = parseFloat(max_price); }
    if (start_date && end_date) { const blocked = await Availability.findAll({ where: { date: { [Op.between]: [start_date,end_date] }, is_available: false }, attributes: ['car_id'], group: ['car_id'] }); const ids = blocked.map(b=>b.car_id); if (ids.length) where.id = { [Op.notIn]: ids }; }
    const orderMap = { newest:[['created_at','DESC']], price_asc:[['price_per_day','ASC']], price_desc:[['price_per_day','DESC']] };
    const { count, rows } = await Car.findAndCountAll({ where, include: [{ model: User, as: 'owner', attributes: ['id','name','phone'] }, { model: Review, as: 'reviews', attributes: ['rating'] }], limit, offset: (page-1)*limit, order: orderMap[sort]||orderMap.newest });
    const result = rows.map(car => { const c=car.toJSON(); const ratings=c.reviews.map(r=>r.rating); c.avg_rating=ratings.length?(ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1):null; c.reviews_count=ratings.length; delete c.reviews; return c; });
    return res.json({ success: true, data: result, pagination: { total: count, page, limit, pages: Math.ceil(count/limit) } });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const getCarDetail = async (req, res) => {
  try {
    const car = await Car.findOne({ where: { id: req.params.id, status: { [Op.in]: ['active','rented'] } }, include: [{ model: User, as: 'owner', attributes: ['id','name','phone'] }, { model: Review, as: 'reviews', include: [{ model: User, as: 'reviewer', attributes: ['id','name'] }] }] });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    const c=car.toJSON(); const ratings=c.reviews.map(r=>r.rating); c.avg_rating=ratings.length?(ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1):null; c.reviews_count=ratings.length;
    return res.json({ success: true, data: c });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const getCarAvailability = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    const { month, year } = req.query;
    const where = { car_id: car.id };
    if (month && year) { const start=`${year}-${String(month).padStart(2,'0')}-01`; const end=new Date(year,month,0).toISOString().split('T')[0]; where.date={[Op.between]:[start,end]}; }
    else { const from=new Date(); const to=new Date(); to.setDate(to.getDate()+60); where.date={[Op.between]:[from.toISOString().split('T')[0],to.toISOString().split('T')[0]]}; }
    const blocked = await Availability.findAll({ where: { ...where, is_available: false }, attributes: ['date'] });
    return res.json({ success: true, data: { blocked_dates: blocked.map(b=>b.date) } });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const uploadLicense = async (req, res) => {
  try {
    const { license_number, expiry_date } = req.body;
    if (!license_number || !expiry_date) return res.status(400).json({ success: false, message: 'License number and expiry date required.' });
    if (!req.files?.front_image || !req.files?.back_image) return res.status(400).json({ success: false, message: 'Both front and back images required.' });
    if (new Date(expiry_date) <= new Date()) return res.status(400).json({ success: false, message: 'License is expired.' });
    const existing = await DriverLicense.findOne({ where: { user_id: req.user.id } });
    const data = { user_id: req.user.id, license_number, expiry_date, front_image: req.files.front_image[0].path, back_image: req.files.back_image[0].path, status: 'pending', rejection_reason: null };
    let license;
    if (existing) { await existing.update(data); license = existing; } else { license = await DriverLicense.create(data); }
    notifyAdminNewPending('license', { user_id: req.user.id, name: req.user.name });
    return res.status(201).json({ success: true, message: 'License uploaded. Awaiting verification.', data: license });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const getMyLicense = async (req, res) => {
  try {
    const license = await DriverLicense.findOne({ where: { user_id: req.user.id } });
    if (!license) return res.status(404).json({ success: false, message: 'No license uploaded yet.' });
    return res.json({ success: true, data: license });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const createRentalRequest = async (req, res) => {
  try {
    const { car_id, start_date, end_date, notes } = req.body;
    if (!car_id || !start_date || !end_date) return res.status(400).json({ success: false, message: 'car_id, start_date, end_date required.' });
    const start=new Date(start_date); const end=new Date(end_date); const today=new Date(); today.setHours(0,0,0,0);
    if (start < today) return res.status(400).json({ success: false, message: 'Start date cannot be in the past.' });
    if (end <= start)  return res.status(400).json({ success: false, message: 'End date must be after start date.' });
    const license = await DriverLicense.findOne({ where: { user_id: req.user.id } });
    if (!license || license.status !== 'verified') return res.status(403).json({ success: false, message: 'You need a verified driver license.', license_status: license?.status || 'not_uploaded' });
    const car = await Car.findOne({ where: { id: car_id, status: 'active' } });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found or not available.' });
    if (car.owner_id === req.user.id) return res.status(400).json({ success: false, message: 'Cannot rent your own car.' });
    const blocked = await Availability.findOne({ where: { car_id, date: { [Op.between]: [start_date,end_date] }, is_available: false } });
    if (blocked) return res.status(409).json({ success: false, message: 'Some dates are not available.' });
    const overlap = await RentalRequest.findOne({ where: { car_id, status: { [Op.in]: ['pending','accepted'] }, [Op.or]: [{ start_date: { [Op.between]: [start_date,end_date] } }, { end_date: { [Op.between]: [start_date,end_date] } }, { start_date: { [Op.lte]: start_date }, end_date: { [Op.gte]: end_date } }] } });
    if (overlap) return res.status(409).json({ success: false, message: 'Car already has a booking for these dates.' });
    const days=Math.max(1,Math.round((end-start)/86400000)); const total_price=(days*parseFloat(car.price_per_day)).toFixed(2);
    const rental = await RentalRequest.create({ car_id, renter_id: req.user.id, start_date, end_date, total_price, notes, status: 'pending' });
    notifyOwnerNewRentalRequest(car.owner_id, { id: rental.id, start_date, end_date, total_price, renter: req.user.name });
    return res.status(201).json({ success: true, message: 'Request sent. Waiting for owner approval.', data: { ...rental.toJSON(), days, total_price } });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const getMyRentals = async (req, res) => {
  try {
    const where = { renter_id: req.user.id };
    if (req.query.status) where.status = req.query.status;
    const rentals = await RentalRequest.findAll({ where, include: [{ model: Car, as: 'car', include: [{ model: User, as: 'owner', attributes: ['id','name','phone'] }] }, { model: Review, as: 'review', required: false }], order: [['created_at','DESC']] });
    return res.json({ success: true, data: rentals });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const cancelRental = async (req, res) => {
  try {
    const rental = await RentalRequest.findOne({ where: { id: req.params.id, renter_id: req.user.id } });
    if (!rental) return res.status(404).json({ success: false, message: 'Rental not found.' });
    if (rental.status !== 'pending') return res.status(400).json({ success: false, message: `Cannot cancel a ${rental.status} rental.` });
    await rental.update({ status: 'rejected', rejection_reason: 'Cancelled by renter.' });
    return res.json({ success: true, message: 'Rental cancelled.' });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const submitReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ success: false, message: 'Rating must be 1-5.' });
    const rental = await RentalRequest.findOne({ where: { id: req.params.id, renter_id: req.user.id, status: 'completed' } });
    if (!rental) return res.status(404).json({ success: false, message: 'Completed rental not found.' });
    if (await Review.findOne({ where: { rental_request_id: rental.id } })) return res.status(409).json({ success: false, message: 'Already reviewed.' });
    const review = await Review.create({ rental_request_id: rental.id, reviewer_id: req.user.id, car_id: rental.car_id, rating: parseInt(rating), comment });
    return res.status(201).json({ success: true, message: 'Review submitted!', data: review });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] }, include: [{ model: DriverLicense, as: 'license', required: false }] });
    return res.json({ success: true, data: user });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name)  updates.name  = req.body.name;
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.file)       updates.profile_image = req.file.path;
    await req.user.update(updates);
    return res.json({ success: true, message: 'Profile updated.', data: req.user.toSafeObject() });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

module.exports = { browseCars, getCarDetail, getCarAvailability, uploadLicense, getMyLicense, createRentalRequest, getMyRentals, cancelRental, submitReview, getProfile, updateProfile };