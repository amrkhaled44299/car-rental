const express = require('express');
const router  = express.Router();
const { register, login, getMe, changePassword } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', upload.single('profile_image'), register);
router.post('/login',    login);
router.get ('/me',       authenticate, getMe);
router.put ('/change-password', authenticate, changePassword);

module.exports = router;