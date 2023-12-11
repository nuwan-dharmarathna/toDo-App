const express = require('express');
const toDoControllers = require('./../controllers/toDoControllers');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    toDoControllers.getAllToDos
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    toDoControllers.createToDo
  );

module.exports = router;
