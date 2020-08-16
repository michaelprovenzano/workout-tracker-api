const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.route('/').get(userController.getAllUsers).post(userController.register);

router.use(authController.protect);
router.route('/:id').get(userController.getUserById).patch(userController.updateUser);

module.exports = router;
