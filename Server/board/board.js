const axios = require("axios");
const { pool } = require("../DB/connection");
const { QUERY } = require("../constants/query");
const jwt = require("jsonwebtoken");

const getBoard = async (req, res) => {
  let conn;

  try {
    // const { page } = req.query;

    conn = await pool.getConnection();
    const board = await conn.query(QUERY.GET_BOARD);

    conn.release();

    res.status(200).json(board);
  } catch (error) {
    console.log(error);
    if (conn) conn.release;
    res.status(500).send();
  }
};

const createPost = async (req, res) => {
  let conn;

  try {
    const { title, content, token } = req.body;
    const userInfo = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    conn = await pool.getConnection();

    await conn.query(QUERY.CREATE_POST, [
      userInfo.email,
      userInfo.nickName,
      title,
      content,
    ]);

    conn.release();

    res.status(200).send("Complete Posting");
  } catch (error) {
    console.log(error);
    if (conn) conn.release;
    res.status(500).send();
  }
};

module.exports = { getBoard, createPost };
