const { Op } = require('sequelize');
const { User, Car, DriverLicense, RentalRequest, Review } = require('../models/associations');
const { notifyOwnerAccountStatus, notifyOwnerCarStatus, notifyRenterLicenseStatus } = require('../config/socket');

const paginate = (q) => {
  const page  = Math.max(1, parseInt(q.page)  || 1);
  const limit = Math.min(50, parseInt(q.limit) || 10);
  return { limit, offset: (page-1)*limit, page };
};

const getDashboard = async (req, res) => {
  try {
    const [totalUsers, pendingOwners, totalCars, pendingCars, activeCars, totalRentals, completedRentals, pendingLicenses] =
      await Promise.all([
        User.count({ where: { role: { [Op.ne]: 'admin' } } }),
        User.count({ where: { role: 'car_owner', status: 'pending' } }),
        Car.count(),
        Car.count({ where: { status: 'pending' } }),
        Car.count({ where: { status: 'active' } }),
        RentalRequest.count(),
        RentalRequest.count({ where: { status: 'completed' } }),
        DriverLicense.count({ where: { status: 'pending' } }),
      ]);
    return res.json({ success: true, data: { users: { total: totalUsers, pendingOwners }, cars: { total: totalCars, pending: pendingCars, active: activeCars }, rentals: { total: totalRentals, completed: completedRentals }, pendingLicenses } });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const getUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    const { limit, offset, page }  = paginate(req.query);
    const where = { role: { [Op.ne]: 'admin' } };
    if (role)   where.role   = role;
    if (status) where.status = status;
    if (search) where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }];

    const { count, rows } = await User.findAndCountAll({ where, attributes: { exclude: ['password'] }, include: [{ model: DriverLicense, as: 'license', required: false }], limit, offset, order: [['created_at','DESC']] });
    return res.json({ success: true, data: rows, pagination: { total: count, page, limit, pages: Math.ceil(count/limit) } });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] }, include: [{ model: DriverLicense, as: 'license', required: false }, { model: Car, as: 'cars', required: false }] });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return res.json({ success: true, data: user });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const approveUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.status === 'active') return res.status(400).json({ success: false, message: 'Already active.' });
    await user.update({ status: 'active', rejection_reason: null });
    notifyOwnerAccountStatus(user.id, 'active');
    return res.json({ success: true, message: `${user.name} approved.`, data: user.toSafeObject() });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const rejectUser = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ success: false, message: 'Reason required.' });
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    await user.update({ status: 'rejected', rejection_reason: reason });
    notifyOwnerAccountStatus(user.id, 'rejected', reason);
    return res.json({ success: true, message: `${user.name} rejected.`, data: user.toSafeObject() });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin.' });
    await user.destroy();
    return res.json({ success: true, message: 'User deleted.' });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const getCars = async (req, res) => {
  try {
    const { status, search } = req.query;
    const { limit, offset, page } = paginate(req.query);
    const where = {};
    if (status) where.status = status;
    if (search) where[Op.or] = [{ brand: { [Op.like]: `%${search}%` } }, { model: { [Op.like]: `%${search}%` } }, { plate_number: { [Op.like]: `%${search}%` } }];

    const { count, rows } = await Car.findAndCountAll({ where, include: [{ model: User, as: 'owner', attributes: ['id','name','email','phone'] }], limit, offset, order: [['created_at','DESC']] });
    return res.json({ success: true, data: rows, pagination: { total: count, page, limit, pages: Math.ceil(count/limit) } });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const getCarById = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id, { include: [{ model: User, as: 'owner', attributes: ['id','name','email'] }, { model: Review, as: 'reviews' }] });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    return res.json({ success: true, data: car });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const approveCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id, { include: [{ model: User, as: 'owner' }] });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    if (car.owner.status !== 'active') return res.status(400).json({ success: false, message: 'Approve the owner first.' });
    await car.update({ status: 'active', rejection_reason: null });
    notifyOwnerCarStatus(car.owner_id, { id: car.id, brand: car.brand, model: car.model }, 'active');
    return res.json({ success: true, message: `${car.brand} ${car.model} approved.`, data: car });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const rejectCar = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ success: false, message: 'Reason required.' });
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    await car.update({ status: 'rejected', rejection_reason: reason });
    notifyOwnerCarStatus(car.owner_id, { id: car.id, brand: car.brand, model: car.model }, 'rejected', reason);
    return res.json({ success: true, message: 'Car rejected.', data: car });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found.' });
    await car.destroy();
    return res.json({ success: true, message: 'Car deleted.' });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const getLicenses = async (req, res) => {
  try {
    const { status } = req.query;
    const { limit, offset, page } = paginate(req.query);
    const where = {};
    if (status) where.status = status;
    const { count, rows } = await DriverLicense.findAndCountAll({ where, include: [{ model: User, as: 'user', attributes: ['id','name','email'] }], limit, offset, order: [['created_at','DESC']] });
    return res.json({ success: true, data: rows, pagination: { total: count, page, limit, pages: Math.ceil(count/limit) } });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const verifyLicense = async (req, res) => {
  try {
    const license = await DriverLicense.findByPk(req.params.id);
    if (!license) return res.status(404).json({ success: false, message: 'License not found.' });
    await license.update({ status: 'verified', rejection_reason: null });
    notifyRenterLicenseStatus(license.user_id, 'verified');
    return res.json({ success: true, message: 'License verified.', data: license });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

const rejectLicense = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ success: false, message: 'Reason required.' });
    const license = await DriverLicense.findByPk(req.params.id);
    if (!license) return res.status(404).json({ success: false, message: 'License not found.' });
    await license.update({ status: 'rejected', rejection_reason: reason });
    notifyRenterLicenseStatus(license.user_id, 'rejected', reason);
    return res.json({ success: true, message: 'License rejected.', data: license });
  } catch { return res.status(500).json({ success: false, message: 'Server error.' }); }
};

module.exports = { getDashboard, getUsers, getUserById, approveUser, rejectUser, deleteUser, getCars, getCarById, approveCar, rejectCar, deleteCar, getLicenses, verifyLicense, rejectLicense };