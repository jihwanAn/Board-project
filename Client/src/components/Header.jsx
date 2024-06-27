import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import URL from "../constants/url";

const Header = ({ setUser }) => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(false);
    alert("로그아웃 되었습니다.");
    navigate(URL.MAIN);
  };

  return (
    <Container>
      <Link to={URL.MAIN}>Title</Link>
      {userInfo ? (
        <RightBox>
          <div>
            <StyledLink to={URL.MYPAGE}>{userInfo[0].nick_name}</StyledLink>님
            환영합니다
          </div>
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

const StyledLink = styled(Link)`
  color: #7b7bf1;
  font-weight: 550;
`;

const LogoutBtn = styled.button`
  margin-left: 1.5rem;
`;

export default Header;
