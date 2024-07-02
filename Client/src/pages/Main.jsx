import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import URL from "../constants/url";

const Main = () => {
  return (
    <Container>
      <Link to={URL.BOARD}>게시판 가기</Link>
    </Container>
  );
};

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default Main;
