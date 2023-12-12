const express = require('express');
const userControllers = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/signUp').post(authController.signUp);
router.route('/login').post(authController.login);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router
  .route('/updateMe')
  .patch(authController.protect, userControllers.updateMe);

router
  .route('/deleteMe')
  .patch(authController.protect, userControllers.deleteMe);

router
  .route('/updateMyPassword')
  .patch(authController.protect, authController.updatePassword);

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);

module.exports = router;
