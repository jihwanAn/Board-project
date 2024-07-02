import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import URL from "../constants/url";
import { getSessionItem } from "../utils/storage";
import { removeSessionItem } from "../utils/storage";
// import { requestPost } from "../api/fetch";

const Header = () => {
  const session = getSessionItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreatePostPage = () => {
    navigate(URL.POST_CREATE);
  };

  const handleLogout = () => {
    // requestPost(URL.LOGOUT, { token: session });
    removeSessionItem("token");
    alert("로그아웃 되었습니다.");
    navigate(URL.MAIN);
  };

  return (
    <Container>
      <Link to={URL.MAIN}>Title</Link>
      {session ? (
        <RightBox>
          {location.pathname === "/board" ? (
            <button onClick={handleCreatePostPage}>글 작성</button>
          ) : null}
          <div style={{ marginLeft: "1.6rem" }}>환영합니다</div>
          <LogoutBtn onClick={handleLogout}> 로그아웃</LogoutBtn>
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
`;

const LogoutBtn = styled.button`
  margin-left: 1.5rem;
`;

export default Header;
