const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const Users = require('../models/usersModel');

const { SALT } = require('../configs/globals');
const messages = require('../configs/Messages');
const { authController, common } = require('../configs/errorMessages');

const createToken = require('../helpers/createToken');
const sendVerificationPassword = require('../helpers/sendVerificationPassword');
const sendVerificationMail = require('../helpers/sendVerificationMail');

async function registerUser(req, res) {
	try {
		const { email, username, password } = req.body;

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
		return res.status(200).json(messages.authController.register.success);
	} catch (err) {
		return res.status(500).json({ error: authController.registerUser.error });
	}
}

async function passwordRecovery(req, res) {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ error: common.noEmail });

		const user = await Users.findOne({ email });
		if (!user) return res.status(404).json({ error: common.noUser });

		const emailToken = crypto.randomBytes(64).toString('hex');
		user.emailToken = emailToken;

		await user.save();
		sendVerificationPassword(user, res);
	} catch {
		return res
			.status(500)
			.json({ error: authController.passwordRecovery.error });
	}
}

async function updatePassword(req, res) {
	try {
		const { password, passwordConfirmation, token } = req.body;
		if (!password || !passwordConfirmation)
			return res.status(400).json({
				error: authController.updatePassword.notFilled,
			});

		const user = await Users.findOne({ emailToken: token });
		if (!user)
			return res.status(401).json({
				error: common.tokenExpired,
			});

		user.emailToken = null;
		const hashedPassword = await bcrypt.hash(password, SALT);
		user.password = hashedPassword;
		await user.save();

		return res
			.status(200)
			.json({ message: messages.authController.updatePassword.success });
	} catch {
		return res.status(500).json({ error: authController.updatePassword.error });
	}
}

async function verifyEmail(req, res) {
	try {
		const emailToken = req.body.emailToken;
		if (!emailToken)
			return res
				.status(400)
				.json({ error: authController.verifyEmail.noToken });

		const user = await Users.findOne({ emailToken });
		if (!user) return res.status(401).json({ error: common.tokenExpired });

		user.emailToken = null;
		user.isVerified = true;
		await user.save();

		return res.status(200).json({
			message: messages.authController.verifyEmail.success,
		});
	} catch {
		res.status(500).json({ error: authController.verifyEmail.error });
	}
}

async function loginUser(req, res) {
	try {
		const { email, password } = req.body;
		if (!email) return res.status(400).json({ error: common.noEmail });
		if (!password) return res.status(400).json({ error: common.noPassword });

		const user = await Users.findOne({ email }).select('-email -emailToken');
		if (!user) return res.status(401).json({ error: common.noUser });

		if (!user.isVerified)
			return res.status(403).json({
				error: authController.loginUser.notVerified,
			});

		const isAuthorized = await bcrypt.compare(password, user.password);
		if (!isAuthorized)
			return res
				.status(401)
				.json({ error: authController.loginUser.invalidPassword });

		const token = await createToken(user._id);
		res.cookie('token', token, {
			maxAge: 900000,
			httpOnly: true,
			secure: true,
		});
		user.password = null;
		return res.status(200).json(user);
	} catch {
		res.status(500).json({ error: authController.loginUser.error });
	}
}

function logoutUser(req, res) {
	try {
		return res
			.cookie('token', '', { maxAge: 0 })
			.json({ message: messages.authController.logoutUser.success });
	} catch {
		return res.status(500).json({ error: authController.logoutUser.error });
	}
}

function verifyUser(req, res, next) {
	try {
		const token = req.cookies.token;
		const userID = req.body.userID || req.body?.user?._id || req.body.authorID;
		if (!token)
			return res.status(401).json({ auth: false, message: common.noToken });

		jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
			if (err)
				return res
					.status(500)
					.json({ error: authController.verifyUser.noAuth });

			if (user.id === userID) next();
			else
				return res
					.status(500)
					.json({ error: authController.verifyUser.noAuth });
		});
	} catch {
		return res.status(500).json({ error: authController.verifyUser.error });
	}
}

async function isDemoAdmin(req, res, next) {
	const userID = req.body.userID || req.body?.user?._id || req.body.authorID;
	const user = await Users.findOne({ _id: userID });

	if (!user || user.username === 'DemoAdmin')
		return res.status(401).json({ error: authController.demoAdmin.error });

	next();
}

async function getProfile(req, res) {
	try {
		const { token } = req.cookies;
		if (!token) return;

		jwt.verify(token, process.env.JWT_SECRET, {}, async (err, user) => {
			if (err) res.cookie('token', null, { sameSite: true, httpOnly: true });
			const data = await Users.findOne({ _id: user.id }).select(
				'-password -email -emailToken',
			);
			return res.status(200).json(data);
		});
	} catch {
		res.status(500).json({ error: authController.getProfile.error });
	}
}

module.exports = {
	getProfile,
	loginUser,
	logoutUser,
	passwordRecovery,
	registerUser,
	updatePassword,
	verifyEmail,
	verifyUser,
	isDemoAdmin,
};
