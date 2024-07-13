const { pool } = require("../DB/connection");
const { CODE } = require("../constants/code");
const { QUERY } = require("../constants/query");

const createComment = async (req, res) => {
  let conn;

  try {
    if (res.status === CODE.MISSING_ACCESS_TOKEN) {
      return res.status(400).send("token required");
    } else {
      const userInfo = req.userInfo;
      const { post_id, comment } = req.body;

      conn = await pool.getConnection();
      conn.query(QUERY.CREATE_COMMENT, [userInfo.user_id, post_id, comment]);

      res.status(200).send("Create Comment");
    }
  } catch (error) {
    console.log("Create Comment Error :: ", error);
    res.status(500).send("Create Comment Error");
  } finally {
    if (conn) conn.release();
  }
};

module.exports = { createComment };
