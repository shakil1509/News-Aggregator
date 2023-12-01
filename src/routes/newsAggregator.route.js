const { newsAggregatorController } = require('../controllers');
const verifyJWTToken = require('../middlewares/verifyJWTToken.middleware');
const newsAggregatorRoutes = require('express').Router();

/* Get User preferences for news route */
newsAggregatorRoutes.get(
  '/users/preferences',
  verifyJWTToken,
  newsAggregatorController.getUsersNewsPreferencesController
);

/* Update User preferences for news route */
newsAggregatorRoutes.put(
  '/users/preferences',
  verifyJWTToken,
  newsAggregatorController.updateUsersNewsPreferencesController
);

/* Fetch all news routes */
newsAggregatorRoutes.get(
  '/news',
  verifyJWTToken,
  newsAggregatorController.getNewsBasisPreferencesController
);

module.exports = newsAggregatorRoutes;