const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RentalRequest = sequelize.define('RentalRequest', {
  id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  car_id:     { type: DataTypes.INTEGER, allowNull: false },
  renter_id:  { type: DataTypes.INTEGER, allowNull: false },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date:   { type: DataTypes.DATEONLY, allowNull: false },
  total_price:{ type: DataTypes.DECIMAL(10,2), allowNull: false },
  status:     { type: DataTypes.ENUM('pending','accepted','rejected','completed'), defaultValue: 'pending' },
  rejection_reason: { type: DataTypes.TEXT, allowNull: true },
  notes:      { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'rental_requests', timestamps: true, underscored: true });

const Availability = sequelize.define('Availability', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  car_id:   { type: DataTypes.INTEGER, allowNull: false },
  date:     { type: DataTypes.DATEONLY, allowNull: false },
  is_available: { type: DataTypes.BOOLEAN, defaultValue: true },
  rental_request_id: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'availability', timestamps: true, underscored: true,
     indexes: [{ unique: true, fields: ['car_id','date'] }] });

const Review = sequelize.define('Review', {
  id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rental_request_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  reviewer_id:{ type: DataTypes.INTEGER, allowNull: false },
  car_id:     { type: DataTypes.INTEGER, allowNull: false },
  rating:     { type: DataTypes.INTEGER, allowNull: false, validate: { min:1, max:5 } },
  comment:    { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'reviews', timestamps: true, underscored: true });

const DriverLicense = sequelize.define('DriverLicense', {
  id:             { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:        { type: DataTypes.INTEGER, allowNull: false, unique: true },
  license_number: { type: DataTypes.STRING(50), allowNull: false },
  front_image:    { type: DataTypes.STRING(255), allowNull: false },
  back_image:     { type: DataTypes.STRING(255), allowNull: false },
  expiry_date:    { type: DataTypes.DATEONLY, allowNull: false },
  status:         { type: DataTypes.ENUM('pending','verified','rejected'), defaultValue: 'pending' },
  rejection_reason: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'driver_licenses', timestamps: true, underscored: true });

module.exports = { RentalRequest, Availability, Review, DriverLicense };