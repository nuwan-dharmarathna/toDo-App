const mongoose = require('mongoose');

const toDoSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    maxlength: [100, 'Description should be less than 100 characters'],
  },
});

const ToDo = mongoose.model('ToDo', toDoSchema);

module.exports = ToDo;
