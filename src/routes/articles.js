const express = require('express');
const router = express.Router();
const articles = require('../controllers/articlesController.');
const { articleFieldsValidator } = require('../helpers/validators');
const { verifyUser, isDemoAdmin } = require('../controllers/authController');

router.get('/', articles.getAllArticles);
router.get('/:id', articles.getArticle);

router.post(
	'/',
	verifyUser,
	isDemoAdmin,
	articleFieldsValidator,
	articles.createArticle,
);
router.post('/:id/comment', verifyUser, articles.commentArticle);
router.post('/:id/comment/delete', verifyUser, articles.deleteArticleComment);
router.post('/likes', articles.getLikedArticles);
router.post('/bookmarks', articles.getBookmarkedArticles);
router.post('/search/', articles.getArticleBySearch);
router.put('/:id', verifyUser, isDemoAdmin, articles.updateArticle);
router.post('/:id', verifyUser, isDemoAdmin, articles.deleteArticle);

module.exports = router;
