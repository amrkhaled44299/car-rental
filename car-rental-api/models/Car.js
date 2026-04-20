const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Car = sequelize.define('Car', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  owner_id:     { type: DataTypes.INTEGER, allowNull: false },
  brand:        { type: DataTypes.STRING(50), allowNull: false },
  model:        { type: DataTypes.STRING(50), allowNull: false },
  year:         { type: DataTypes.INTEGER, allowNull: false },
  color:        { type: DataTypes.STRING(30), allowNull: false },
  plate_number: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  price_per_day:{ type: DataTypes.DECIMAL(10,2), allowNull: false },
  description:  { type: DataTypes.TEXT, allowNull: true },
  location:     { type: DataTypes.STRING(100), allowNull: false },
  seats:        { type: DataTypes.INTEGER, defaultValue: 5 },
  transmission: { type: DataTypes.ENUM('automatic','manual'), defaultValue: 'automatic' },
  fuel_type:    { type: DataTypes.ENUM('petrol','diesel','electric','hybrid'), defaultValue: 'petrol' },
  images:       { type: DataTypes.JSON, defaultValue: [] },
  status:       { type: DataTypes.ENUM('pending','active','rented','rejected'), defaultValue: 'pending' },
  rejection_reason: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'cars', timestamps: true, underscored: true });

module.exports = Car;