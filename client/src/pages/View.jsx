import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import PostActions from "../components/PostActions";

function View() {
  const [post, setPost] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const objectId = window.location.search.split("=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `https://port-0-free-board-754g42aluoci77d.sel5.cloudtype.app/board/${objectId}`,
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
        `https://port-0-free-board-754g42aluoci77d.sel5.cloudtype.app/board/${objectId}`
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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  return (
    <main className="container">
      <ViewWrap>
        <ViewForm>
          <Subject>제목: {post && post.subject}</Subject>
          <Writer>작성자: {post && post.writer}</Writer>
          <div id="date">날짜: {post && formatTimestamp(post.date)}</div>
          <Content>{post && post.content}</Content>
          <ButtonContainer>
            {" "}
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
    </main>
  );
}

const ViewWrap = styled.section`
  width: 100%;
  border-top: 1px solid black;
`;

const ViewForm = styled.div`
  border-bottom: 1px solid black;
  margin: 12px 0;
`;

const Subject = styled.div`
  width: 100%;
  font-weight: bold;
  margin-bottom: 3px;
`;

const Writer = styled.div`
  width: 100%;
  margin-bottom: 3px;
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
