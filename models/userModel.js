const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Please provide your username'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Please provide your address'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  //If password not modified password won't encrypted again
  if (!this.isModified('password')) {
    return next();
  }
  //Encrypt password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//Schema method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};

//Create model from schema
const User = mongoose.model('User', userSchema);
module.exports = User;
