import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px;
`;

const RightContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Header = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleWriteButtonClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (isLoggedIn && token) {
        const response = await axios.get("http://localhost:8080/board", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          navigate("/write");
        } else {
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMyPageButtonClick = async () => {
    try {
      const token = localStorage.getItem("token");

      if (isLoggedIn && token) {
        const response = await axios.get("http://localhost:8080/board", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          navigate("/mypage");
        } else {
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogoutButtonClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.post(
          "http://localhost:8080/user/logout",
          // null,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        if (response.status === 200) {
          localStorage.removeItem("token");
          console.log("Logout successful");

          window.location.reload();
          navigate(`/`);
        } else {
          console.error("Logout failed");
        }
      }
    } catch (error) {
      // 네트워크 오류 등의 예외 처리
      console.error("Network error:", error);
    }
  };

  return (
    <HeaderWrapper>
      <a href="/">Board</a>
      <RightContainer>
        {isLoggedIn ? (
          <>
            <button onClick={handleWriteButtonClick}>글 작성</button>
            <button onClick={handleMyPageButtonClick}>마이페이지</button>
            <button onClick={handleLogoutButtonClick}>로그아웃</button>
          </>
        ) : (
          <a href="/login">로그인</a>
        )}
      </RightContainer>
    </HeaderWrapper>
  );
};

export default Header;
