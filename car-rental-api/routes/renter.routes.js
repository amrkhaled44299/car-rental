const express = require('express');
const router  = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { browseCars, getCarDetail, getCarAvailability, uploadLicense, getMyLicense, createRentalRequest, getMyRentals, cancelRental, submitReview, getProfile, updateProfile } = require('../controllers/renter.controller');

router.get('/cars',                   browseCars);
router.get('/cars/:id',               getCarDetail);
router.get('/cars/:id/availability',  getCarAvailability);

const auth = [authenticate, authorize('renter')];

router.get   ('/renter/profile',              ...auth, getProfile);
router.put   ('/renter/profile',              ...auth, upload.single('profile_image'), updateProfile);
router.post  ('/renter/license',              ...auth, upload.fields([{ name: 'front_image', maxCount: 1 }, { name: 'back_image', maxCount: 1 }]), uploadLicense);
router.get   ('/renter/license',              ...auth, getMyLicense);
router.post  ('/renter/rentals',              ...auth, createRentalRequest);
router.get   ('/renter/rentals',              ...auth, getMyRentals);
router.delete('/renter/rentals/:id',          ...auth, cancelRental);
router.post  ('/renter/rentals/:id/review',   ...auth, submitReview);

module.exports = router;