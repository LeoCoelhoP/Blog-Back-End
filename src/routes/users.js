const express = require('express');
const router = express.Router();
const Users = require('../models/usersModel');
const passport = require('passport');

router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	async function (req, res, next) {
		const users = await Users.find();
		res.json(users);
	},
);
router.get('/:id', async function (req, res, next) {
	const id = req.params.id;
	const user = await Users.findOne({ _id: id });
	res.json(user);
});


module.exports = router;
