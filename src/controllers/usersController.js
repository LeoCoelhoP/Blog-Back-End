const mongoose = require('mongoose');
const Users = require('../models/usersModel');
const Articles = require('../models/articlesModel');
async function likeAction(userID, articleID) {
	const article = await Articles.findOne({ _id: articleID });
	console.log(articleID);
	const user = await Users.findOne({ _id: userID });
	const result = user.articlesLiked.filter((article) => article === articleID);
	let updatedUser;
	try {
		if (result.length === 0) {
			user.articlesLiked.push(articleID);
			article.likes = Number(article.likes + 1);
		} else {
			user.articlesLiked = user.articlesLiked.filter(
				(articles) => articles !== articleID,
			);
			article.likes = Number(article.likes - 1);
		}
		updatedUser = await user.save();
		await article.save();
	} catch (err) {}
	return updatedUser;
}

async function bookmarkAction(userID, articleID) {
	const user = await Users.findOne({ _id: userID });
	const result = user.articlesBookmarked.filter(
		(article) => article === articleID,
	);
	let updatedUser;
	try {
		if (result.length === 0) {
			user.articlesBookmarked.push(articleID);
			updatedUser = await user.save();
		} else {
			user.articlesBookmarked = user.articlesBookmarked.filter(
				(articles) => articles !== articleID,
			);
			updatedUser = await user.save();
		}
	} catch (err) {}
	return updatedUser;
}
module.exports = { likeAction, bookmarkAction };
