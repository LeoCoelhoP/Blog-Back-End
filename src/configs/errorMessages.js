const { ARTICLE_GLOBALS } = require('./globals');

const common = {
	noEmail: 'Please, provide an email.',
	noUsername: `Please provide a valid username.`,
	noUserID: `Please provide a valid user`,
	noUser: `User not found`,
	noPassword: `Please, provide a password.`,
	tokenExpired: `Oops! It seems your token has expired... Do not worry, you can always request a new token!`,
	noToken: `Please, provide a valid token.`,
	noArticleTitle: `Please, provide a title`,
	noArticleBody: `Please, provide a body`,
	noArticleImage: `Please, provide a image url`,
	noArticle: `Article not found`,
};
const validators = {
	emailValidator: {},
};

const registerErrors = {
	emailError: {
		noEmail: common.noEmail,
		emailTaken: 'Sorry, this email is already taken.',
		invalidEmail: 'Please, provide a valid email.',
	},
	usernameError: {
		noUsername: common.noUsername,
		usernameTaken: 'Sorry, this username is already taken.',
	},
	passwordError: {
		noPassword: common.noPassword,
		invalidPassword: 'Please, provide a valid password',
	},
};
const createArticleErrors = {
	authorErrors: {
		noAuthor: 'You need to be an author to create an article.',
	},
	titleErrors: {
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
const articlesController = {
	createArticle: {
		error: `An error occurred while creating article.`,
	},
	getLikedArticles: {
		noArticlesArray: `Please provide a liked articles array`,
		error: `An error occurred while getting liked articles.`,
	},
	getBookmarkedArticles: {
		noArticlesArray: `Please provide a bookmarked articles array`,
		error: `An error occurred while getting bookmarked articles.`,
	},
	getAllArticles: {
		error: `An error occurred while getting all articles.`,
	},
	updateArticle: {
		error: `An error occurred while updating articles.`,
	},
	deleteArticle: {
		error: `An error occurred while deleting articles.`,
		notAuthor: 'You must be the article author to be able to delete.',
	},
	getArticleBySearch: {
		noQuery: 'Please provide a valid query.',
		error: `An error occurred while getting articles by search query.`,
	},
	getArticle: {
		error: 'Article not found.',
	},
	commentArticle: {
		noCommentBody: 'Please provide a valid comment',
		error: `An error occurred while commenting article.`,
	},
	deleteArticleComment: {
		error: `An error occurred while deleting comment.`,
		noCommentID: 'Please provide a valid comment',
		notAuthor:
			'You must be the comment author or and adminstrator to be able to delete.',
	},
};

const authController = {
	demoAdmin: {
		error: `As a demo administrator, you do not have permission to perform administrative actions.`,
	},
	registerUser: {
		error: `An error occurred while registering user.`,
	},
	updatePassword: {
		error: `An error occurred while updating password.`,
	},
	createToken: {
		error: `An error occurred while creating token.`,
	},
	passwordRecovery: {
		error: `An error occurred while recovering password.`,
		notFilled: `Oops! It seems you missed filling in the password fields.`,
	},
	verifyEmail: {
		error: `An error occurred while recovering verifying email.`,
		noToken: common.noToken,
	},
	loginUser: {
		error: `An error occurred while logging in.`,
		notVerified:
			'You must verify your email. Please, do not forget to check the spams.',
		invalidPassword: 'Invalid password.',
	},
	logoutUser: {
		error: `An error occurred while logging out.`,
	},
	getProfile: {
		error: `An error occurred while getting user.`,
	},
	verifyUser: {
		noAuth: 'Failed to authenticate token.',
		noToken: 'No token provided.',
		error: `An error occurred while authorizing user.`,
	},
};
const usersController = {
	general: {
		noUserID: `Please log in to like.`,
		noArticle: `No article found.`,
		noUser: `Please, provide an valid user id.`,
		noUsername: common.noUsername,
	},
	getUserArticles: {
		error: `An error occurred while getting user articles`,
		noArticles: `It seems you do not have any article published... Try add one.`,
	},
	getUserByID: {
		error: `An error occurred while getting user by id.`,
		noUser: `User not found by id.`,
	},
	isAdmin: {
		error: `An error occurred while checking if user is an admin.`,
		noUser: `User not found its name.`,
	},
	likeAction: {
		error: `An error occurred while liking article`,
		noAction: `Please provide a valid like action`,
	},
	bookmarkAction: {
		error: `An error occurred while bookmarking article`,
		noAction: `Please provide a valid bookmark action`,
	},
};
module.exports = {
	registerErrors,
	createArticleErrors,
	usersController,
	common,
	authController,
	articlesController,
};
