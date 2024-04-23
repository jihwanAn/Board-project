const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../schemas/User");
const Board = require("../schemas/Board");
const Token = require("../schemas/Token");
const bcrypt = require("bcrypt");
const { verifyToken } = require("../middleware/auth");

// 회원 가입
router.post("/signup", async (req, res) => {
  try {
    const { name, userId, password } = req.body;

    // 데이터베이스에서 사용자 아이디 조회
    const existingUser = await User.findOne({ userId });
    // 이미 사용 중인 아이디인 경우
    if (existingUser) {
      return res.status(400).json({ error: "이미 사용 중인 아이디입니다." });
    }

    // 사용자 생성
    const user = new User({ name, userId, password });
    await user.save();
    res.status(200).json({ message: "회원 가입 성공" });
    console.log(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러" });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(401).json({ error: "사용자가 존재하지 않습니다." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });
    }

    // access token 생성
    const accessToken = jwt.sign(
      {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        posts: user.posts,
        roles: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "1h", // 1시간
      }
    );

    // refresh token 생성
    const refreshToken = jwt.sign(
      {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        posts: user.posts,
        roles: user.role,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "1d", // 1일
      }
    );

    saveRefreshToken(user._id, refreshToken);

    // 리프레시 토큰은 HTTP Only 쿠키로 설정하여 클라이언트에게 응답
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: true, // HTTPS 프로토콜에서만 쿠키가 전송되도록
      maxAge: 24 * 60 * 60 * 1000, // 24 시간
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

// 로그아웃
router.post("/logout", async (req, res) => {
  try {
    // 클라이언트에서 전송한 토큰 가져오기
    const token = req.headers.authorization;

    // DB에서 해당 토큰을 가진 리프레시 토큰 삭제
    await Token.deleteOne({ token });

    res.status(200).json({ message: "로그아웃 성공" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러" });
  }
});

// 회원 정보 조회 라우터
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("posts");

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.status(200).json({ user: user.toObject() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러" });
  }
});

// refresh 토큰 저장 함수
async function saveRefreshToken(userId, token) {
  try {
    const newToken = new Token({
      userId: userId,
      token: token,
    });
    await newToken.save();
    console.log("Token saved successfully");
  } catch (error) {
    console.error("Error saving token:", error);
  }
}

module.exports = router;
