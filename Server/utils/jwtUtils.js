const jwt = require("jsonwebtoken");
const {
  getAccessTokenSecret,
  getRefreshTokenSecret,
} = require("../config/secretKey");

// 엑세스 토큰 생성
const generateAccessToken = (userInfo) => {
  return jwt.sign(
    {
      id: userInfo.id,
      platform: userInfo.platform,
      email: userInfo.email,
      nick_name: userInfo.nick_name,
    },
    getAccessTokenSecret(),
    { expiresIn: "10s" }
  );
};

// 리프레시 토큰 생성
const generateRefreshToken = (userInfo) => {
  return jwt.sign(
    {
      id: userInfo.id,
      platform: userInfo.platform,
      email: userInfo.email,
      nick_name: userInfo.nick_name,
    },
    getRefreshTokenSecret(),
    { expiresIn: "5m" }
  );
};

// 엑세스 토큰 디코딩
const decodeAccess = async (accessToken) => {
  try {
    const decoded = jwt.verify(accessToken, getAccessTokenSecret());
    return decoded;
  } catch (error) {
    console.error("decodeAccessError", error.message);
    throw error;
  }
};

// 리프레시 토큰 디코딩
const decodeRefresh = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, getRefreshTokenSecret());
    return decoded;
  } catch (error) {
    console.error("decodeRefreshError", error.message);
    throw error;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  decodeAccess,
  decodeRefresh,
};
