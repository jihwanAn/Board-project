import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import PostActions from "../components/PostActions";
import CommentForm from "../components/CommentForm";
import DateConverter from "../components/DateConverter";

const View = () => {
  const [post, setPost] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const objectId = window.location.search.split("=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/board/${objectId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          const { board, isOwner } = response.data;
          setPost(board);
          setIsOwner(isOwner);
        } else {
          throw new Error("Failed to fetch post data");
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPostData();
  }, [objectId]);

  const handleUpdateBtnClick = () => {
    navigate(`/update?id=${objectId}`);
  };

  const handleDeleteBtnClick = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/board/${objectId}`
      );

      if (response.status === 200) {
        navigate("/");
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <Container className="container">
      <ViewWrap>
        <ViewForm>
          <Subject>제목: {post && post.subject}</Subject>
          <InfoForm>
            <div>작성자: {post && post.writer}</div>
            <DateConverter dateString={post && post.date} />
          </InfoForm>
          <Content>{post && post.content}</Content>
          <ButtonContainer>
            {isOwner && (
              <PostActions
                buttonText={{
                  back: "목록으로",
                  modify: "수정",
                  delete: "삭제",
                }}
                handleDelete={handleDeleteBtnClick}
                handleUpdate={handleUpdateBtnClick}
              />
            )}
            {!isOwner && <PostActions buttonText={{ back: "목록으로" }} />}
          </ButtonContainer>
        </ViewForm>
      </ViewWrap>
      <CommentForm board_id={objectId} />
    </Container>
  );
};

const Container = styled.main`
  padding: 10px;
`;

const ViewWrap = styled.section`
  width: 100%;
`;

const ViewForm = styled.div`
  border-bottom: 1px solid black;
`;

const Subject = styled.div`
  font-weight: bold;
  margin-bottom: 7px;
`;

const InfoForm = styled.div`
  width: 90%;
  margin-bottom: 3px;
  display: flex;
  justify-content: space-between;
`;

const Content = styled.div`
  height: 250px;
  width: 90%;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

export default View;
