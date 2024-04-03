import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginData, setLoginData] = useState({ userId: "", password: "" });
  const [signupData, setSignupData] = useState({
    userName: "",
    userId: "",
    password: "",
    confirmPassword: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { userId, password } = loginData;

    if (!userId || !password) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/user/login", {
        userId,
        password,
      });
      if (response.status === 200) {
        const { accessToken } = response.data;
        localStorage.setItem("token", accessToken);
        document.cookie =
          "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/");
        window.location.reload();
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      alert("로그인 실패: " + error.message);
      console.error(error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { userName, userId, password, confirmPassword } = signupData;

    if (!userName || !userId || !password || !confirmPassword) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/user/signup", {
        name: userName,
        userId,
        password,
      });
      if (response.status === 200) {
        alert(`${userName}님 회원가입을 축하드립니다!`);
        navigate(`/`);
      } else {
        throw new Error(response.data.error || "회원가입 실패");
      }
    } catch (error) {
      alert("회원가입 실패: " + error.message);
      console.error(error);
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <div className="container">
      <main>
        <section className="board_login_wrap">
          <form id="loginForm" onSubmit={handleLogin}>
            <input
              type="text"
              name="userId"
              placeholder="ID"
              value={loginData.userId}
              onChange={handleLoginChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
            />
            <input type="submit" value="로그인" />
          </form>

          <button id="signupBtn" onClick={openModal}>
            회원가입
          </button>

          {modalOpen && (
            <div id="myModal" className="modal">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <form id="signupForm" onSubmit={handleSignup}>
                <label htmlFor="userName_signup">이름</label>
                <input
                  type="text"
                  name="userName"
                  placeholder="이름"
                  value={signupData.userName}
                  onChange={handleSignupChange}
                  required
                />
                <label htmlFor="userId_signup">아이디</label>
                <input
                  type="text"
                  name="userId"
                  placeholder="아이디"
                  value={signupData.userId}
                  onChange={handleSignupChange}
                  required
                />
                <label htmlFor="password_signup">비밀번호</label>
                <input
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                />
                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="비밀번호 확인"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  required
                />
                <input type="submit" value="가입" />
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Login;
