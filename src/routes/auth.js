const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/register', async function (req, res, next) {
	await auth.registerUser(req, res);
});

router.post('/login', async function (req, res, next) {
	await auth.loginUser(req, res);
});

router.post('/logout', async function (req, res, next) {
	await auth.logoutUser(req, res);
});

router.get('/get-profile', async function (req, res, next) {
	await auth.getProfile(req, res);
});

router.post('/verify-email', auth.verifyEmail);

module.exports = router;
