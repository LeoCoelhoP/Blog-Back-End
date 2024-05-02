const nodemailer = require('nodemailer');

function createMailTransporter() {
	const transporter = nodemailer.createTransport({
		service: 'hotmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASSWORD,
		},
	});
	return transporter;
}
module.exports = { createMailTransporter };
