const { authController } = require('../controllers');
const authRoutes = require('express').Router();

/* User registration route */
authRoutes.post('/register', authController.registerUserController);

/* User login route */
authRoutes.post('/login', authController.loginUserController);

module.exports = authRoutes;