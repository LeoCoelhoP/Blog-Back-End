const Users = require('../models/usersModel');
const Articles = require('../models/articlesModel');
const errorMessages = require('../configs/errorMessages');
const { usersController } = require('../configs/errorMessages');

async function getUserByID(req, res) {
	try {
		const id = req.params.id;
		const user = await Users.findOne({ _id: id });
		if (!user)
			return res
				.status(404)
				.json({ error: errorMessages.usersController.getUserByID.noUser });

		return res.status(200).json(user);
	} catch {
		return res
			.status(500)
			.json({ error: errorMessages.usersController.getUserByID.error });
	}
}

async function isAdmin(req, res) {
	try {
		const { username } = req.body;
		if (!username)
			return res
				.status(404)
				.json({ error: errorMessages.usersController.general.noUsername });

		const user = await Users.findOne({ username });

		if (!user)
			return res
				.status(404)
				.json({ error: errorMessages.usersController.isAdmin.noUser });

		return res.status(200).json(user.isAdmin);
	} catch {
		return res.status(500).json({ error: errorMessages.isAdmin.error });
	}
}

async function getUserArticles(req, res) {
	try {
		const { id } = req.params;
		const articles = await Articles.find({ author: id }).sort({
			updatedAt: -1,
		});

		if (!articles)
			return res.status(404).json({
				error: errorMessages.usersController.getUserArticles.noArticles,
			});

		return res.status(200).json(articles);
	} catch {
		return res
			.status(500)
			.json({ error: errorMessages.usersController.getUserArticles.error });
	}
}

async function likeAction(req, res) {
	try {
		const { userID, articleID, action } = req?.body;
		console.log(articleID);
		let updateQuery = {};
		if (action === 'like') {
			updateQuery = { $addToSet: { articlesLiked: articleID } };
			updateArticleQuery = { $inc: { likes: 1 } };
		}

		if (action === 'deslike') {
			updateQuery = { $pull: { articlesLiked: articleID } };
			updateArticleQuery = { $inc: { likes: -1 } };
		}

		const user = await Users.findOneAndUpdate({ _id: userID }, updateQuery, {
			new: true,
		});

		const article = await Articles.findOneAndUpdate(
			{ _id: articleID },
			updateArticleQuery,
			{ new: true },
		);

		if (!user || !article)
			return res
				.status(500)
				.json({ error: errorMessages.usersController.likeAction.error });

		return res
			.status(200)
			.json({ message: usersController.likeAction.success });
	} catch {
		return res
			.status(500)
			.json({ error: errorMessages.usersController.likeAction.error });
	}
}

async function bookmarkAction(req, res) {
	try {
		const { userID, articleID, action } = req?.body;

		let updateQuery = {};
		if (action === 'bookmark')
			updateQuery = { $addToSet: { articlesBookmarked: articleID } };

		if (action === 'unbookmark')
			updateQuery = { $pull: { articlesBookmarked: articleID } };

		const user = await Users.findOneAndUpdate({ _id: userID }, updateQuery, {
			new: true,
		});

		if (!user)
			return res.json({ error: errorMessages.usersController.general.noUser });

		return res
			.status(200)
			.json({ message: usersController.bookmarkAction.success });
	} catch {
		return res
			.status(500)
			.json({ error: errorMessages.usersController.bookmarkAction.error });
	}
}

module.exports = {
	bookmarkAction,
	getUserByID,
	getUserArticles,
	isAdmin,
	likeAction,
};
