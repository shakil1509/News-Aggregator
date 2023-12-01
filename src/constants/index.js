const USER_ROLES = ["normal", "admin"];
const CURRENT_DATE = new Date();
const DATE_TIME =
    CURRENT_DATE.getDate() +
    '/' +
    (CURRENT_DATE.getMonth() + 1) +
    '/' +
    CURRENT_DATE.getFullYear() +
    ' @ ' +
    CURRENT_DATE.getHours() +
    ':' +
    CURRENT_DATE.getMinutes() +
    ':' +
    CURRENT_DATE.getSeconds();

module.exports = {
  USER_ROLES,
  DATE_TIME
};