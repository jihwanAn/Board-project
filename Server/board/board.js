const { pool } = require("../DB/connection");
const { QUERY } = require("../constants/query");

const getBoard = async (req, res) => {
  let conn;

  try {
    const { page, itemsPerPage } = req.query;

    conn = await pool.getConnection();
    const rows_1 = await conn.query(QUERY.BOARD_COUNT);
    const { count } = rows_1[0];
    const totalPages = Math.ceil(Number(count) / itemsPerPage);

    const rows_2 = await conn.query(QUERY.GET_BOARD, [
      Number(itemsPerPage),
      (page - 1) * Number(itemsPerPage),
    ]);

    res.status(200).json({ totalPages, board: rows_2 });
  } catch (error) {
    console.log("fetching board Error :: ", error);
    res.status(500).send("fetching board Error");
  } finally {
    if (conn) conn.release();
  }
};

const getPostDetail = async (req, res) => {
  let conn;

  try {
    const { postId } = req.query;
    const userInfo = req.userInfo;

    conn = await pool.getConnection();
    const rows = await conn.query(QUERY.CHECK_POST_OWNER, [postId]);

    const isAuthor = userInfo.email === rows[0].email;
    res.status(200).json({ isAuthor });
  } catch (error) {
    console.log("checking post detail Error :: ", error);
    res.status(500).send("checking post detail Error");
  } finally {
    if (conn) conn.release();
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

    res.status(200).send("Complete Post");
  } catch (error) {
    console.log("creating post Error :: ", error);
    res.status(500).send("creating post Error");
  } finally {
    if (conn) conn.release();
  }
};

const editPost = async (req, res) => {
  let conn;

  try {
    const post = req.body.post;

    conn = await pool.getConnection();
    await conn.query(QUERY.EDIT_POST, [post.title, post.content, post.id]);

    res.status(200).send("Complete Edit");
  } catch (error) {
    console.log("Editing post Error :: ", error);
    res.status(500).send("Editing post Error");
  } finally {
    if (conn) conn.release();
  }
};

const deletePost = async (req, res) => {
  let conn;

  try {
    const board_id = req.query.postId;

    conn = await pool.getConnection();
    await conn.query(QUERY.DELETE_POST, [board_id]);

    res.status(200).send("Complete Delete");
  } catch (error) {
    console.log("Delete Error :: ", error);
    res.status(500).send("Delete Error");
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { getBoard, getPostDetail, createPost, editPost, deletePost };
