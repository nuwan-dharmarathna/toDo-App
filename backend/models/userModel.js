const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: [true, 'User must have a email address'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must contain more than 6 characters'],
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
