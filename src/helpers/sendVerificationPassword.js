const { passwordVerification } = require('../configs/Messages');
const createMailTransporter = require('./createMailTransporter');


function sendVerificationPassword(user, res) {
	const transporter = createMailTransporter();
	const mailOptions = {
		from: `"${passwordVerification.mailFrom}" <${process.env.EMAIL}>`,
		to: user.email,
		subject: passwordVerification.mailSubject,
		html: passwordVerification.html(user.emailToken),
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return res.status(400).json({ error: passwordVerification.error });
		} else
			return res.status(200).json({
				message: passwordVerification.success,
			});
	});
}

module.exports = sendVerificationPassword;
