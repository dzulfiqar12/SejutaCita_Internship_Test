const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//Made a token
const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

//Send token to user
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

//Authentication
exports.login = catchAsync(async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  //Check if username and password exist
  if (!username || !password) {
    return next(new AppError('Please provide username and password', 400));
  }
  //Check if user exist & password is correct
  const user = await User.findOne({ username }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect username or password', 401));
  }

  //If everything ok,send token to client
  const token = createSendToken(user._id, 200, res);
});

//JWT validators
exports.protect = catchAsync(async (req, res, next) => {
  //Check token and get it from cookies
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  //Verify token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  //Check if user still exist
  const loginUser = await User.findById(decoded.id);
  if (!loginUser) {
    return next(new AppError('The user is no longer exist', 401));
  }

  //Check if user changed password
  if (loginUser.passwordChanged(decoded.iat)) {
    return next(new AppError('Password has changed,please login again', 401));
  }
  req.user = loginUser;
  next();
});
//Authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You dont have a permission', 401));
    }
    next();
  };
};
