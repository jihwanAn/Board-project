const express = require("express");
const app = express();
const cors = require("cors");
const connect = require("./schemas"); // mongodb 연결
const boardRouter = require("./routes/boardRouter");
const memberRouter = require("./routes/memberRouter");
const dotenv = require("dotenv");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");

// MongoDB 연결
connect();

// .env 파일에서 환경 변수 로드
dotenv.config();

// 시크릿 키 생성 또는 가져오기
const accessTokenSecret =
  process.env.JWT_ACCESS_SECRET || crypto.randomBytes(64).toString("hex");
const refreshTokenSecret =
  process.env.JWT_REFRESH_SECRET || crypto.randomBytes(64).toString("hex");

// CORS 옵션
const corsOptions = {
  origin: [
    "https://free-board.netlify.app",
    "https://port-0-free-board-754g42aluoci77d.sel5.cloudtype.app",
    "http://localhost:3000",
  ],
  credentials: true, // 인증 정보(쿠키 등) 전송 허용
};

app.use(cors(corsOptions));

app.use(cookieParser());

// Body parser 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 등록
app.use("/board", boardRouter);
app.use("/user", memberRouter);

// 기본 페이지
app.use(express.static("/public"));

// 서버 시작
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

// 시크릿 키를 환경 변수에 저장
process.env.JWT_ACCESS_SECRET = accessTokenSecret;
process.env.JWT_REFRESH_SECRET = refreshTokenSecret;
