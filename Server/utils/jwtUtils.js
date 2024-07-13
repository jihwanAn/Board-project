const jwt = require("jsonwebtoken");
const {
  getAccessTokenSecret,
  getRefreshTokenSecret,
} = require("../config/secretKey");

// 엑세스 토큰 생성
const generateAccessToken = (userInfo) => {
  return jwt.sign(
    {
      user_id: userInfo.id,
      platform: userInfo.platform,
      email: userInfo.email,
      nick_name: userInfo.nick_name,
    },
    getAccessTokenSecret(),
    { expiresIn: "1h" }
  );
};

// 리프레시 토큰 생성
const generateRefreshToken = (userInfo) => {
  return jwt.sign(
    {
      user_id: userInfo.id,
      platform: userInfo.platform,
      email: userInfo.email,
      nick_name: userInfo.nick_name,
    },
    getRefreshTokenSecret(),
    { expiresIn: "6h" }
  );
};

// 엑세스 토큰 디코딩
const decodeAccess = (accessToken) => {
  try {
    const decoded = jwt.verify(accessToken, getAccessTokenSecret());
    return decoded;
  } catch (error) {
    console.error("decodeAccessError", error.message);
    throw error;
  }
};

// 리프레시 토큰 디코딩
const decodeRefresh = (refreshToken) => {
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
