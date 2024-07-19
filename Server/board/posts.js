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
    res.status(500).send("fetching posts Error");
  } finally {
    if (conn) conn.release();
  }
};

const getPostDetail = async (req, res) => {
  let conn;
  let rows;

  try {
    const { post_id } = req.query;

    conn = await pool.getConnection();

    if (!req.cookies[`post_${post_id}_viewed`]) {
      res.cookie(`post_${post_id}_viewed`, "true", {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      await conn.query(QUERY.INCREASE_POST_VIEWS, [post_id]);

      rows = await conn.query(QUERY.GET_POST_BY_ID, [post_id]);
    } else {
      rows = await conn.query(QUERY.GET_POST_BY_ID, [post_id]);
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("getPostDetail Error :", error);
    res.status(500).send("getPostDetail Error");
  } finally {
    if (conn) conn.release();
  }
};

const createPost = async (req, res) => {
  let conn;

  try {
    const { category_id, title, content } = req.body;
    const userInfo = req.userInfo;

    conn = await pool.getConnection();
    await conn.query(QUERY.CREATE_POST, [
      userInfo.user_id,
      category_id,
      title,
      content,
    ]);

    res.status(200).json(category_id);
  } catch (error) {
    res.status(500).send("create post Error");
  } finally {
    if (conn) conn.release();
  }
};

const editPost = async (req, res) => {
  let conn;

  try {
    const post = req.body.post;
    const userInfo = req.userInfo;

    if (!post.user_id === userInfo.user_id) {
      return res.status(CODE.FORBIDDEN);
    }

    conn = await pool.getConnection();
    await conn.query(QUERY.EDIT_POST, [
      post.category_id,
      post.title,
      post.content,
      post.id,
    ]);

    res.status(200).send("complete Edit");
  } catch (error) {
    res.status(500).send("edit post Error");
  } finally {
    if (conn) conn.release();
  }
};

const deletePost = async (req, res) => {
  let conn;

  try {
    const { post_id, user_id } = req.query;
    const userInfo = req.userInfo;

    if (!user_id === userInfo.user_id) {
      return res.status(CODE.FORBIDDEN);
    }

    conn = await pool.getConnection();
    await conn.query(QUERY.DELETE_POST, [post_id]);

    res.status(200).send("complete delete");
  } catch (error) {
    res.status(500).send("delete post Error");
  } finally {
    if (conn) conn.release();
  }
};

const getComments = async (req, res) => {
  let conn;

  try {
    const { post_id } = req.query;

    conn = await pool.getConnection();
    const rows = await conn.query(QUERY.GET_COMMENTS_BY_POST_ID, [post_id]);
    const comments = rows[0].id ? rows : null;

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).send("getComments Error");
  } finally {
    if (conn) conn.release();
  }
};

const addComment = async (req, res) => {
  let conn;

  try {
    const userInfo = req.userInfo;
    const { post_id, user_id, comment } = req.body;

    if (!user_id === userInfo.user_id) {
      return res.status(CODE.FORBIDDEN);
    }

    conn = await pool.getConnection();
    await conn.query(QUERY.ADD_COMMENT, [userInfo.user_id, post_id, comment]);

    res.status(200).send("add comment");
  } catch (error) {
    res.status(500).send("add comment Error");
  } finally {
    if (conn) conn.release();
  }
};

const deleteComment = async (req, res) => {
  let conn;

  try {
    const { user_id, comment_id } = req.query;
    const userInfo = req.userInfo;

    if (!user_id === userInfo.user_id) {
      return res.status(CODE.FORBIDDEN);
    }

    conn = await pool.getConnection();
    await conn.query(QUERY.DELETE_COMMENT, [comment_id]);

    res.status(200).send();
  } catch (error) {
    res.status(500).send("delete comment Error");
  } finally {
    if (conn) conn.release();
  }
};

const getUserActivity = async (req, res) => {
  let conn;

  try {
    const { user_id } = req.query;

    conn = await pool.getConnection();
    const rows = await conn.query(QUERY.GET_POST_BY_USER_ID, [user_id]);

    res.status(200).json(rows);
  } catch (error) {
    res.send(500).send();
  } finally {
    if (conn) conn.release();
  }
};

const getLikes = async (req, res) => {
  let conn;

  try {
    const { post_id } = req.query;
    conn = await pool.getConnection();
    const rows = await conn.query(QUERY.POST_GET_LIKES, [post_id]);

    res.status(200).json(rows);
  } catch (error) {
    res.status(200).send("getLikes error");
  } finally {
    if (conn) conn.release();
  }
};

const toggleLikeToPost = async (req, res) => {
  let conn;

  try {
    const { user_id, post_id } = req.body;

    conn = await pool.getConnection();
    const rows = await conn.query(QUERY.POST_CHECK_LIKE, [user_id, post_id]);

    if (rows.length > 0) {
      await conn.query(QUERY.POST_DELETE_LIKE, [user_id, post_id]);
    } else {
      await conn.query(QUERY.POST_ADD_LIKE, [user_id, post_id]);
    }

    res.status(200).json(rows);
  } catch (error) {
    res.send(500).send("add Like to post Error");
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getPosts,
  getPostDetail,
  createPost,
  editPost,
  deletePost,
  getComments,
  addComment,
  deleteComment,
  getUserActivity,
  getLikes,
  toggleLikeToPost,
};
