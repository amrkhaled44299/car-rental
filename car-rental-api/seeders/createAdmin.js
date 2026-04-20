require('dotenv').config();
const { connectDB }         = require('../config/database');
const { setupAssociations } = require('../models/associations');
const User                  = require('../models/User');

const createAdmin = async () => {
  await connectDB();
  setupAssociations();
  const existing = await User.findOne({ where: { role: 'admin' } });
  if (existing) { console.log('✅ Admin already exists:', existing.email); process.exit(0); }
  const admin = await User.create({ name: 'System Admin', email: 'admin@carrental.com', password: 'Admin@123456', role: 'admin', status: 'active' });
  console.log('✅ Admin created!\n   Email:', admin.email, '\n   Password: Admin@123456');
  process.exit(0);
};

createAdmin().catch(err => { console.error('❌', err); process.exit(1); });