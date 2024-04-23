const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/register', async function (req, res, next) {
	await auth.registerUser(req, res);
});

router.post('/login', async function (req, res, next) {
	await auth.loginUser(req, res);
});

module.exports = router;
