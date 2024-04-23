const dotenv = require('dotenv');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./src/routes/articles');
const usersRouter = require('./src/routes/users');

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
mongoose
	.connect(process.env.MONGO_DB_URL, {
		dbName: 'Blog',
	})
	.then(() => console.log('Database Connected.'))
	.catch((err) => console.error(err));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/articles', indexRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});

module.exports = app;
