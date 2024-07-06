const crypto = require("crypto");

const accessTokenSecret =
  process.env.JWT_ACCESS_SECRET || crypto.randomBytes(64).toString("hex");
const refreshTokenSecret =
  process.env.JWT_REFRESH_SECRET || crypto.randomBytes(64).toString("hex");

const getAccessTokenSecret = () => accessTokenSecret;
const getRefreshTokenSecret = () => refreshTokenSecret;

module.exports = {
  getAccessTokenSecret,
  getRefreshTokenSecret,
};
