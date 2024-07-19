import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import URL from "../constants/url";
import { getSessionItem, removeSessionItem } from "../utils/storage";
import { requestPost } from "../api/fetch";

const Header = () => {
  const session = getSessionItem("token");
  const user = getSessionItem("user");
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreatePostPage = () => {
    navigate(URL.POST_CREATE);
  };

  const handleLogout = () => {
    if (user) {
      requestPost(URL.LOGOUT, { user_id: user.user_id });
    }
    removeSessionItem("token");
    removeSessionItem("user");
    alert("로그아웃 되었습니다.");
    navigate(URL.MAIN);
  };

  return (
    <Container>
      <Link to={URL.MAIN}>Title</Link>
      {session ? (
        <RightBox>
          {location.pathname === "/posts" ? (
            <button onClick={handleCreatePostPage}>글 작성</button>
          ) : null}
          <Link to={URL.MYPAGE} state={user}>
            마이페이지
          </Link>
          <button onClick={handleLogout}> 로그아웃</button>
        </RightBox>
      ) : (
        <Link to={URL.LOGIN}>로그인</Link>
      )}
    </Container>
  );
};

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 1.2rem;
  background-color: ${(props) => props.theme.colors.background};
`;

const RightBox = styled.div`
  display: flex;
  :nth-child(n) {
    margin-left: 1rem;
  }
`;

export default Header;
