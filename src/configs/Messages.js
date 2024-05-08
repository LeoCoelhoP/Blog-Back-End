const common = {
	mailFrom: `Leonardo's Blog`,
};
const passwordVerification = {
	error: `Some error occured while sending password email verification.`,
	success: `Email successfully sent! Please verify it to recover your password.`,
	mailFrom: common.mailFrom,
	mailSubject: `Password Recovery Verification - Leonardo's Blog`,
	html(emailToken) {
		return `<p>You are almost there! Please, verify your email by <a href=${process.env.CLIENT_URL}recover/?token=${emailToken}>clicking here...<a/></br> If you have not requested a new password, please ignore it.</p>`;
	},
};

const articlesController = {
	createArticle: {
		success: 'Article successfully created!',
	},
	updateArticle: {
		success: 'Article successfully updated!',
	},
	deleteArticle: {
		success: 'Article successfully deleted!',
	},
};

const emailVerification = {
	error: `Some error occured while sending register email verification.`,
	success: `Email successfully sent! Please verify it to end the registering process.`,
	mailFrom: common.mailFrom,
	mailSubject: `Email Verification - Leonardo's Blog`,
	html(emailToken) {
		return `<p>You are almost there! Please, verify your email by <a href=${process.env.CLIENT_URL}verify-email?emailToken=${emailToken}>clicking here...<a/></p>`;
	},
};

const usersController = {
	likeAction: {
		success: `Article successfully liked!`,
	},
	bookmarkAction: {
		success: `Article successfully bookmarked!`,
	},
};

const authController = {
	register: {
		success:
			'Email verification sent, please check it(do not forget to check the spam).',
	},
	updatePassword: {
		success: 'Password successfully updated!',
	},
	verifyEmail: {
		success: `Email verified, please login.`,
	},
	logoutUser: {
		success: `Successfully logged out.`,
	},
};

module.exports = {
	passwordVerification,
	emailVerification,
	usersController,
	authController,
	articlesController,
};
