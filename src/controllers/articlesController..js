const { common, articlesController } = require('../configs/errorMessages');
const messages = require('../configs/Messages');
const Articles = require('../models/articlesModel');
const Users = require('../models/usersModel');
const Comments = require('../models/commentsModel');

async function createArticle(req, res) {
	try {
		const { authorID, title, body, images } = req.body;
		if (!authorID) return res.status(400).json({ error: common.noUserID });
		if (!title) return res.status(400).json({ error: common.noArticleTitle });
		if (!body) return res.status(400).json({ error: common.noArticleBody });
		if (!images) return res.status(400).json({ error: common.noArticleImage });

		const newArticle = new Articles({ author: authorID, title, body, images });
		await newArticle.save();
		return res.status(200).json({
			message: messages.articlesController.createArticle.success,
			data: newArticle,
		});
	} catch {
		return res
			.status(500)
			.json({ error: articlesController.createArticle.error });
	}
}

async function getLikedArticles(req, res) {
	try {
		const ids = req.body.likes;
		if (!ids)
			return res
				.status(400)
				.json({ error: articlesController.getLikedArticles.noArticlesArray });

		const articles = await Articles.find({ _id: { $in: ids } }).select(
			'-author',
		);
		return res.status(200).json(articles);
	} catch {
		return res
			.status(500)
			.json({ error: articlesController.getLikedArticles.error });
	}
}

async function getBookmarkedArticles(req, res) {
	try {
		const ids = req.body.bookmarks;
		if (!ids)
			return res.status(400).json({
				error: articlesController.getBookmarkedArticles.noArticlesArray,
			});
		const articles = await Articles.find({ _id: { $in: ids } }).select(
			'-author',
		);
		return res.status(200).json(articles);
	} catch {
		return res
			.status(500)
			.json({ error: articlesController.getBookmarkedArticles.error });
	}
}

async function getAllArticles(req, res) {
	try {
		const articles = await Articles.find()
			.populate({
				path: 'author',
				select: 'username isAdmin -_id',
			})
			.sort({ updatedAt: -1 });
		return res.status(200).json(articles);
	} catch {
		return res
			.status(500)
			.json({ error: articlesController.getAllArticles.error });
	}
}

async function updateArticle(req, res) {
	try {
		const article = await Articles.findOne({ _id: req.params.id });
		if (!article) return res.status(404).json({ error: common.noArticle });

		const { title, body, images } = req.body;
		if (!title) return res.status(404).json({ error: common.noArticleTitle });
		if (!body) return res.status(404).json({ error: common.noArticleBody });
		if (!images) return res.status(404).json({ error: common.noArticleImage });

		article.title = title;
		article.body = body;
		article.images = images;

		await article.save();
		return res.json({
			message: messages.articlesController.updateArticle.success,
		});
	} catch {
		return res
			.status(500)
			.json({ error: articlesController.updateArticle.error });
	}
}

async function getArticleBySearch(req, res) {
	try {
		const { query } = req?.body;
		if (!query)
			return res
				.status(400)
				.json({ error: articlesController.getArticleBySearch.noQuery });
		articles = await Articles.find({
			title: { $regex: query, $options: 'i' },
		})
			.populate({
				path: 'author',
				select: 'username isAdmin -_id',
			})
			.sort({ updatedAt: -1 });
		return res.status(200).json(articles);
	} catch {
		return res.status(500).json({
			error: articlesController.getArticleBySearch.error,
		});
	}
}

async function getArticle(req, res) {
	const sortOptions = { sort: { createdAt: -1 } };
	try {
		const id = req.params.id;
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

		return res.status(200).json(article);
	} catch {
		return res.status(404).json({ error: articlesController.getArticle.error });
	}
}

async function commentArticle(req, res) {
	try {
		const { userID, body, username } = req.body;
		if (!userID) return res.status(400).json({ error: common.noUserID });
		if (!body)
			return res
				.status(400)
				.json({ error: articlesController.commentArticle.noCommentBody });
		if (!username) return res.status(400).json({ error: common.noUsername });

		const articleID = req.params.id;
		if (!articleID) return res.status(400).json({ error: common.noArticle });

		const user = await Users.findById({ _id: userID });
		if (!user) return res.status(404).json({ error: common.noUser });

		const newComment = new Comments({
			user: userID,
			username,
			article: articleID,
			body,
		});
		await newComment.save();
		const article = await Articles.findById({ _id: articleID });
		article.comments.push(newComment._id);

		await article.save();
		newComment._id = null;
		return res.status(200).json(newComment);
	} catch {
		return res
			.status(500)
			.json({ error: articlesController.commentArticle.error });
	}
}

async function deleteArticle(req, res) {
	try {
		const userID = req.body.userID;
		const id = req.params.id;
		const article = await Articles.findOne({ _id: id });
		if (!article) return res.status(404).json({ error: common.noArticle });

		if (!article.author === userID)
			return res
				.status(401)
				.json({ error: articlesController.deleteArticle.notAuthor });

		await Articles.deleteOne({ _id: id });

		return res
			.status(200)
			.json({ message: messages.articlesController.deleteArticle.success });
	} catch {
		return res
			.status(500)
			.json({ error: articlesController.deleteArticle.error });
	}
}

async function deleteArticleComment(req, res) {
	try {
		const { commentID, userID } = req.body;
		if (!userID) return res.status(400).json({ error: common.noUserID });
		if (!commentID)
			return res
				.status(400)
				.json({ error: articlesController.deleteArticleComment.noCommentID });

		const user = await Users.findOne({ _id: userID });
		const comment = await Comments.findOne({ _id: commentID });
		if (user.username !== comment.username)
			return res
				.status(400)
				.json({ error: articlesController.deleteArticleComment.notAuthor });

		await Comments.findByIdAndDelete({ _id: commentID });
		console.log(commentID, userID);
		return res.status(200).json('Comment deleted!');
	} catch {
		return res
			.status(500)
			.json({ error: articlesController.deleteArticleComment.error });
	}
}
module.exports = {
	updateArticle,
	createArticle,
	getAllArticles,
	getArticle,
	deleteArticle,
	getLikedArticles,
	getBookmarkedArticles,
	getArticleBySearch,
	deleteArticleComment,
	commentArticle,
};
