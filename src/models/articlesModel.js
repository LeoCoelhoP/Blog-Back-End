const mongoose = require('mongoose');

const articlesSchema = new mongoose.Schema({
	isFixed: { type: Boolean, default: false },
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users',
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
			default: [],
		},
	],
	updatedAt: { type: Date, required: true, default: Date.now },
	views: { type: Number, default: 0 },
	likes: { type: Number, default: 0 },
	title: { type: String, required: true },
	body: { type: String, required: true },
	images: { type: String, required: false },
});

module.exports = mongoose.model('Article', articlesSchema);
