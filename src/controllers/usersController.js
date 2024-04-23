const bcrypt = require('bcrypt');
const {
	emailValidator,
	passwordValidator,
	usernameValidator,
	registerFieldsValidator,
} = require('../helpers/validators');
const Users = require('../models/usersModel');
const { SALT } = require('../configs/globals');
const { registerErrors } = require('../configs/errorMessages');

async function registerUser(req, res) {
	try {
		const { email, username, password } = req.body;
		const isRegisterFieldsFullFilled = await registerFieldsValidator(
			email,
			username,
			password,
		);
		if (!isRegisterFieldsFullFilled.result)
			return res.status(400).json({
				erorr: registerErrors.usernameError.isRegisterFieldsFullFilled.error,
			});

		const isValidEmail = await emailValidator(email);
		if (!isValidEmail.result)
			return res.status(400).json({
				error: registerErrors.emailError.isValidEmail.error,
			});
		const isValidUsername = await usernameValidator(username);
		if (!isValidUsername.result)
			return res.status(400).json({
				error: registerErrors.usernameError.isValidUsername.error,
			});

		const isValidPassword = await passwordValidator(password);
		console.log(isValidPassword);
		if (!isValidPassword.result)
			return res.status(400).json({
				error: registerErrors.passwordError.isValidPassword.error,
			});

		const hashedPassword = await bcrypt.hash(password, SALT);
		const newUser = new Users({ email, username, password: hashedPassword });

		await newUser.save();
		return res.json(newUser);
	} catch (err) {
		console.error(err);
	}
}

async function loginUser(req, res) {
	const { username, password } = req.body;

	const user = await Users.findOne({ username });
	if (!user) return res.status(401).json({ error: 'Invalid username.' });

	const isAuthorized = await bcrypt.compare(password, user.password);
	if (!isAuthorized)
		return res.status(401).json({ error: 'Invalid password.' });

	return res.json({ user });
}
module.exports = { registerUser, loginUser };
