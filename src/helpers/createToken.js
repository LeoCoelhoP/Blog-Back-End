const jwt = require('jsonwebtoken');
const { authController } = require('../configs/errorMessages');

function createToken(_id) {
	try {
		return jwt.sign({ id: _id }, process.env.JWT_SECRET, { expiresIn: '7d' });
	} catch {
		return { error: authController.createToken.error };
	}
}

module.exports = createToken;
