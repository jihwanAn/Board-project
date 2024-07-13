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
  let ACCESS_TOKEN = req.headers.authorization;

  if (!ACCESS_TOKEN) {
    console.log("No token");
    return res.status(CODE.MISSING_ACCESS_TOKEN);
  }

  let conn;
  ACCESS_TOKEN = ACCESS_TOKEN.split("Bearer ")[1];

  try {
    const decoded = decodeAccess(ACCESS_TOKEN);
    req.userInfo = decoded;
    return next();
  } catch (error) {
    // 엑세스 토큰 유효기간 만료
    if (error.message === "jwt expired") {
      try {
        conn = await pool.getConnection();
        // 리프레시 토큰 유효기간 조회
        const rows = await conn.query(QUERY.FIND_REFRESH_TOKEN, [ACCESS_TOKEN]);

        if (rows.length > 0) {
          const REFRESH_TOKEN = rows[0].refresh_token;

          try {
            // 리프레시 토큰 유효
            const decodedRefresh = decodeRefresh(REFRESH_TOKEN);
            // 새 토큰 생성
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
            // 리프레시 토큰 에러 => 로그아웃
            await conn.query(QUERY.DELETE_TOKEN, [ACCESS_TOKEN]);
            console.log("Refresh token error :: ", refreshError);
          }
        }
      } catch (dbError) {
        console.error("DB error :: ", dbError);
      } finally {
        if (conn) conn.release();
      }
      return res.status(CODE.UNAUTHORIZED).send("Token expired");
    }
    return res.status(500).send("Failed to authenticate token");
  }
};

module.exports = { verifyJwt };
