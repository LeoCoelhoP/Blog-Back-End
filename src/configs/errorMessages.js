const { ARTICLE_GLOBALS } = require('./globals');

const registerErrors = {
	emailError: {
		noEmail: 'Please, provide an email.',
		emailTaken: 'Sorry, this email is already taken.',
		invalidEmail: 'Please, provide a valid email.',
	},
	usernameError: {
		noUsername: 'Please, provide an username.',
		usernameTaken: 'Sorry, this username is already taken.',
	},
	passwordError: {
		noPassword: 'Please, provide a password.',
		invalidPassword: 'Please, provide a valid password',
	},
};
const createArticleErrors = {
  authorErrors: {
    noAuthor: 'You need to be an author to create an article.'
  },
	titleErros: {
		noTitle: 'Please, provide a article title.',
		titleMinLength: `Title must be at least ${ARTICLE_GLOBALS.MIN_TITLE_CHARS} characters long.`,
		titleMaxLength: `Title must be at maximum ${ARTICLE_GLOBALS.MAX_TITLE_CHARS} characters long`,
	},
	bodyErrors: {
		noBody: 'Please, provide a article body.',
		bodyMinLength: `Body must be at least ${ARTICLE_GLOBALS.MIN_BODY_CHARS} characters long.`,
		bodyMaxLength: `Body must be at maximum ${ARTICLE_GLOBALS.MAX_BODY_CHARS} characters long`,
	},
	imagesErrors: {
		noImage: 'Please, provide an array containing at least an image url.',
	},
};
module.exports = { registerErrors, createArticleErrors };
