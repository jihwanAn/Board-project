import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { StyledBtn } from "./Button";

const CommentForm = () => {
  const [commentText, setCommentText] = useState("");

  const handleInputChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmit = async () => {
    if (commentText.trim() === "") {
      alert("댓글을 작성해 주세요");
    }

    try {
      const response = await axios.post(
        "https://port-0-free-board-754g42aluoci77d.sel5.cloudtype.app/comment",
        {
          content: commentText,
        }
      );

      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CommentsForm>
      <CommentInput
        id="commentText"
        placeholder="댓글 추가"
        value={commentText}
        onChange={handleInputChange}
      />
      <FormButton onClick={handleSubmit}>등록</FormButton>
    </CommentsForm>
  );
};

const CommentsForm = styled.div`
  border-bottom: 1px solid black;
  margin-top: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 765px) {
    flex-direction: column;
  }
`;

const CommentInput = styled.textarea`
  width: 85%;
  height: 70px;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
`;

const FormButton = styled(StyledBtn)`
  margin-bottom: 20px;
`;

export default CommentForm;
