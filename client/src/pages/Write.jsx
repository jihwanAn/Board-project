import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PostForm from "../components/PostForm";

function Write() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (subject.trim() === "" || content.trim() === "") {
      alert("빈칸을 채워주세요.");
      return;
    }

    try {
      const writeData = {
        subject: subject,
        content: content,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/board`,
        writeData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const idx = response.data.idx;
        navigate(`/view?idx=${idx}`);
      } else {
        alert("Failed to write post.");
      }
    } catch (error) {
      console.error("Error writing post:", error);
    }
  };

  return (
    <main className="container">
      <section className="board_write_wrap">
        <PostForm
          subject={subject}
          content={content}
          setSubject={setSubject}
          setContent={setContent}
          handleSubmit={handleSubmit}
          buttonText="작성 완료"
        />
      </section>
    </main>
  );
}

export default Write;
