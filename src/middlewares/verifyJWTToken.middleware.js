const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../config/env.config');

const verifyJWTToken = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    jwt.verify(
      req.headers.authorization,
      JWT_SECRET_KEY,
      function (err, decode) {
        if (err) {
          req.userId = null;
          req.userName = null;
          req.userEmail = null;
          req.message =
            'Header verification failed, some issue with the token!';
          next();
        } else {
          console.log(decode);
          req.userId = decode.id;
          req.userName = decode.userName;
          req.userEmail = decode.email;
          req.message = 'User found successfully!';
          next();
        }
      }
    );
  } else {
    req.userId = null;
    req.userName = null;
    req.userEmail = null;
    req.message = 'Authorization header not found!';
    next();
  }
};

module.exports = verifyJWTToken;