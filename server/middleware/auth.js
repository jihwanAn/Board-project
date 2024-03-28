const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const Board = require("../schemas/board");
const Token = require("../schemas/Token");

// 토큰 존재 확인 및 refresh 토큰 전달 미들웨어
const verifyToken = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;

    console.log("decoded Access", decoded);
    next();
    return;
  } catch (error) {
    console.error(error.message);
    if (error.name === "TokenExpiredError") {
      try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
          req.user = null;
          next();
          return;
        }

        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );
        const storedToken = await Token.findOne({
          userId: decodedRefresh._id,
          token: refreshToken,
        });
        if (!storedToken) {
          req.user = null;
          next();
          return;
        }

        const newAccessToken = jwt.sign(
          { userId: decodedRefresh.userId },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: "1h" }
        );

        req.newAccessToken = newAccessToken;
        req.user = decodedRefresh;

        next();
      } catch (refreshError) {
        console.error(refreshError.message);
        if (refreshError.name === "jwt expired") {
          res
            .status(500)
            .json({ error: "세션이 만료되었습니다. 다시 로그인해주세요." });
        } else if (error.name === "jwt malformed") {
          req.user = null;
        } else {
          res.status(500).json({ error: error.message });
        }
      }
    }
  }
  next();
};

// 게시물 작성자 권한 검증 미들웨어
async function checkOwnership(req, res, next) {
  try {
    const postId = req.params.id;
    const userId = req.user ? req.user._id : null;

    const post = await Board.findById(postId);
    const postWriterId = post.writer_id;

    if (!post) {
      return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
    }

    const isOwner =
      userId && postWriterId.toString() === req.user._id.toString();

    req.isOwner = isOwner;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러" });
  }
}
module.exports = { checkOwnership, verifyToken };
