const express = require('express');
const router = express.Router();
const Users = require('../models/usersModel');
const Articles = require('../models/articlesModel');
const {
	likeAction,
	bookmarkAction,
} = require('../controllers/usersController');

// router.get('/', async function (req, res) {
// 	const { id } = await getLikes();
// });
router.get('/:id/articles', async function (req, res, next) {
	const { id } = req.params;
	const articles = await Articles.find({ author: id }).sort({ updatedAt: -1 });
	console.log(articles);
	return res.json(articles);
});

router.get('/:id', async function (req, res, next) {
	const id = req.params.id;
	const user = await Users.findOne({ _id: id });
	res.json(user);
});

router.post('/like', async function (req, res) {
	const { userID, articleID } = req.body;
	const data = await likeAction(userID, articleID);
	res.json(data);
});

router.post('/bookmark', async function (req, res) {
	const { userID, articleID } = req.body;
	console.log('leo');
	const data = await bookmarkAction(userID, articleID);
	res.json(data);
});

router.post('/isAdmin', async function (req, res) {
	const { username } = req.body;
	const user = await Users.findOne({ username });
	console.log(user.isAdmin);
	return res.json(user.isAdmin);
});
module.exports = router;
