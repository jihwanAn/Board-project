const axios = require("axios");
const { pool } = require("../DB/connection");
const { QUERY } = require("../constants/query");
const jwt = require("jsonwebtoken");
const { CODE } = require("../constants/code");

const getBoard = async (req, res) => {
  let conn;

  try {
    // const { page } = req.query;

    conn = await pool.getConnection();
    const board = await conn.query(QUERY.GET_BOARD);

    res.status(200).json(board);
  } catch (error) {
    console.log("fetching board Error :: ", error);
    res.status(500).send("fetching board Error");
  } finally {
    if (conn) conn.release();
  }
};

const getPostDetail = async (req, res) => {
  try {
    const { post } = req.query;
    const userInfo = req.userInfo;

    const isAuthor = userInfo.email === post.email;

    res.status(200).json({ isAuthor });
  } catch (error) {
    console.log("checking post detail Error :: ", error);
    res.status(500).send("checking post detail Error");
  }
};

const createPost = async (req, res) => {
  let conn;

  try {
    const { title, content } = req.body;
    const userInfo = req.userInfo;

    conn = await pool.getConnection();

    await conn.query(QUERY.CREATE_POST, [
      userInfo.email,
      userInfo.nick_name,
      title,
      content,
    ]);

    res.status(200).send("Complete Posting");
  } catch (error) {
    console.log("creating post Error :: ", error);
    res.status(500).send("creating post Error");
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { getBoard, getPostDetail, createPost };
