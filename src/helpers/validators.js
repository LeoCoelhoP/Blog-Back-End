const {
	emailError,
	passwordError,
	usernameError,
	registerErrors,
	createArticleErrors,
} = require('../configs/errorMessages');
const { passwordRegex, emailRegex } = require('../configs/validatorsREGEX');
const Users = require('../models/usersModel');

async function registerFieldsValidator(email, username, password) {
	if (!email)
		return { result: false, error: registerErrors.emailError.noEmail };
	if (!username)
		return { result: false, error: registerErrors.usernameError.noUsername };
	if (!password)
		return { result: false, error: registerErrors.passwordError.noPassword };
	return { result: true };
}

async function emailValidator(email) {
	const emailTaken = await Users.findOne({ email });
	if (emailTaken)
		return { result: false, error: registerErrors.emailError.emailTaken };

	const REGEX = emailRegex;
	if (!REGEX.test(email))
		return { result: false, error: registerErrors.emailError.invalidEmail };
	return { result: true };
}

async function usernameValidator(username) {
	const usernameTaken = await Users.findOne({ username });
	if (usernameTaken)
		return { result: false, error: registerErrors.usernameError.usernameTaken };

	return { result: true };
}

async function passwordValidator(password) {
	const REGEX = passwordRegex;
	if (!REGEX.test(password))
		return {
			result: false,
			error: registerErrors.passwordError.invalidPassword,
		};

	return { result: true };
}

async function articleFieldsValidator(authorID, title, body) {
	if (!authorID)
		return { result: false, error: createArticleErrors.authorErrors.noAuthor };
	if (!title)
		return { result: false, error: createArticleErrors.titleErros.noTitle };
	if (!body)
		return { result: false, error: createArticleErrors.bodyErrors.noBody };

	return { result: true };
}

module.exports = {
	registerFieldsValidator,
	emailValidator,
	usernameValidator,
	passwordValidator,
	articleFieldsValidator,
};
