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
		console.log(newArticle);
		console.log('article saved');
		res.json(newArticle);
	} catch (err) {
		return res.json({ error: err.message });
	}
}

async function getAllArticles(query) {
	let articles;
	if (query) {
		articles = await Articles.find({
			title: { $regex: query, $options: 'i' },
		}).populate({
			path: 'author',
			select: 'username isAdmin -_id',
		});
	} else {
		articles = await Articles.find().populate({
			path: 'author',
			select: 'username isAdmin -_id',
		});
	}
	return articles;
}

async function getArticle(id) {
	console.log(id);
	try {
		const article = await Articles.findOne({ _id: id })
			.populate([
				{
					path: 'author',
					select: 'username isAdmin -_id',
				},
				{
					path: 'comments',
					pouplate: {
						path: 'author',
					},
				},
			])
			.exec();

		return article;
	} catch (err) {
		console.log(err);
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
