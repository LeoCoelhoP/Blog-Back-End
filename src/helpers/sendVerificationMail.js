const { createMailTransporter } = require('./createMailTransporter');

function sendVerificationMail(user) {
	const transporter = createMailTransporter();

	const mailOptions = {
		from: `"Leonardo's Blog" <${process.env.EMAIL}>`,
		to: user.email,
		subject: "Email Verification - Leonardo's Blog",
		html: `<p>You are almost there! Please, verify your email by <a href=${process.env.CLIENT_URL}/verify-email?emailToken=${user.emailToken}>clicking here...<a/></p>`,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else console.log('Email sent!');
	});
}

module.exports = { sendVerificationMail };
