const bcrypt = require('bcrypt');
const crypto = require('crypto');

const {
	emailValidator,
	passwordValidator,
	usernameValidator,
	registerFieldsValidator,
} = require('../helpers/validators');
const Users = require('../models/usersModel');
const { SALT } = require('../configs/globals');
const jwt = require('jsonwebtoken');
const { sendVerificationMail } = require('../helpers/sendVerificationMail');

async function createToken(_id) {
	return jwt.sign({ id: _id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

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
		console.log(isValidUsername);
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
		const emailToken = crypto.randomBytes(64).toString('hex');
		const newUser = new Users({
			email,
			username,
			password: hashedPassword,
			emailToken,
		});

		await newUser.save();

		sendVerificationMail(newUser);

		return res.json(newUser);
	} catch (err) {
		console.error(err);
	}
}

async function verifyEmail(req, res) {
	try {
		const emailToken = req.body.emailToken;

		if (!emailToken) return res.status(404).json('Email token not found...');

		const user = await Users.findOne({ emailToken });

		if (user) {
			user.emailToken = null;
			user.isVerified = true;
			await user.save();

			const token = createToken(user._id);

			res.status(200).json({
				...user,
				token,
				isVerified: user?.isVerified,
			});
		} else res.status(404).json('Email verification failed, invalid token!');
	} catch (err) {
		console.error(err);
		res.status(500).json(error.message);
	}
}

async function loginUser(req, res) {
	const { email, password } = req.body;
	const user = await Users.findOne({ email });
	if (!user) return res.status(401).json({ error: 'Invalid username.' });
	if (!user.isVerified)
		return res.status(403).json({
			error:
				'You must verify your email. Please, do not forget to check the spams.',
		});

	const isAuthorized = await bcrypt.compare(password, user.password);
	if (!isAuthorized)
		return res.status(401).json({ error: 'Invalid password.' });

	const token = await createToken(user._id);
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
		try {
			const data = await Users.findOne({ _id: user.id }).select(
				'-password -email',
			);
			return res.json(data);
		} catch (err) {
			if (err) return res.json(err);
		}
	});
}
module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	getProfile,
	verifyEmail,
};
