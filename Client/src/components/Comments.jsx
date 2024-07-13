import React, { useState } from "react";
import styled from "styled-components";
import { getSessionItem } from "../utils/storage";
import { requestPost } from "../api/fetch";
import URL from "../constants/url";

const Comments = ({ postId }) => {
  const [comment, setComment] = useState("");
  const session = getSessionItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      return alert("로그인이 필요한 서비스 입니다.");
    }
    if (comment.trim().length === 0) {
      return alert("작성된 댓글이 존재하지 않습니다.");
    }

    requestPost(
      URL.COMMENTS_CREATE,
      { post_id: postId, comment },
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <textarea
          placeholder="댓글을 입력해 주세요."
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        <button type="submit">댓글 작성</button>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  border: 1px solid green;
  display: flex;
`;

const Form = styled.form`
  display: flex;
`;

export default Comments;
