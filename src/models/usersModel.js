const { mongoose } = require('mongoose');

const usersSchema = new mongoose.Schema({
	isAuthor: { type: Boolean, default: false },
	isAdmin: { type: Boolean, default: false },
	email: {
		type: String,
		required: true,
	},
	username: { type: String, required: true },
	password: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Users', usersSchema);
