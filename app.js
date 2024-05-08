const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const authRouter = require('./src/routes/auth');
const indexRouter = require('./src/routes/articles');
const usersRouter = require('./src/routes/users');

require('./src/configs/passport');

const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables from a .env file into process.env
dotenv.config();

// Connect to MongoDB database
mongoose
	.connect(process.env.MONGO_DB_URL, {
		dbName: 'Blog',
	})
	.then(() => console.log('Database Connected.'))
	.catch((err) => console.error(err));

// Middleware to enhance the security of the application by setting various HTTP headers
app.use(helmet());

// Disable caching of HTTP responses
app.disable('etag');

// Middleware to enable CORS with specific options
app.use(
	cors({
		credentials: true,
		origin: ['http://localhost:5173', 'http://192.168.0.102:5173'],
	}),
);
// Middleware to parse incoming JSON and URL-encoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to parse cookies from the incoming request headers
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/articles', indexRouter);
app.use('/api/users', usersRouter);

/**
 * Starts the server and listens for incoming requests on the specified port.
 * @name listen
 * @function
 * @memberof module:app
 * @instance
 * @param {number} PORT - The port on which the server should listen.
 * @returns {void}
 */
app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});

module.exports = app;
