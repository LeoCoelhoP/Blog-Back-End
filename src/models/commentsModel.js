const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	article: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Article',
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	body: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
