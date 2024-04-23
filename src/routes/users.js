const express = require('express');
const router = express.Router();
const Users = require('../models/usersModel');
const registerUser = require('../controllers/usersController');

router.get('/', async function (req, res, next) {
	const users = await Users.find();
	res.json(users);
});
router.get('/:id', async function (req, res, next) {
	const id = req.params.id;
	const user = await Users.findOne({ _id: id });
	res.json(user);
});

router.post('/register', async function (req, res, next) {
	await registerUser(req, res);
});

router.post('/login', async function (req, res, next) {
	await registerUser.loginUser(req, res);
});

module.exports = router;
