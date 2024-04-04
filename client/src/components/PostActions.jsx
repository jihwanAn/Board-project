import React from "react";
import { useNavigate } from "react-router-dom";
import { StyledBtn } from "../components/button";
import styled from "styled-components";

function PostActions({ buttonText, handleUpdate, handleDelete, handleLogin }) {
  const navigate = useNavigate();

  return (
    <ButtonContainer>
      <ButtonWrapper>
        {buttonText.back && (
          <StyledBtn onClick={() => navigate("/")} className="btn">
            {buttonText.back}
          </StyledBtn>
        )}
      </ButtonWrapper>
      <ButtonWrapper>
        {handleUpdate && (
          <StyledBtn onClick={handleUpdate}>{buttonText.modify}</StyledBtn>
        )}
      </ButtonWrapper>
      <ButtonWrapper>
        {handleDelete && (
          <StyledBtn onClick={handleDelete}>{buttonText.delete}</StyledBtn>
        )}
      </ButtonWrapper>
    </ButtonContainer>
  );
}

const ButtonWrapper = styled.div`
  margin: 0 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

export default PostActions;
