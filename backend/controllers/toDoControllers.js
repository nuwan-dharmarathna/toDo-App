const ToDo = require('./../models/toDoModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllToDos = catchAsync(async (req, res) => {
  const toDos = await ToDo.find();
  res.status(200).json({
    status: 'Success',
    results: toDos.length,
    data: {
      toDos: toDos,
    },
  });
});

exports.createToDo = catchAsync(async (req, res, next) => {
  const newToDo = await ToDo.create(req.body);
  res.status(200).json({
    status: 'Success',
    data: {
      toDos: newToDo,
    },
  });
});
