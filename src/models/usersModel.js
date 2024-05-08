const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
	isVerified: { type: Boolean, default: false },
	emailToken: { type: String },
	isAdmin: { type: Boolean, default: false },
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
		minlength: 6,
		maxlength: 14,
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
	},
	articlesLiked: { type: Array, default: [] },
	articlesBookmarked: { type: Array, default: [] },
});

module.exports = mongoose.model('Users', usersSchema);
