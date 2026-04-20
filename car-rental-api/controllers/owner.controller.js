const { Op } = require('sequelize');
const { Car, RentalRequest, Availability, User, Review, DriverLicense } = require('../models/associations');
const { notifyAdminNewPending, notifyRenterRentalUpdate } = require('../config/socket');

const getMyCars = async (req, res) => {
  try {
    const cars = await Car.findAll({ where: { owner_id: req.user.id }, include: [{ model: Review, as: 'reviews', attributes: ['rating'] }], order: [['created_at','DESC']] });
    const result = cars.map(car => { const c = car.toJSON(); const ratings = c.reviews.map(r => r.rating); c.avg_rating = ratings.length ? (ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1) : null; c.reviews_count = ratings.length; delete c.reviews; return c; });
    return res.json({ success: true, data: result });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const getMyCarById = async (req, res) => {
  try {
    const car = await Car.findOne({ where: { id: req.params.id, owner_id: req.user.id }, include: [{ model: Review, as: 'reviews' }] });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    return res.json({ success: true, data: car });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const createCar = async (req, res) => {
  try {
    if (req.user.status !== 'active') return res.status(403).json({ success: false, message: 'Account must be approved first.' });
    const { brand, model, year, color, plate_number, price_per_day, description, location, seats, transmission, fuel_type } = req.body;
    if (!brand || !model || !year || !color || !plate_number || !price_per_day || !location)
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    const images = req.files ? req.files.map(f => f.path) : [];
    const car    = await Car.create({ owner_id: req.user.id, brand, model, year, color, plate_number, price_per_day, description, location, seats: seats||5, transmission: transmission||'automatic', fuel_type: fuel_type||'petrol', images, status: 'pending' });
    notifyAdminNewPending('car', { id: car.id, brand: car.brand, model: car.model, owner: req.user.name });
    return res.status(201).json({ success: true, message: 'Car submitted for approval.', data: car });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ success: false, message: 'Plate number already registered.' });
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const updateCar = async (req, res) => {
  try {
    const car = await Car.findOne({ where: { id: req.params.id, owner_id: req.user.id } });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    if (car.status === 'rented') return res.status(400).json({ success: false, message: 'Cannot edit a rented car.' });
    const allowed = ['brand','model','year','color','price_per_day','description','location','seats','transmission','fuel_type'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    if (req.files?.length) updates.images = [...(car.images||[]), ...req.files.map(f=>f.path)];
    const majorChanged = ['brand','model','year','price_per_day'].some(f => updates[f] !== undefined);
    if (majorChanged && car.status === 'active') updates.status = 'pending';
    await car.update(updates);
    return res.json({ success: true, message: 'Car updated.', data: car });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findOne({ where: { id: req.params.id, owner_id: req.user.id } });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    if (car.status === 'rented') return res.status(400).json({ success: false, message: 'Cannot delete a rented car.' });
    await car.destroy();
    return res.json({ success: true, message: 'Car deleted.' });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const getMyRentalRequests = async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    const rentals = await RentalRequest.findAll({ where, include: [{ model: Car, as: 'car', where: { owner_id: req.user.id }, attributes: ['id','brand','model','year','plate_number'] }, { model: User, as: 'renter', attributes: ['id','name','email','phone'], include: [{ model: DriverLicense, as: 'license', attributes: ['status'] }] }], order: [['created_at','DESC']] });
    return res.json({ success: true, data: rentals });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const acceptRental = async (req, res) => {
  try {
    const rental = await RentalRequest.findByPk(req.params.id, { include: [{ model: Car, as: 'car', where: { owner_id: req.user.id } }] });
    if (!rental) return res.status(404).json({ success: false, message: 'Rental not found.' });
    if (rental.status !== 'pending') return res.status(400).json({ success: false, message: `Already ${rental.status}.` });

    const conflicting = await Availability.findOne({ where: { car_id: rental.car_id, date: { [Op.between]: [rental.start_date, rental.end_date] }, is_available: false } });
    if (conflicting) { await rental.update({ status: 'rejected', rejection_reason: 'Dates no longer available.' }); return res.status(409).json({ success: false, message: 'Dates not available.' }); }

    await rental.update({ status: 'accepted' });
    await rental.car.update({ status: 'rented' });
    notifyRenterRentalUpdate(rental.renter_id, { id: rental.id }, 'accepted');

    const dates = []; const current = new Date(rental.start_date); const end = new Date(rental.end_date);
    while (current <= end) { dates.push({ car_id: rental.car_id, date: current.toISOString().split('T')[0], is_available: false, rental_request_id: rental.id }); current.setDate(current.getDate()+1); }
    await Availability.bulkCreate(dates, { updateOnDuplicate: ['is_available','rental_request_id'] });

    return res.json({ success: true, message: 'Rental accepted.', data: rental });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const rejectRental = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ success: false, message: 'Reason required.' });
    const rental = await RentalRequest.findByPk(req.params.id, { include: [{ model: Car, as: 'car', where: { owner_id: req.user.id } }] });
    if (!rental) return res.status(404).json({ success: false, message: 'Rental not found.' });
    if (rental.status !== 'pending') return res.status(400).json({ success: false, message: `Already ${rental.status}.` });
    await rental.update({ status: 'rejected', rejection_reason: reason });
    notifyRenterRentalUpdate(rental.renter_id, { id: rental.id }, 'rejected', reason);
    return res.json({ success: true, message: 'Rental rejected.', data: rental });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const completeRental = async (req, res) => {
  try {
    const rental = await RentalRequest.findByPk(req.params.id, { include: [{ model: Car, as: 'car', where: { owner_id: req.user.id } }] });
    if (!rental) return res.status(404).json({ success: false, message: 'Rental not found.' });
    if (rental.status !== 'accepted') return res.status(400).json({ success: false, message: 'Only accepted rentals can be completed.' });
    await rental.update({ status: 'completed' });
    await rental.car.update({ status: 'active' });
    notifyRenterRentalUpdate(rental.renter_id, { id: rental.id }, 'completed');
    return res.json({ success: true, message: 'Rental completed.', data: rental });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const getCarAvailability = async (req, res) => {
  try {
    const car = await Car.findOne({ where: { id: req.params.id, owner_id: req.user.id } });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    const { month, year } = req.query;
    const where = { car_id: car.id };
    if (month && year) { const start = `${year}-${String(month).padStart(2,'0')}-01`; const end = new Date(year,month,0).toISOString().split('T')[0]; where.date = { [Op.between]: [start,end] }; }
    const availability = await Availability.findAll({ where, order: [['date','ASC']] });
    return res.json({ success: true, data: availability });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

module.exports = { getMyCars, getMyCarById, createCar, updateCar, deleteCar, getMyRentalRequests, acceptRental, rejectRental, completeRental, getCarAvailability };