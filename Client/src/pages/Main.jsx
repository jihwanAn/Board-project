import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import CATEGORY from "../constants/category";
import URL from "../constants/url";

const Main = () => {
  return (
    <Container>
      <StyledLink value={-1} to={URL.POSTS} state={-1}>
        전체
      </StyledLink>
      {Object.keys(CATEGORY).map((key) => (
        <StyledLink
          value={key}
          key={CATEGORY[key].name}
          to={URL.POSTS}
          state={Number(key)}
        >
          {CATEGORY[key].name}
        </StyledLink>
      ))}
    </Container>
  );
};

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const StyledLink = styled(Link)`
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.3rem;
`;

export default Main;
