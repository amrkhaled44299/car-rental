const User = require('./User');
const Car  = require('./Car');
const { RentalRequest, Availability, Review, DriverLicense } = require('./index');

const setupAssociations = () => {
  User.hasMany(Car,           { foreignKey: 'owner_id',          as: 'cars' });
  Car.belongsTo(User,         { foreignKey: 'owner_id',          as: 'owner' });

  Car.hasMany(RentalRequest,  { foreignKey: 'car_id',            as: 'rentalRequests' });
  RentalRequest.belongsTo(Car,{ foreignKey: 'car_id',            as: 'car' });

  User.hasMany(RentalRequest, { foreignKey: 'renter_id',         as: 'rentals' });
  RentalRequest.belongsTo(User,{ foreignKey: 'renter_id',        as: 'renter' });

  Car.hasMany(Availability,   { foreignKey: 'car_id',            as: 'availability' });
  Availability.belongsTo(Car, { foreignKey: 'car_id',            as: 'car' });

  RentalRequest.hasMany(Availability, { foreignKey: 'rental_request_id', as: 'bookedDates' });
  Availability.belongsTo(RentalRequest,{ foreignKey: 'rental_request_id', as: 'rental' });

  RentalRequest.hasOne(Review,{ foreignKey: 'rental_request_id', as: 'review' });
  Review.belongsTo(RentalRequest,{ foreignKey: 'rental_request_id', as: 'rental' });

  User.hasMany(Review,        { foreignKey: 'reviewer_id',       as: 'reviews' });
  Review.belongsTo(User,      { foreignKey: 'reviewer_id',       as: 'reviewer' });

  Car.hasMany(Review,         { foreignKey: 'car_id',            as: 'reviews' });
  Review.belongsTo(Car,       { foreignKey: 'car_id',            as: 'car' });

  User.hasOne(DriverLicense,  { foreignKey: 'user_id',           as: 'license' });
  DriverLicense.belongsTo(User,{ foreignKey: 'user_id',          as: 'user' });
};

module.exports = { User, Car, RentalRequest, Availability, Review, DriverLicense, setupAssociations };