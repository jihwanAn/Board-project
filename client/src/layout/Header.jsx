import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { TextStyledButton } from "../components/button";

const Header = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState(location.pathname);

  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location]);

  const handleWriteButtonClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (isLoggedIn && token) {
        const response = await axios.get(
          "https://port-0-free-board-754g42aluoci77d.sel5.cloudtype.app/board",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
        const response = await axios.get(
          "https://port-0-free-board-754g42aluoci77d.sel5.cloudtype.app/board",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
          "https://port-0-free-board-754g42aluoci77d.sel5.cloudtype.app/user/logout",
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
      console.error("Network error:", error);
    }
  };

  const initialBtnHandler = (text) => {
    text === "Board" ? navigate("/") : navigate("/login");
  };

  return (
    <HeaderWrapper>
      <TextStyledButton
        children="Board"
        onClick={() => initialBtnHandler("Board")}
        size="26px"
      />
      <RightContainer>
        {isLoggedIn && currentRoute === "/" ? (
          <>
            <TextStyledButton
              children="글 작성"
              onClick={handleWriteButtonClick}
            />
            <TextStyledButton
              children="마이페이지"
              onClick={handleMyPageButtonClick}
            />
            <TextStyledButton
              children="로그아웃"
              onClick={handleLogoutButtonClick}
            />
          </>
        ) : currentRoute === "/" ? (
          <TextStyledButton
            children="로그인"
            onClick={() => initialBtnHandler("Login")}
          />
        ) : (
          ""
        )}
      </RightContainer>
    </HeaderWrapper>
  );
};

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

export default Header;
