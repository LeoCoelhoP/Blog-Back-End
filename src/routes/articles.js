const express = require('express');
const {
	createArticle,
	getAllArticles,
	getArticle,
	deleteArticle,
} = require('../controllers/articlesController.');
const Comment = require('../models/commentsModel');
const Articles = require('../models/articlesModel');
const commentsModel = require('../models/commentsModel');
const router = express.Router();

router.get('/', async (req, res) => {
	const articles = await getAllArticles();
	return res.json(articles);
});

router.post('/search/', async (req, res) => {
	const { query } = req.body;

	const articles = await getAllArticles(query);
	return res.json(articles);
});
router.post('/', async (req, res) => {
	const article = await createArticle(req, res);
});
router.get('/:id', async (req, res) => {
	const article = await getArticle(req.params.id);
	return res.json(article);
});
router.put('/:id', async (req, res) => {
	const article = await Articles.findOne({ _id: req.params.id });
	const { title, body, images } = req.body;

	article.title = title;
	article.body = body;
	article.images = images;

	await article.save();
	return  res.json({
		message: `Article ${req.params.id} successfully updated!`,
	});
});
router.delete('/:id', async (req, res) => {
	const deletedArticle = await deleteArticle(req.params.id);
	return res.json({ 'deleted article': deletedArticle });
});

router.post('/:id/comment/delete', async (req, res) => {
	const { commentID } = req.body;
	await Comment.findByIdAndDelete({ _id: commentID });
	res.json('Comment deleted!');
});

router.post('/:id/comment', async (req, res) => {
	const { userID, body, username } = req.body;
	const articleID = req.params.id;
	const newComment = new Comment({
		user: userID,
		username,
		article: articleID,
		body,
	});
	newComment.save().then((comment) => {
		console.log(`Comment saved! ${comment}`);
	});
	const article = await Articles.findById({ _id: articleID });
	article.comments.push(newComment._id);
	await article.save();
	return res.json(newComment);
});

module.exports = router;
