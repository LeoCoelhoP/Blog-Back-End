const { mongoose } = require('mongoose');

const usersSchema = new mongoose.Schema({
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
	articlesLiked: { type: mongoose.Schema.Types.ObjectId, ref: 'Articles' },
});

module.exports = mongoose.model('Users', usersSchema);
