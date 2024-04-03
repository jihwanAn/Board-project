import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function Update() {
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
        const response = await axios.get(`http://localhost:8080/board/${id}`);

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
        `http://localhost:8080/board/${id}`,
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

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <main className="container">
      <section className="board_update_wrap">
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
            <button className="btn" type="button" onClick={handleCancel}>
              취소
            </button>
            <button className="btn" type="submit">
              수정 완료
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Update;
