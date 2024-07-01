const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { URL } = require("./constants/url");
const { getGoogleUser, registerUser, varifyNickname } = require("./auth/auth");

// Body parser 미들웨어
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(cookieParser());

// 구글 로그인
app.get(URL.LOGIN_GOOGLE, getGoogleUser);
app.post(URL.REGISTER, registerUser);
app.get(URL.VERIFY_NICKNAME, varifyNickname);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
