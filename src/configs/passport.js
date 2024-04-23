require('dotenv').config();
const passport = require('passport');
const passportJWT = require('passport-jwt');

const Users = require('../models/usersModel');

const { Strategy, ExtractJwt } = passportJWT;

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

passport.use(
	new Strategy(jwtOptions, async (payload, done) => {
		const user = await Users.find({ _id: payload.id });
		if (!user) {
			return done(null, false);
		}

		return done(null, user);
	}),
);

module.exports = passport;
