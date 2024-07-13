const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { URL } = require("./constants/url");
const {
  loginUser,
  getGoogleUser,
  signupUser,
  registerUser,
  checkNickname,
} = require("./auth/auth");
const {
  getPosts,
  getPostDetail,
  createPost,
  editPost,
  deletePost,
} = require("./board/posts");
const { createComment } = require("./board/comments");
const { verifyJwt } = require("./middlewares/verifyJwt");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({ origin: "http://localhost:3000", exposedHeaders: ["Authorization"] })
);
app.use(cookieParser());

// 로그인
app.post(URL.LOGIN, loginUser);
app.get(URL.LOGIN_GOOGLE, getGoogleUser);

// 가입
app.post(URL.SIGNUP, signupUser);
app.post(URL.REGISTER, registerUser);
app.get(URL.CHECK_NICKNAME, checkNickname);

// 게시판
app.get(URL.POSTS, getPosts);
app.get(URL.POST_DETAIL, verifyJwt, getPostDetail);
app.post(URL.POST_CREATE, verifyJwt, createPost);
app.post(URL.POST_EDIT, verifyJwt, editPost);
app.delete(URL.POST_DELETE, verifyJwt, deletePost);

// app.get(URL.COMMENTS, getComments);
app.post(URL.COMMENTS_CREATE, verifyJwt, createComment);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
