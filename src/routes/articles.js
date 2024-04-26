const express = require('express');
const {
	createArticle,
	getAllArticles,
	getArticle,
	deleteArticle,
} = require('../controllers/articlesController.');
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
	return res.json(article);
});
router.get('/:id', async (req, res) => {
	const article = await getArticle(req.params.id);
	return res.json(article);
});
router.put('/:id', (req, res) => {
	res.json(`update Article of id ${req.params.id}`);
});
router.delete('/:id', async (req, res) => {
	const deletedArticle = await deleteArticle(req.params.id);
	return res.json({ 'deleted article': deletedArticle });
});
module.exports = router;
