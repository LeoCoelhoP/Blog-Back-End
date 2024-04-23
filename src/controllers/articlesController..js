const { articleFieldsValidator } = require('../helpers/validators');
const Articles = require('../models/articlesModel');

async function createArticle(req, res) {
	const { authorID, title, body, images } = req.body;
	const isCreateFieldsValid = await articleFieldsValidator(
		authorID,
		title,
		body,
		images,
	);
	if (!isCreateFieldsValid.result)
		return res.status(400).json({ error: isCreateFieldsValid.error });

	try {
		const newArticle = new Articles({ author: authorID, title, body });
		await newArticle.save();
		return newArticle;
	} catch (err) {
		return res.json({ error: err.message });
	}
}

async function getAllArticles() {
	const articles = await Articles.find().populate({
		path: 'author',
		select: 'username isAdmin -_id',
	});
	return articles;
}

async function getArticle(id) {
	const article = await Articles.findOne({ _id: id }).populate({
		path: 'author',
		select: 'username isAdmin -_id',
	});
	return article;
}

async function deleteArticle(id) {
	const deletedArticle = await Articles.deleteOne({ _id: id });
	return deletedArticle;
}
module.exports = { createArticle, getAllArticles, getArticle, deleteArticle };
