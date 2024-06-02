import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { StyledBtn, TextStyledButton } from "../components/Button";

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
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/login`,
        {
          userId,
          password,
        }
      );
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
      alert(error.response.data.error);
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
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/signup`,
        {
          name: userName,
          userId,
          password,
        }
      );
      if (response.status === 200) {
        alert(`${userName}님 회원가입을 축하드립니다!`);
        navigate(`/`);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      alert(error.response.data.error);
      console.error(error);
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  // const closeModal = () => {
  //   setModalOpen(false);
  // };

  return (
    <Container>
      <LoginSection>
        <LoginForm id="loginForm" onSubmit={handleLogin}>
          <Input
            type="text"
            name="userId"
            placeholder="ID"
            value={loginData.userId}
            onChange={handleLoginChange}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
          />
          <BtnForm>
            <StyledBtn children={"로그인"} />
          </BtnForm>
        </LoginForm>

        <BtnForm>
          <TextStyledButton onClick={openModal} children={"회원가입"} />
        </BtnForm>

        {modalOpen && (
          <Modal className="modal">
            <SignupForm id="signupForm" onSubmit={handleSignup}>
              <Label htmlFor="userName_signup">이름</Label>
              <Input
                type="text"
                name="userName"
                placeholder="이름"
                value={signupData.userName}
                onChange={handleSignupChange}
                required
              />
              <Label htmlFor="userId_signup">아이디</Label>
              <Input
                type="text"
                name="userId"
                placeholder="아이디"
                value={signupData.userId}
                onChange={handleSignupChange}
                required
              />
              <Label htmlFor="password_signup">비밀번호</Label>
              <Input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={signupData.password}
                onChange={handleSignupChange}
                required
              />
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호 확인"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                required
              />
              <StyledBtn children={"가입"} />
            </SignupForm>
          </Modal>
        )}
      </LoginSection>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
`;

const LoginSection = styled.section`
  width: 100%;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const BtnForm = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: center;
`;

const Modal = styled.div`
  display: ${(props) => (props.modalOpen ? "none" : "block")};
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  color: #f5f5f7;
  z-index: 999;
  width: 550px;
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Label = styled.label`
  margin-bottom: 10px;
`;

export default Login;
