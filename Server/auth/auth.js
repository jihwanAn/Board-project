const axios = require("axios");
const { pool } = require("../DB/connection");
const { QUERY } = require("../constants/query");
const { CODE } = require("../constants/code");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwtUtils");
const bcrypt = require("bcrypt");

// 로그인
const loginUser = async (req, res) => {
  let conn;

  try {
    const { email, password } = req.body;
    conn = await pool.getConnection();
    const rows = await conn.query(QUERY.GET_USER, ["local", email]);

    if (rows.length > 0) {
      const userInfo = rows[0];

      const valid_PW = await bcrypt.compare(password, userInfo.password);
      if (!valid_PW) {
        return res.status(CODE.INVALID_CREDENTIALS).send();
      }

      const accessToken = generateAccessToken({
        ...userInfo,
        user_id: userInfo.id,
      });
      const refreshToken = generateRefreshToken({
        ...userInfo,
        user_id: userInfo.id,
      });

      await conn.query(QUERY.DELETE_TOKEN_BY_USER_ID, [userInfo.id]);
      await conn.query(QUERY.SAVE_TOKEN, [
        userInfo.id,
        accessToken,
        refreshToken,
      ]);

      res.status(200).header("Authorization", `Bearer ${accessToken}`).json({
        user_id: userInfo.id,
        email: userInfo.email,
        nick_name: userInfo.nick_name,
      });
    } else {
      return res.status(CODE.ACCOUNT_NOT_REGISTERD).send();
    }
  } catch (error) {
    res.status(500).send("Login Error");
  } finally {
    if (conn) conn.release();
  }
};

// 구글 로그인
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

    // 로그인 성공
    if (rows.length > 0) {
      const userInfo = rows[0];

      const accessToken = generateAccessToken({
        ...userInfo,
        user_id: userInfo.id,
      });
      const refreshToken = generateRefreshToken({
        ...userInfo,
        user_id: userInfo.id,
      });

      await conn.query(QUERY.DELETE_TOKEN_BY_USER_ID, [userInfo.id]);

      await conn.query(QUERY.SAVE_TOKEN, [
        userInfo.id,
        accessToken,
        refreshToken,
      ]);

      res.status(200).header("Authorization", `Bearer ${accessToken}`).json({
        user_id: userInfo.id,
        email: userInfo.email,
        nick_name: userInfo.nick_name,
      });
    } else {
      // 등록 된 계정 정보 없음
      res
        .status(CODE.ACCOUNT_NOT_REGISTERD)
        .json({ platform: "google", email: data.email });
    }
  } catch (error) {
    res.status(500).send("getGoogleUser Error");
  } finally {
    if (conn) conn.release();
  }
};

// 회원 가입
const signupUser = async (req, res) => {
  let conn;

  try {
    const { email, password, nick_name } = req.body;
    const hashed_PW = await bcrypt.hash(password, 10);

    conn = await pool.getConnection();
    await conn.query(QUERY.SIGNUP_USER, [email, hashed_PW, nick_name]);

    res.status(200).send("Signup Success");
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(CODE.DUPLICATE_EMAIL).send();
    }
    res.status(500).send("Signup Error");
  } finally {
    if (conn) conn.release();
  }
};

// 구글 계정으로 가입
const registerUser = async (req, res) => {
  let conn;

  try {
    const { platform, email, nick_name } = req.body;

    conn = await pool.getConnection();
    await conn.query(QUERY.REGISTER_ACCOUNT, [platform, email, nick_name]);

    res.status(200).send();
  } catch (error) {
    res.status(500).send("registerUser Error");
  } finally {
    if (conn) conn.release();
  }
};

// 로그아웃
const logoutUser = async (req, res) => {
  let conn;

  try {
    const { user_id } = req.body;

    conn = await pool.getConnection();
    await conn.query(QUERY.DELETE_TOKEN_BY_USER_ID, [user_id]);
  } catch (error) {
    console.error("logout Error:", error);
  } finally {
    res.status(200).send();
    if (conn) conn.release();
  }
};

// 닉네임 중복 체크
const checkNickname = async (req, res) => {
  let conn;

  try {
    const { nick_name } = req.query;

    conn = await pool.getConnection();
    const rows = await conn.query(QUERY.CHECK_NICKNAME, nick_name);

    // 중복 된 닉네임
    if (rows.length > 0) {
      res.status(CODE.DUPLICATE_NICKNAME).send();
    } else {
      res.send("Available Nickname");
    }
  } catch (error) {
    res.status(500).send("Nickname check Error");
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  loginUser,
  getGoogleUser,
  signupUser,
  logoutUser,
  registerUser,
  checkNickname,
};
