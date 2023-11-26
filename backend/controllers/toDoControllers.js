const ToDo = require('./../models/toDoModel');

exports.getAllToDos = async (req, res) => {
  try {
    const toDos = await ToDo.find();
    res.status(200).json({
      status: 'Success',
      results: toDos.length,
      data: {
        toDos: toDos,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.createToDo = async (req, res) => {
  try {
    const newToDo = await ToDo.create(req.body);
    res.status(200).json({
      status: 'Success',
      data: {
        toDos: newToDo,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};
