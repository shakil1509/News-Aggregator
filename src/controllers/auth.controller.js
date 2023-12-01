const UserDetailsValidator = require('../validators/userDetails.validator');
const usersDetails = require('../db/users.json');
const bcrypt = require('bcrypt');
const { DATE_TIME } = require('../constants');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const {
  JWT_SECRET_KEY,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
} = require('../config/env.config');

/* Register User Controller */
const registerUserController = (req, res, next) => {
  let body = req.body;
  /* Validating user provided request body for registration */
  let isUservalidated =
    UserDetailsValidator.validateUserDetailsRequestInfo(body);
  if (isUservalidated.status) {
    let usersData = JSON.parse(JSON.stringify(usersDetails));
    let newUserDetails = {
      userId: 100 + 1 + usersData?.users?.length,
      userName: body.userName,
      email: body.email,
      password: bcrypt.hashSync(body.password, 8),
      role: body.role,
      createdAt: DATE_TIME,
    };
    usersData?.users?.push(newUserDetails);
    try {
      fs.writeFile(
        './src/db/users.json',
        JSON.stringify(usersData),
        {
          encoding: 'utf8',
          flag: 'w',
        },
        (err, data) => {
          if (err) {
            return res.status(500).json({
              status: 500,
              message: `Writing users in memory db failed: ${err}`,
            });
          } else {
            return res.status(500).json({
              status: 201,
              message: `User registered successfully!`,
            });
          }
        }
      );
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: `Writing users in memory db failed: ${error}`,
      });
    }
  } else {
    return res.status(isUservalidated.statusCode).json({
      status: isUservalidated.statusCode,
      message: isUservalidated.message,
    });
  }
};

/* Login User Controller */
const loginUserController = (req, res, next) => {
  let body = req.body;
  /* validating user provided request body for login */
  let isUservalidated = UserDetailsValidator.validateLoginRequestInfo(body);
  if (isUservalidated.status) {
    let accessToken = jwt.sign(
      {
        id: isUservalidated.userData[0]?.userId,
        email: isUservalidated.userData[0]?.email,
        userName: isUservalidated.userData[0]?.userName,
      },
      JWT_SECRET_KEY,
      { expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME }
    );
    if (accessToken) {
      return res.status(200).json({
        userEmail: isUservalidated.userData[0].email,
        message: 'Login successful!',
        accessToken: accessToken,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: 'Access Token generation failed! Please try again!',
      });
    }
  } else {
    return res.status(isUservalidated.statusCode).json({
      status: isUservalidated.statusCode,
      message: isUservalidated.message,
    });
  }
};

module.exports = {
  registerUserController,
  loginUserController,
};