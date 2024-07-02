const axios = require("axios");
const { pool } = require("../DB/connection");
const { QUERY } = require("../constants/query");
const { CODE } = require("../constants/code");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwtUtils");

const getGoogleUser = async (req, res) => {
  let conn;

  try {
    const { tokenResponse } = req.query;

    // 구글 유저 정보 요청
    const { data } = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
    );

    // DB users에서 유저 정보 조회
    conn = await pool.getConnection();
    const rows = await conn.query(QUERY.GET_USER, ["google", data.email]);
    console.log("Registered User Info :: ", rows);

    conn.release();

    // 로그인 성공
    if (rows.length > 0) {
      const userInfo = rows[0];

      // JWT 토큰 발급
      const accessToken = generateAccessToken(userInfo);
      const refreshToken = generateRefreshToken(userInfo);

      // Token DB 저장
      conn = await pool.getConnection();

      // token 테이블에 이전의 토큰 남아있다면 삭제
      await conn.query(QUERY.REMOVE_TOKEN, [userInfo.email]);

      // 토큰 DB에 저장
      conn.query(QUERY.SAVE_TOKEN, [userInfo.email, accessToken, refreshToken]);

      res.status(200).json({ token: accessToken });
    } else {
      // 등록 된 계정 정보 없음
      res
        .status(CODE.ACCOUNT_NOT_REGISTERD)
        .json({ platform: "google", email: data.email });
    }
  } catch (error) {
    console.log(error);
    if (conn) conn.release;
    res.status(500).send();
  }
};

const registerUser = async (req, res) => {
  let conn;

  try {
    const { nickName, platform, email } = req.body.userInfo;

    conn = await pool.getConnection();

    // 계정 등록
    await conn.query(QUERY.REGISTER_ACCOUNT, [platform, email, nickName]);

    conn.release();

    res.status(200).send();
  } catch (error) {
    console.log(error);
    if (conn) conn.release;
    res.status(500).send();
  }
};

const varifyNickname = async (req, res) => {
  let conn;

  try {
    const nickName = req.query.nickName;

    conn = await pool.getConnection();

    // 닉네임 중복 체크
    const rows = await conn.query(QUERY.CHECK_NICKNAME, nickName);

    conn.release();

    // 중복 된 닉네임
    if (rows.length > 0) {
      res.status(CODE.DUPLICATE_NICKNAME).send();
    } else {
      res.send("Available Nickname");
    }
  } catch (error) {
    console.log(error);
    if (conn) conn.release;
    res.status(500).send();
  }
};

// const removeToken = async (req, res) => {
//   let conn;

//   try {
//     const { token } = req.body.token;

//     conn = await pool.getConnection();
//     await conn.query(QUERY.REMOVE_TOKEN, [token]);

//     conn.release();

//     res.send("Complete Logout");
//   } catch (error) {
//     console.log(error);
//     if (conn) conn.release;
//     res.status(500).send();
//   }
// };

module.exports = { getGoogleUser, registerUser, varifyNickname };
