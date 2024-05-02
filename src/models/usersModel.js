const { mongoose } = require('mongoose');

const usersSchema = new mongoose.Schema({
	isVerified: { type: Boolean, default: false },
	emailToken: { type: String },
	isAuthor: { type: Boolean, default: false },
	isAdmin: { type: Boolean, default: false },
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: { type: String, required: true, unique: true },
	password: {
		type: String,
		required: true,
	},
	articlesLiked: { type: Array, default: [] },
	articlesBookmarked: { type: Array, default: [] },
});

module.exports = mongoose.model('Users', usersSchema);
