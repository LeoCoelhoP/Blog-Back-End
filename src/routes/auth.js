const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const {
	emailValidator,
	usernameValidator,
	passwordValidator,
} = require('../helpers/validators');

router.get('/get-profile', auth.getProfile);

router.post(
	'/register',
	emailValidator,
	usernameValidator,
	passwordValidator,
	auth.registerUser,
);
router.post('/verify-email', auth.verifyEmail);
router.post('/login', auth.loginUser);
router.post('/recover', auth.passwordRecovery);
router.post('/logout', auth.logoutUser);

router.put('/update-password', auth.updatePassword);

module.exports = router;
