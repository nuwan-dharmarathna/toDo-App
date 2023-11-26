const express = require('express');
const userControllers = require('./../controllers/userController');

const router = express.Router();

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

module.exports = router;
