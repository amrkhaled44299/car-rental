const express = require('express');
const router  = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getDashboard, getUsers, getUserById, approveUser, rejectUser, deleteUser, getCars, getCarById, approveCar, rejectCar, deleteCar, getLicenses, verifyLicense, rejectLicense } = require('../controllers/admin.controller');

router.use(authenticate, authorize('admin'));

router.get('/dashboard',          getDashboard);
router.get('/users',              getUsers);
router.get('/users/:id',          getUserById);
router.put('/users/:id/approve',  approveUser);
router.put('/users/:id/reject',   rejectUser);
router.delete('/users/:id',       deleteUser);
router.get('/cars',               getCars);
router.get('/cars/:id',           getCarById);
router.put('/cars/:id/approve',   approveCar);
router.put('/cars/:id/reject',    rejectCar);
router.delete('/cars/:id',        deleteCar);
router.get('/licenses',           getLicenses);
router.put('/licenses/:id/verify',verifyLicense);
router.put('/licenses/:id/reject',rejectLicense);

module.exports = router;