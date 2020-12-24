const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').post(authController.resetPassword);
router.route('/logout').post(authController.protect, authController.logout);
router.route('/sendMail').post(authController.sendMail);

module.exports = router;
