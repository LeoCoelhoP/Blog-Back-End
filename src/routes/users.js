const express = require('express');
const router = express.Router();
const Users = require('../models/usersModel');
const passport = require('passport');
const getLikes = require('../controllers/usersController');

router.get('/', async function (req, res) {
  const {id} = 
	await getLikes();
});
router.get('/:id', async function (req, res, next) {
	const id = req.params.id;
	const user = await Users.findOne({ _id: id });
	res.json(user);
});

module.exports = router;
