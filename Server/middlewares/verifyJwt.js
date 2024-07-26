const { pool } = require("../DB/connection");
const { CODE } = require("../constants/code");
const { QUERY } = require("../constants/query");
const {
  generateAccessToken,
  generateRefreshToken,
  decodeAccess,
  decodeRefresh,
} = require("../utils/jwtUtils");

const verifyJwt = async (req, res, next) => {
  let conn;
  let rows;
  let ACCESS_TOKEN = req.headers.authorization;

  try {
    if (!ACCESS_TOKEN) {
      return res.status(CODE.UNAUTHORIZED).send();
    }

    ACCESS_TOKEN = ACCESS_TOKEN.split("Bearer ")[1];

    const decoded = decodeAccess(ACCESS_TOKEN);
    req.userInfo = decoded;
    return next();
  } catch (error) {
    if (error.message === "jwt expired") {
      try {
        conn = await pool.getConnection();
        rows = await conn.query(QUERY.FIND_REFRESH_TOKEN, [ACCESS_TOKEN]);

        if (rows.length < 1) {
          await conn.query(QUERY.DELETE_TOKEN_BY_ACCESS, [ACCESS_TOKEN]);

          return res.status(CODE.UNAUTHORIZED).send();
        }

        const REFRESH_TOKEN = rows[0].refresh_token;
        const decodedRefresh = decodeRefresh(REFRESH_TOKEN);

        const newAccessToken = generateAccessToken(decodedRefresh);
        const newRefreshToken = generateRefreshToken(decodedRefresh);

        await conn.query(QUERY.UPDATE_TOKENS, [
          newAccessToken,
          newRefreshToken,
          decodedRefresh.user_id,
        ]);

        req.userInfo = decodedRefresh;
        res.header("Authorization", `Bearer ${newAccessToken}`);
        return next();
      } catch (refreshError) {
        await conn.query(QUERY.DELETE_TOKEN_BY_ACCESS, [ACCESS_TOKEN]);

        return res.status(CODE.TOKEN_EXPIRED).send();
      } finally {
        if (conn) conn.release();
      }
    }
    await conn.query(QUERY.DELETE_TOKEN_BY_ACCESS, [ACCESS_TOKEN]);

    return res.status(400).send();
  }
};

module.exports = { verifyJwt };
