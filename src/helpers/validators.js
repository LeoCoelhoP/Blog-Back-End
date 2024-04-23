const {
	emailError,
	passwordError,
	usernameError,
} = require('../configs/errorMessages');
const { passwordRegex, emailRegex } = require('../configs/validatorsREGEX');
const Users = require('../models/usersModel');

async function registerFieldsValidator(email, username, password) {
	if (!email) return { result: false, error: emailError.noEmail };
	if (!username) return { result: false, error: usernameError.noUsername };
	if (!password) return { result: false, error: passwordError.noPassword };
	return { result: true };
}

async function emailValidator(email) {
	const emailTaken = await Users.findOne({ email });
	if (emailTaken) return { result: false, error: emailError.emailTaken };

	const REGEX = emailRegex;
	if (!REGEX.test(email))
		return { result: false, error: emailError.invalidEmail };
	return { result: true };
}

async function usernameValidator(username) {
	const usernameTaken = await Users.findOne({ username });
	if (usernameTaken)
		return { result: false, error: usernameError.usernameTaken };

	return { result: true };
}

async function passwordValidator(password) {
	const REGEX = passwordRegex;
	if (!REGEX.test(password))
		return { result: false, error: passwordError.invalidPassword };

	return { result: true };
}

module.exports = {
	registerFieldsValidator,
	emailValidator,
	usernameValidator,
	passwordValidator,
};
