const mongoose = require('mongoose');

const articlesSchema = new mongoose.Schema({
	isFixed: { type: Boolean, default: false },
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users',
	},
	updatedAt: { type: Date, required: true, default: Date.now },
	views: { type: Number, default: 0 },
	likes: { type: Number, default: 0 },
	comments: { type: Array, default: [] },
	title: { type: String, required: true },
	body: { type: String, required: true },
	images: { type: Array, required: true },
});

module.exports = mongoose.model('Articles', articlesSchema);
