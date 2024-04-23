const mongoose = require('mongoose');

const commentsSchema = new mongoose.mongoose.Schema({
	authorID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users',
		required: true,
	},
	comment: { type: String, required: true },
	likes: { type: Number, defult: 0 },
	iat: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comments', commentsSchema);
