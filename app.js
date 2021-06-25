const express = require(`express`);
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const app = express();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const hpp = require('hpp');
const sendError = require('./controllers/errorController');

//Only for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Middleware for security
app.use(mongoSanitize()); //Prevent NoSQL injection
app.use(xss()); //Prevent cross site scripting attack
app.use(helmet()); //Security for http headers
app.use(hpp()); //Prevent parameter pollution

//Body parser
app.use(express.json());
app.use(cookieParser());

//Access the router
app.use('/api/v1/users', userRouter);

//Error handler if routes undefined
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Error handler if error happen in DB or JWT
app.use((err, req, res, next) => {
  let error = { ...err };
  if (error.name === 'CastError') {
    next(new AppError('Failed to casting', 400));
  }
  if (error.code === 11000) {
    next(new AppError('Duplicate field in email or username ', 400));
  }
  if (error.name === 'ValidationError') {
    next(new AppError('Validation error', 400));
  }

  if (error.name === 'JsonWebTokenError') {
    next(new AppError('Invalid token. Please log in again!', 401));
  }
  if (error.name === 'TokenExpiredError') {
    next(new AppError('Your token has expired! Please log in again.', 401));
  }

  next(err);
});

//Send error to user
app.use(sendError);
module.exports = app;
