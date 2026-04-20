const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:     { type: DataTypes.STRING(100), allowNull: false },
  email:    { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING(255), allowNull: false },
  phone:    { type: DataTypes.STRING(20), allowNull: true },
  role:     { type: DataTypes.ENUM('admin','car_owner','renter'), defaultValue: 'renter' },
  status:   { type: DataTypes.ENUM('pending','active','rejected'), defaultValue: 'pending' },
  profile_image:    { type: DataTypes.STRING(255), allowNull: true },
  rejection_reason: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'users', timestamps: true, underscored: true,
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 12);
      if (user.role === 'admin' || user.role === 'renter') user.status = 'active';
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) user.password = await bcrypt.hash(user.password, 12);
    },
  },
});

User.prototype.comparePassword = async function(p) { return bcrypt.compare(p, this.password); };
User.prototype.toSafeObject   = function()          { const { password, ...safe } = this.toJSON(); return safe; };

module.exports = User;