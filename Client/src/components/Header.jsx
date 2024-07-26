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
      <ContentWrapper>
        <TitleLink to={URL.MAIN}>Title</TitleLink>
        {session ? (
          <RightBox>
            {location.pathname === "/posts" ? (
              <Button onClick={handleCreatePostPage}>글 작성</Button>
            ) : null}
            <Link to={URL.MYPAGE} state={user}>
              마이페이지
            </Link>
            <Button onClick={handleLogout}>로그아웃</Button>
          </RightBox>
        ) : (
          <Link to={URL.LOGIN}>로그인</Link>
        )}
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.header`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 3em;
  background-color: ${(props) => props.theme.colors.background};
`;

const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1280px;
  padding: 1.2em;
`;

const TitleLink = styled(Link)`
  font-size: 1.5em;
  font-weight: bold;
`;

const RightBox = styled.div`
  display: flex;
  :nth-child(n) {
    margin-left: 1em;
  }
`;

const Button = styled.button`
  background: none;
  border: none;

  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export default Header;
