//Routes handler
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

//Create for admin
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});

//Read for admin
//Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
//Get user by id
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

//Update for admin
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

//Delete for admin
exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

//Read for user
exports.userProfile = catchAsync(async (req, res, next) => {
  const userData = await User.findById(req.user._id);
  res.status(200).json({
    status: 'success',
    data: userData,
  });
});

//Signout
exports.signOut = (req, res, next) => {
  res.clearCookie('jwt');
  res.send('You already sign out');
};
