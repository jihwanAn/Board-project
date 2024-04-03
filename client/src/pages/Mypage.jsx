import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch user data");
      }

      const userData = response.data;
      setUserInfo(userData.user);
      setUserPosts(userData.filteredPostIds);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().slice(0, 10);
  };

  return (
    <main className="container">
      <section className="user_info_wrap">
        <div className="userInfo">
          <p>
            <strong>아이디:</strong> {userInfo.userId}
          </p>
          <p>
            <strong>이름:</strong> {userInfo.name}
          </p>
        </div>
        <div className="userPosts">
          <ul>
            {userPosts.map((post) => (
              <li key={post._id}>
                <Link to={`/view?id=${post._id}`}>{post.subject}</Link>
                <span>{formatDate(post.date)}</span>
                <span> 조회: {post.views}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="btnForm">
        <Link to="/" className="btn">
          목록으로
        </Link>
      </div>
    </main>
  );
};

export default MyPage;
