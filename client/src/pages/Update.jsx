import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import styled from "styled-components";

const Update = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getPostIdFromUrl = () => {
      return new URLSearchParams(location.search).get("id");
    };

    const fetchPostData = async () => {
      try {
        const id = getPostIdFromUrl();
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/board/${id}`
        );

        if (response.status === 200) {
          const { board } = response.data;
          setSubject(board.subject);
          setContent(board.content);
        } else {
          throw new Error("Failed to fetch post data");
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPostData();
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!subject || !content) {
        throw new Error("빈칸에 내용을 입력해주세요.");
      }

      const id = new URLSearchParams(location.search).get("id");
      const postData = { subject, content };

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/board/${id}`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate(`/view?id=${id}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  };

  return (
    <Container className="container">
      <section className="board_update_wrap">
        <PostForm
          subject={subject}
          content={content}
          setSubject={setSubject}
          setContent={setContent}
          handleSubmit={handleSubmit}
          buttonText="수정 완료"
        />
      </section>
    </Container>
  );
};

const Container = styled.main`
  padding: 10px;
`;

export default Update;
