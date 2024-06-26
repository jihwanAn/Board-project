import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import URL from "../constants/url";

const Header = ({ user }) => {
  // const userInfo = JSON.parse(localStorage.getItem("user"));

  // console.log(userInfo);

  return (
    <Container>
      <Link to={URL.MAIN}>Title</Link>
      {user ? <div>환영합니다.</div> : <Link to={URL.LOGIN}>로그인</Link>}
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

export default Header;
