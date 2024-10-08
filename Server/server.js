const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const { URL } = require("./constants/url");
const {
  loginUser,
  getGoogleUser,
  signupUser,
  logoutUser,
  registerUser,
  checkNickname,
  changeNickName,
} = require("./auth/auth");
const {
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
  getPopularPosts,
} = require("./board/posts");
const { verifyJwt } = require("./middlewares/verifyJwt");
const db = require("./DB/connection");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    exposedHeaders: ["Authorization"],
    credentials: true,
  })
);

// 로그인
app.post(URL.LOGIN, loginUser);
app.get(URL.LOGIN_GOOGLE, getGoogleUser);
app.post(URL.LOGOUT, logoutUser);

// 가입
app.post(URL.SIGNUP, signupUser);
app.post(URL.REGISTER, registerUser);
app.get(URL.CHECK_NICKNAME, checkNickname);

// 게시판
app.get(URL.POSTS, getPosts);
app.get(URL.POST_DETAIL, getPostDetail);
app.post(URL.POST_CREATE, verifyJwt, createPost);
app.post(URL.POST_EDIT, verifyJwt, editPost);
app.delete(URL.POST_DELETE, verifyJwt, deletePost);
app.get(URL.COMMENT, getComments);
app.post(URL.COMMENT, verifyJwt, addComment);
app.delete(URL.COMMENT, verifyJwt, deleteComment);
app.get(URL.LIKE, getLikes);
app.post(URL.LIKE, toggleLikeToPost);
app.get(URL.POPULAR, getPopularPosts);

// 마이페이지
app.get(URL.MYPAGE, getUserActivity);
app.post(URL.CHANGE_NICKNAME, verifyJwt, changeNickName);

// db 테이블 생성
const runDbInit = async () => {
  try {
    await db.executeSqlFile("../init/create_table.sql");
    console.log("Tables created successfully");
    await db.insertCategories();
    console.log("Category settings complete");
  } catch (error) {
    console.error("Error executing SQL file", error);
  }
};
runDbInit();

app.use(express.static(path.join(__dirname, "../Client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Client/build", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server Port : ${PORT}`);
});
