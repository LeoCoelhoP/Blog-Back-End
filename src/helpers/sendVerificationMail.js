const { emailVerification } = require('../configs/Messages');
const createMailTransporter = require('./createMailTransporter');

function sendVerificationMail(user) {
	try {
		const transporter = createMailTransporter();
		const mailOptions = {
			from: `"${emailVerification.mailFrom}" <${process.env.EMAIL}>`,
			to: user.email,
			subject: emailVerification.mailSubject,
			html: emailVerification.html(user.emailToken),
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) console.log(error);
		});
	} catch (err) {
		console.log(err);
	}
}

module.exports = sendVerificationMail;
