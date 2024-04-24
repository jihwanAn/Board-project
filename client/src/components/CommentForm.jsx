import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import { StyledBtn } from "./Button";
import DateConverter from "./DateConverter";

const CommentForm = ({ board_id }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://port-0-free-board-754g42aluoci77d.sel5.cloudtype.app/comment`,
        {
          params: {
            board_id,
          },
        }
      );

      if (response.status === 200) {
        const sortedComments = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setComments(sortedComments);
      }
    } catch (error) {
      console.error(error);
    }
  }, [board_id]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleInputChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleSubmit = async () => {
    if (commentText.trim() === "") {
      alert("댓글을 작성해 주세요");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 후 댓글 작성이 가능합니다.");
      return;
    }

    try {
      const response = await axios.post(
        "https://port-0-free-board-754g42aluoci77d.sel5.cloudtype.app/comment",

        {
          board_id,
          content: commentText,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setCommentText("");
        fetchComments();
      }
    } catch (error) {
      console.error(error);
      alert("댓글 작성 오류");
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
      <CommentList>
        {comments.map((comment) => (
          <Comment key={comment._id}>
            <CommentContent>{comment.content}</CommentContent>
            <CommentInfo>
              <DateConverter dateString={comment.date} />
              <CommentAuthor>{comment.writer_id.name}</CommentAuthor>
            </CommentInfo>
          </Comment>
        ))}
      </CommentList>
    </CommentsForm>
  );
};

const CommentsForm = styled.div`
  border-bottom: 1px solid black;
  margin-top: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CommentInput = styled.textarea`
  width: 85%;
  height: 60px;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
`;

const FormButton = styled(StyledBtn)`
  margin-bottom: 20px;
`;

const CommentList = styled.div`
  width: 100%;
  background-color: #f5f4f4;
  border-top: 1px solid #cacaca;
`;

const Comment = styled.div`
  border-bottom: 1px solid #cacaca;
  padding: 0 15px;
`;

const CommentContent = styled.p``;

const CommentInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const CommentAuthor = styled.span`
  color: #333;
  font-weight: bold;
`;

export default CommentForm;
