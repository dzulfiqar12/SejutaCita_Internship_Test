//Formatting the error and send to user
const AppError = require('./../utils/appError');

const sendError = (err, res) => {
  if (err.statusCode === undefined) {
    err.statusCode = 500;
  }
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  sendError(err, res);
};
