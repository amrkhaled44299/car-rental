const express = require('express');
const router  = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getMyCars, getMyCarById, createCar, updateCar, deleteCar, getMyRentalRequests, acceptRental, rejectRental, completeRental, getCarAvailability } = require('../controllers/owner.controller');

router.use(authenticate, authorize('car_owner'));

router.get   ('/cars',                   getMyCars);
router.get   ('/cars/:id',               getMyCarById);
router.post  ('/cars',                   upload.array('car_images', 6), createCar);
router.put   ('/cars/:id',               upload.array('car_images', 6), updateCar);
router.delete('/cars/:id',               deleteCar);
router.get   ('/cars/:id/availability',  getCarAvailability);
router.get   ('/rentals',                getMyRentalRequests);
router.put   ('/rentals/:id/accept',     acceptRental);
router.put   ('/rentals/:id/reject',     rejectRental);
router.put   ('/rentals/:id/complete',   completeRental);

module.exports = router;