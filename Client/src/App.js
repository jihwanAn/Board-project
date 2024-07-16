import React from "react";
import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import URL from "./constants/url";
import Header from "./components/Header";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyPage from "./pages/MyPage";
import POSTS from "./pages/board/Posts";
import CreatePost from "./pages/board/CreatePost";
import DetailPost from "./pages/board/DetailPost";
import EditPost from "./pages/board/EditPost";

function App() {
  return (
    <Container>
      <Header />
      <Contents>
        <Routes>
          <Route path={URL.MAIN} element={<Main />} />
          <Route path={URL.LOGIN} element={<Login />} />
          <Route path={URL.REGISTER} element={<Register />} />
          <Route path={URL.MYPAGE} element={<MyPage />} />
          <Route path={URL.POSTS} element={<POSTS />} />
          <Route path={URL.POST_CREATE} element={<CreatePost />} />
          <Route path={URL.POST_DETAIL} element={<DetailPost />} />
          <Route path={URL.POST_EDIT} element={<EditPost />} />
        </Routes>
      </Contents>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
`;

const Contents = styled.main`
  height: 100%;
`;

export default App;
