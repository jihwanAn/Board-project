import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Write() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        const response = await writePost();

        if (response.status === 200) {
          const idx = response.data.idx;
          navigate(`/view?idx=${idx}`);
        } else {
          handleSessionExpired();
        }
      } catch (error) {
        handleNetworkError();
      }
    }
  };

  const validateInputs = () => {
    if (subject.trim() === "" || content.trim() === "") {
      alert("빈칸을 채워주세요.");
      return false;
    }
    return true;
  };

  const writePost = async () => {
    const writeData = {
      subject: subject,
      content: content,
    };

    return axios.post("http://localhost:8080/board", writeData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    });
  };

  const handleSessionExpired = () => {
    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
    navigate("/login");
  };

  const handleNetworkError = () => {
    console.error("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  };

  return (
    <div className="container">
      <main>
        <section className="board_write_wrap">
          <form onSubmit={handleSubmit}>
            <div>
              제목 :{" "}
              <input
                type="text"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              내용 :{" "}
              <textarea
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
            <div className="btnForm">
              <Link to="/">뒤로가기</Link>
              <button type="submit" className="btn">
                글 작성
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Write;
