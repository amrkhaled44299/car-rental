const jwt = require('jsonwebtoken');
const { User } = require('../models/associations');

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role, status: user.status }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });

    if (await User.findOne({ where: { email } }))
      return res.status(409).json({ success: false, message: 'Email already registered.' });

    const userRole = ['renter','car_owner'].includes(role) ? role : 'renter';
    const user     = await User.create({ name, email, password, phone, role: userRole });
    const token    = generateToken(user);

    return res.status(201).json({ success: true, message: 'Registered successfully.', data: { user: user.toSafeObject(), token } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required.' });

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    if (user.status === 'rejected')
      return res.status(403).json({ success: false, message: 'Account rejected.', reason: user.rejection_reason });

    const token = generateToken(user);
    return res.status(200).json({ success: true, message: 'Login successful.', data: { user: user.toSafeObject(), token, isPending: user.status === 'pending' } });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const getMe = async (req, res) =>
  res.status(200).json({ success: true, data: req.user.toSafeObject() });

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Both passwords are required.' });
    if (!(await req.user.comparePassword(currentPassword)))
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    if (newPassword.length < 8)
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });

    req.user.password = newPassword;
    await req.user.save();
    return res.status(200).json({ success: true, message: 'Password updated.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { register, login, getMe, changePassword };