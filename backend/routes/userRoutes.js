const express = require('express');
const userControllers = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/signUp').post(authController.signUp);
router.route('/login').post(authController.login);

router.route('/forgotPassword').post(authController.forgotPassword);

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

module.exports = router;
