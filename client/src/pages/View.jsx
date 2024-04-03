import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function View() {
  const [post, setPost] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const objectId = window.location.search.split("=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/board/${objectId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true, // 쿠키를 자동으로 보내도록 설정
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
    // 수정 버튼 클릭 시 동작
    navigate(`/update?id=${objectId}`);
  };

  const handleDeleteBtnClick = async () => {
    // 삭제 버튼 클릭 시 동작
    try {
      const response = await axios.delete(
        `http://localhost:8080/board/${objectId}`
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
      <section className="board_view_wrap">
        <div id="subject">제목: {post && post.subject}</div>
        <div id="writer">작성자: {post && post.writer}</div>
        <div id="date">날짜: {post && formatTimestamp(post.date)}</div>
        <div id="content">{post && post.content}</div>
        {isOwner && (
          <div className="btnForm">
            <button onClick={handleUpdateBtnClick}>수정</button>
            <button onClick={handleDeleteBtnClick}>삭제</button>
          </div>
        )}
        <div className="btnForm">
          <Link to="/">목록으로</Link>
        </div>
      </section>
    </main>
  );
}

export default View;
