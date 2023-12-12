const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const sendMail = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// user SignUp
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

// user Login
exports.login = catchAsync(async (req, res, next) => {
  // const email = req.body.email;
  // const password = req.body.password;

  const { email, password } = req.body;

  //   1. Check Email and Password Exist
  if (!email || !password) {
    return next(new AppError('Enter email or password', 400));
  }

  //   2. if user exist and password is correct
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // console.log(user);

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

// protecting routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1. check token is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in!', 401));
  }
  // 2. token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. If user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('No user belong to this token, Log again!', 401));
  }

  // 4. check if user changed password after the token issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password', 401));
  }

  // 5. Grant access the protected route
  req.user = currentUser;

  next();
});

// user roles & permissions
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array -> ['admin', 'user']
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You have no permission to perform this!', 403));
    }
    next();
  };
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on POSTed request
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    return next(new AppError('No User with this Email', 404));
  }

  // 2. Generate a random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send it to user's email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/vi/users/resetPassword/${resetToken}`;

  const message = `Fogot your Password? \nSubmit a patch requset with your new Password! to: ${resetUrl}`;

  try {
    await sendMail({
      email: user.email,
      subject: 'Your password reset token( Valid for 10 minutes)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to your Email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Try again later!'));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token or User Invalid', 400));
  }

  // 3. update changedPasswordAt property for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 4. Log the user in, sent JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get User from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2. Check if POSTed password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Wrong Password Entered!', 401));
  }

  // 3. If so, updte password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // 4. Log user in, send JWT
  createSendToken(user, 200, res);
});
