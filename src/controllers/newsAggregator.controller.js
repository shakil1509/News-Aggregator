const usersDetails = require('../db/users.json');
const usersPreferences = require('../db/usersPreference.json');
const fs = require('fs');
const URLSearchParams = require('url-search-params');
const { fetchNews } = require('../services/newsapi.service');
const { NEWS_AGGREGATOR_API_KEY } = require('../config/env.config');
// const URI_NEWSAPI_EVERYTHING = 'https://newsapi.org/v2/everything';
const URI_NEWSAPI_TOP = 'https://newsapi.org/v2/top-headlines';

/* Get User News Preferences Controller */
const getUsersNewsPreferencesController = (req, res, next) => {
  const { userId, userName, userEmail, message } = req;
  if (userId) {
    let usersPreferencesData = JSON.parse(JSON.stringify(usersPreferences));
    let filteredUserPreference = usersPreferencesData.userPreferences?.filter(
      (userPreferences) => userPreferences.userId == userId
    );
    if (filteredUserPreference.length) {
      return res.status(200).json({
        status: 200,
        message: `User News Preferences found`,
        data: filteredUserPreference,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: `User News Preferences not found!`,
      });
    }
  } else {
    return res.status(403).json({
      status: 403,
      message: message,
    });
  }
};

/* Update User News Preferences Controller */
const updateUsersNewsPreferencesController = (req, res, next) => {
  const { userId, userName, userEmail, message } = req;
  if (userId) {
    let usersData = JSON.parse(JSON.stringify(usersDetails));
    let isUserExist = usersData.users.findIndex(
      (user) => (user.userId = userId)
    );
    if (isUserExist !== -1) {
      let usersPreferencesData = JSON.parse(JSON.stringify(usersPreferences));
      let filteredUserPreferenceIdx =
        usersPreferencesData.userPreferences?.findIndex(
          (userPreferences) => userPreferences.userId == userId
        );
      if (filteredUserPreferenceIdx == -1) {
        let userPreferenceObj = {
          userId: userId,
          preferences: {
            categories: req.body.categories || [],
            sources: req.body.sources || [],
          },
        };
        usersPreferencesData.userPreferences.push(userPreferenceObj);
        let finalUsersPreference = JSON.stringify(usersPreferencesData);
        try {
          fs.writeFile(
            './src/db/usersPreference.json',
            finalUsersPreference,
            { encoding: 'utf8', flag: 'w' },
            (err, data) => {
              if (err) {
                return res.status(500).json({
                  status: 500,
                  message: `Writing users news preferences in memory db failed: ${err}`,
                });
              } else {
                return res.status(500).json({
                  status: 200,
                  message: `User News Preferences updated successfully!`,
                });
              }
            }
          );
        } catch (error) {
          return res.status(500).json({
            status: 500,
            message: `Writing users news preferences in memory db failed: ${err}`,
          });
        }
      } else {
        usersPreferencesData.userPreferences[filteredUserPreferenceIdx] = {
          ...usersPreferencesData.userPreferences[filteredUserPreferenceIdx],
          preferences: {
            categories: req.body.categories || [],
            sources: req.body.sources || [],
          },
        };
        let finalUsersPreference = JSON.stringify(usersPreferencesData);
        try {
          fs.writeFile(
            './src/db/usersPreference.json',
            finalUsersPreference,
            { encoding: 'utf8', flag: 'w' },
            (err, data) => {
              if (err) {
                return res.status(500).json({
                  status: 500,
                  message: `Writing users news preferences in memory db failed: ${err}`,
                });
              } else {
                return res.status(500).json({
                  status: 200,
                  message: `User News Preferences updated successfully!`,
                });
              }
            }
          );
        } catch (error) {
          return res.status(500).json({
            status: 500,
            message: `Writing users news preferences in memory db failed: ${err}`,
          });
        }
      }
    } else {
      return res.status(404).json({
        status: 404,
        message: `User not found with userId: ${userId}`,
      });
    }
  } else {
    return res.status(403).json({
      status: 403,
      message: message,
    });
  }
};

/* Get News basis User Preferences Controller */
const getNewsBasisPreferencesController = async (req, res, next) => {
  const { userId, userName, userEmail, message } = req;
  if (userId) {
    let userPreferences = JSON.parse(JSON.stringify(usersPreferences));
    let filteredPreference = userPreferences?.userPreferences?.filter(
      (userPreferences) => userPreferences.userId == userId
    );
    if (
      filteredPreference.length &&
      (filteredPreference[0].preferences.categories.length ||
        filteredPreference[0].preferences.sources.length)
    ) {
      try {
        let payload = {
          sources:
            'techcrunch' || filteredPreference[0].preferences.sources.join(','),
          apiKey: NEWS_AGGREGATOR_API_KEY,
        };
        let searchParams = new URLSearchParams(payload);
        let newsRes = await fetchNews(`${URI_NEWSAPI_TOP}?${searchParams}`);
        return res.status(200).json({
          status: 200,
          data: newsRes?.articles,
        });
      } catch (error) {
        return res.status(500).json({
          error: error,
        });
      }
    }
  } else {
    return res.status(403).json({
      status: 403,
      message: message,
    });
  }
};

module.exports = {
  getUsersNewsPreferencesController,
  updateUsersNewsPreferencesController,
  getNewsBasisPreferencesController,
};