const {
	registerErrors,
	createArticleErrors,
	usersController,
	common,
} = require('../configs/errorMessages');
const { passwordRegex, emailRegex } = require('../configs/validatorsREGEX');
const Users = require('../models/usersModel');

function likeAndBookmarkValidator(req, res, next) {
	const { userID, articleID, action } = req.body;

	if (!userID)
		return res
			.status(401)
			.res.json({ error: usersController.general.noUserID });
	if (!articleID)
		return res.status(401).json({ error: usersController.general.noArticle });
	if (!action)
		return res.status(400).json({
			error: usersController.bookmarkAction.noAction,
		});
	next();
}

async function emailValidator(req, res, next) {
	const email = req.body.email;
	if (!email) return res.status(400).json({ error: common.noEmail });

	const isEmailTaken = await Users.findOne({ email });
	if (isEmailTaken)
		return res
			.status(400)
			.json({ error: registerErrors.emailError.emailTaken });

	const REGEX = emailRegex;
	if (!REGEX.test(email))
		return res
			.status(400)
			.json({ error: registerErrors.emailError.invalidEmail });

	next();
}

async function usernameValidator(req, res, next) {
	const { username } = req.body;
	if (!username) return res.status(400).json({ error: common.noUsername });

	const usernameTaken = await Users.findOne({ username });

	if (usernameTaken)
		return res
			.status(400)
			.json({ error: registerErrors.usernameError.usernameTaken });

	next();
}

function passwordValidator(req, res, next) {
	const { password } = req.body;
	if (!password) return res.status(400).json({ error: common.noPassword });

	const REGEX = passwordRegex;
	if (!REGEX.test(password))
		return res
			.status(400)
			.json({ error: registerErrors.passwordError.invalidPassword });

	next();
}

function articleFieldsValidator(req, res, next) {
	const { authorID, title, body } = req.body;
	if (!authorID)
		return res
			.status(400)
			.json({ error: createArticleErrors.authorErrors.noAuthor });
	if (!title)
		return res
			.status(400)
			.json({ error: createArticleErrors.titleErrors.noTitle });
	if (!body)
		return res
			.status(400)
			.json({ error: createArticleErrors.bodyErrors.noBody });

	next();
}

module.exports = {
	articleFieldsValidator,
	emailValidator,
	likeAndBookmarkValidator,
	passwordValidator,
	usernameValidator,
};
