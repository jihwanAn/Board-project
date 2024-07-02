const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// 시크릿 키 생성, 저장
const accessTokenSecret =
  process.env.JWT_ACCESS_SECRET || crypto.randomBytes(64).toString("hex");
const refreshTokenSecret =
  process.env.JWT_REFRESH_SECRET || crypto.randomBytes(64).toString("hex");

// 토큰 생성
function generateAccessToken(userInfo) {
  return jwt.sign(
    {
      id: userInfo.id,
      platform: userInfo.platform,
      email: userInfo.email,
      nickName: userInfo.nick_name,
    },
    accessTokenSecret,
    { expiresIn: "15m" }
  );
}

function generateRefreshToken(userInfo) {
  return jwt.sign(
    { id: userInfo.id, email: userInfo.email },
    refreshTokenSecret,
    { expiresIn: "1d" }
  );
}

module.exports = { generateAccessToken, generateRefreshToken };
