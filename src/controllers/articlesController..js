const { articleFieldsValidator } = require('../helpers/validators');
const Articles = require('../models/articlesModel');

async function createArticle(req, res) {
	const { authorID, title, body, images } = req.body;
	const isCreateFieldsValid = await articleFieldsValidator(
		authorID,
		title,
		body,
	);
	if (!isCreateFieldsValid.result)
		return res.status(400).json({ error: isCreateFieldsValid.error });

	try {
		const newArticle = new Articles({ author: authorID, title, body, images });
		await newArticle.save();
		res.json({ message: 'Article successfully created!', data: newArticle });
	} catch (err) {
		return res.json({ error: err.message });
	}
}

async function getAllArticles(query) {
	let articles;
	if (query) {
		articles = await Articles.find({
			title: { $regex: query, $options: 'i' },
		})
			.populate({
				path: 'author',
				select: 'username isAdmin -_id',
			})
			.sort({ updatedAt: -1 });
	} else {
		articles = await Articles.find()
			.populate({
				path: 'author',
				select: 'username isAdmin -_id',
			})
			.sort({ updatedAt: -1 });
	}
	return articles;
}

async function getArticle(id) {
	const sortOptions = { sort: { createdAt: -1 } };
	try {
		const article = await Articles.findOne({ _id: id })
			.populate([
				{
					path: 'author',
					select: 'username isAdmin -_id',
				},
				{
					path: 'comments',
					options: sortOptions,
					pouplate: {
						path: 'author',
					},
				},
			])
			.exec();

		return article;
	} catch (err) {
		return { error: 'Article not found.' };
	}
}

async function deleteArticle(id) {
	const deletedArticle = await Articles.deleteOne({ _id: id });
	return deletedArticle;
}
module.exports = {
	createArticle,
	getAllArticles,
	getArticle,
	deleteArticle,
};
