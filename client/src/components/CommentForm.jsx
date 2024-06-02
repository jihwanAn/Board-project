import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import { StyledBtn } from "./Button";
import DateConverter from "./DateConverter";

const CommentForm = ({ board_id }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [childComment, setChildComment] = useState({});

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/comment`,
        {
          params: { board_id },
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
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 후 댓글 작성이 가능합니다.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/comment`,
        {
          board_id,
          content: commentText,
          replyTo: replyTo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setCommentText("");
        setReplyTo(null);
        fetchComments();
      }
    } catch (error) {
      console.error(error);
      alert("댓글 작성 오류");
    }
  };

  const handleEditComment = async (commentId, editedContent) => {
    if (editedContent.trim() === "") {
      alert("댓글을 작성해 주세요");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인 후 댓글 수정이 가능합니다.");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/comment/${commentId}`,
        { content: editedContent },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        fetchComments();
      }
    } catch (error) {
      console.error(error);
      alert("댓글 수정 오류");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("로그인 후 댓글 삭제가 가능합니다.");
        return;
      }

      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/comment/${commentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          fetchComments();
        }
      } catch (error) {
        console.error(error);
        alert("댓글 삭제 오류");
      }
    }
  };

  const handleReplyComment = (parentId) => {
    setReplyTo(parentId);
  };

  const handleSubmitReply = async () => {
    if (replyText.trim() === "") {
      alert("답글을 작성해 주세요");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 후 답글 작성이 가능합니다.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/comment/${replyTo}/reply`,
        {
          board_id,
          content: replyText,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setReplyTo(null);
        setReplyText("");
        fetchComments();
      }
    } catch (error) {
      console.error(error);
      alert("답글 작성 오류");
    }
  };

  const handleViewReplies = (commentId) => {
    setChildComment((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const currentUser = localStorage.getItem("token");

  const hasChildComments = (commentId) => {
    return comments.some((c) => c.parent_comment === commentId);
  };

  const renderComment = (comment) => (
    <Comment key={comment._id}>
      {currentUser && (
        <ButtonContainer>
          <ActionButton
            onClick={() =>
              handleEditComment(
                comment._id,
                prompt("댓글을 수정하세요", comment.content)
              )
            }
          >
            수정
          </ActionButton>
          <ActionButton onClick={() => handleDeleteComment(comment._id)}>
            삭제
          </ActionButton>
          <ActionButton onClick={() => handleReplyComment(comment._id)}>
            답글
          </ActionButton>
        </ButtonContainer>
      )}
      <CommentContent>{comment.content}</CommentContent>
      <CommentInfo>
        <DateConverter dateString={comment.date} />
        <CommentAuthor>{comment.writer_id.name}</CommentAuthor>
      </CommentInfo>

      {replyTo === comment._id && (
        <ReplyForm>
          <CommentInput
            id="replyText"
            placeholder="답글 추가"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <StyledBtn onClick={handleSubmitReply}>등록</StyledBtn>
        </ReplyForm>
      )}

      {hasChildComments(comment._id) && (
        <ViewMoreButton onClick={() => handleViewReplies(comment._id)}>
          {childComment[comment._id] ? "답글 숨기기" : "답글 보기"}
        </ViewMoreButton>
      )}

      {childComment[comment._id] && renderReplies(comment._id)}
    </Comment>
  );

  const renderReplies = (parentId) =>
    comments
      .filter((reply) => reply.parent_comment === parentId)
      .map((reply) => (
        <ReplyComment key={reply._id}>{renderComment(reply)}</ReplyComment>
      ));

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
        {comments
          .filter((comment) => !comment.parent_comment)
          .map((comment) => renderComment(comment))}
      </CommentList>
    </CommentsForm>
  );
};

const CommentsForm = styled.div`
  border-bottom: 1px solid black;
  margin-top: 20px;
  padding: 20px 20px 0 20px;
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
  background-color: #f7f7f7;
  border-top: 1px solid #cacaca;
  padding: 0 15px;
`;

const Comment = styled.div``;

const CommentContent = styled.p`
  margin: 0 0 10px 0;
`;

const CommentInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const CommentAuthor = styled.span`
  color: #333;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 5px;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin: 2px;
  color: #3f3fd6;
`;

const ReplyForm = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ViewMoreButton = styled.button`
  background-color: transparent;
  border: none;
  color: #3f3fd6;
  cursor: pointer;
  margin: 10px 0;
`;

const ReplyComment = styled.div`
  margin-left: 20px;
  padding-left: 10px;
  margin-bottom: 10px;
`;

export default CommentForm;
