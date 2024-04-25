const bcrypt = require('bcrypt');
const {
	emailValidator,
	passwordValidator,
	usernameValidator,
	registerFieldsValidator,
} = require('../helpers/validators');
const Users = require('../models/usersModel');
const { SALT } = require('../configs/globals');
const jwt = require('jsonwebtoken');

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
				erorr: isRegisterFieldsFullFilled.error,
			});

		const isValidEmail = await emailValidator(email);
		if (!isValidEmail.result)
			return res.status(400).json({
				error: isValidEmail.error,
			});
		const isValidUsername = await usernameValidator(username);
		if (!isValidUsername.result)
			return res.status(400).json({
				error: isValidUsername.error,
			});

		const isValidPassword = await passwordValidator(password);
		console.log(isValidPassword);
		if (!isValidPassword.result)
			return res.status(400).json({
				error: isValidPassword.error,
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
	const { email, password } = req.body;
	console.log(email, password);
	const user = await Users.findOne({ email });
	console.log(user);
	if (!user) return res.status(401).json({ error: 'Invalid username.' });

	const isAuthorized = await bcrypt.compare(password, user.password);
	if (!isAuthorized)
		return res.status(401).json({ error: 'Invalid password.' });

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
	res.cookie('token', token, {
		maxAge: 900000,
		httpOnly: true,
		secure: true,
	});
	return res.json({ user });
}
async function logoutUser(req, res) {
	res.cookie('token', '', { maxAge: 0 });
	res.json({ message: 'Logged out! ' });
}

async function getProfile(req, res) {
	const { token } = req.cookies;
	if (!token) return res.json(null);

	jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
		if (err) res.cookie('token', null, { sameSite: true, httpOnly: true });
		const data = await Users.findOne({ _id: user.id });
		res.json(data.username);
	});
}
module.exports = { registerUser, loginUser, logoutUser, getProfile };
