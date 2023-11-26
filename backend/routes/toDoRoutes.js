const express = require('express');
const toDoControllers = require('./../controllers/toDoControllers');

const router = express.Router();

router
  .route('/')
  .get(toDoControllers.getAllToDos)
  .post(toDoControllers.createToDo);

module.exports = router;
