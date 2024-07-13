const { pool } = require("../DB/connection");
const { CODE } = require("../constants/code");
const { QUERY } = require("../constants/query");

const getPosts = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const { category_id, page, itemsPerPage } = req.query;
    let rows_1, rows_2;

    if (Number(category_id) === -1) {
      rows_1 = await conn.query(QUERY.POSTS_COUNT);
      rows_2 = await conn.query(QUERY.GET_POSTS, [
        Number(itemsPerPage),
        (page - 1) * itemsPerPage,
      ]);
    } else {
      rows_1 = await conn.query(QUERY.POSTS_CATEGORY_COUNT, [category_id]);
      rows_2 = await conn.query(QUERY.POSTS_CATEGORY, [
        category_id,
        Number(itemsPerPage),
        (page - 1) * itemsPerPage,
      ]);
    }
    const { count } = rows_1[0];
    const totalItems = Number(count);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    res.status(200).json({ totalPages, posts: rows_2, totalItems });
  } catch (error) {
    console.log("fetching posts Error :: ", error);
    res.status(500).send("fetching posts Error");
  } finally {
    if (conn) conn.release();
  }
};

const getPostDetail = async (req, res) => {
  let conn;

  try {
    const { post_id } = req.query;
    let rows;
    let isAuthor = false;

    // 비로그인 사용자
    if (res.status === CODE.MISSING_ACCESS_TOKEN) {
      conn = await pool.getConnection();
      rows = await conn.query(QUERY.GET_POST_BY_ID, [post_id]);
    } else {
      // 로그인 사용자
      const userInfo = req.userInfo;

      conn = await pool.getConnection();
      rows = await conn.query(QUERY.CHECK_POST_OWNER, [post_id]);
      isAuthor = userInfo.user_id === rows[0].user_id;
    }

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
    if (res.status === CODE.MISSING_ACCESS_TOKEN) {
      return res.status(400).send("token required");
    } else {
      const { category_id, title, content } = req.body;
      const userInfo = req.userInfo;

      conn = await pool.getConnection();

      const result = await conn.query(QUERY.CREATE_POST, [
        userInfo.user_id,
        category_id,
        title,
        content,
      ]);

      const [rows] = await conn.query(QUERY.GET_POST_BY_ID, [result.insertId]);

      res.status(200).json(rows);
    }
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
    if (res.status === CODE.MISSING_ACCESS_TOKEN) {
      return res.status(400).send("token required");
    } else {
      const post = req.body.post;

      conn = await pool.getConnection();
      await conn.query(QUERY.EDIT_POST, [
        post.category_id,
        post.title,
        post.content,
        post.id,
      ]);

      res.status(200).send("Complete Edit");
    }
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
    if (res.status === CODE.MISSING_ACCESS_TOKEN) {
      return res.status(400).send("token required");
    } else {
      const post_id = req.query.post_id;

      conn = await pool.getConnection();
      await conn.query(QUERY.DELETE_POST, [post_id]);

      res.status(200).send("Complete Delete");
    }
  } catch (error) {
    console.log("Delete Error :: ", error);
    res.status(500).send("Delete Error");
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { getPosts, getPostDetail, createPost, editPost, deletePost };
