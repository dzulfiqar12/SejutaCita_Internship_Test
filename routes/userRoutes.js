const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();
router.route('/login').post(authController.login);

//Routes for signout
router
  .route('/signOut')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    userController.signOut
  );
//Route for user profile
router
  .route('/userProfile')
  .get(
    authController.protect,
    authController.restrictTo('user'),
    userController.userProfile
  );
//Routes for admin CRUD
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  )
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.createUser
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getUser
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser
  );

module.exports = router;
