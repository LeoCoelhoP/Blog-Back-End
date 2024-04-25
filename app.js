const dotenv = require('dotenv');
const cors = require('cors');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./src/routes/articles');
const usersRouter = require('./src/routes/users');
const authRouter = require('./src/routes/auth');
const passport = require('passport');
require('./src/configs/passport');

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
mongoose
	.connect(process.env.MONGO_DB_URL, {
		dbName: 'Blog',
	})
	.then(() => console.log('Database Connected.'))
	.catch((err) => console.error(err));

app.disable('etag');
app.use(
	cors({
		credentials: true,
		origin: ['http://localhost:5173', 'http://192.168.0.102:5173'],
	}),
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRouter);
app.use('/api/articles', indexRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});

module.exports = app;
