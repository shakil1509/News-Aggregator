const fs = require('fs');
const requestLoggerData = require('../db/requestLogger.json');
const { DATE_TIME } = require('../constants');

/* Request details logger middleware */
const requestLoggerMiddleware = (req, res, next) => {
  let requestLoggerObj = {
    requestURL: req.url,
    requestMethod: req.method,
    requestTime: DATE_TIME,
  };
  let reqLogsData = JSON.parse(JSON.stringify(requestLoggerData));
  reqLogsData.requestLogs.push(requestLoggerObj);
  try {
    let finalReqLogs = JSON.stringify(reqLogsData);
    fs.writeFileSync('./src/db/requestLogger.json', finalReqLogs, {
      encoding: 'utf8',
      flag: 'w',
    });
  } catch (error) {
    console.log(`Encountered error while writing log: ${error}`);
  }
  next();
};

module.exports = requestLoggerMiddleware;