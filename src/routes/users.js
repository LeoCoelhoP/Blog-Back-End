const express = require('express');
const router = express.Router();
const users = require('../controllers/usersController');
const { likeAndBookmarkValidator } = require('../helpers/validators');
const { verifyUser } = require('../controllers/authController');

router.get('/:id', users.getUserByID);
router.get('/:id/articles', users.getUserArticles);

router.post('/isAdmin', users.isAdmin);
router.post('/like', verifyUser, likeAndBookmarkValidator, users.likeAction);
router.post(
	'/bookmark',
	verifyUser,
	likeAndBookmarkValidator,
	users.bookmarkAction,
);

module.exports = router;
