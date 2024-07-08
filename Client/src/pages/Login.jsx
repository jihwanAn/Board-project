import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import GoogleLoginBtn from "../components/GoogleLoginBtn";
import { requestPost } from "../api/fetch";
import URL from "../constants/url";

const LoginSignupModal = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [inputs, setInputs] = useState({});
  const navigete = useNavigate();

  const handleCange = (e) => {
    const { name, value } = e.target;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    if (openLogin) {
      await requestPost(
        URL.LOGIN,
        { userInfo: inputs },
        (res) => {
          if (res.status === 200) {
            navigete(URL.MAIN);
          }
        },
        (error) => {
          console.log(error);
          alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
      );
    }

    if (openSignup) {
      await requestPost(
        URL.SIGNUP,
        { userInfo: inputs },
        (res) => {
          if (res.status === 200) {
            navigete(URL.MAIN);
          }
        },
        (error) => {
          console.log(error);
          alert("비정상적인 요청입니다.");
        }
      );
    }
  };

  return (
    <Container>
      {openLogin || openSignup ? (
        <ModalForm>
          <div style={{ display: "flex", justifyContent: "right" }}>
            <button
              id="cancelBtn"
              onClick={() => {
                setOpenLogin(false);
                setOpenSignup(false);
              }}
            >
              X
            </button>
          </div>

          {openLogin ? (
            <InputForm onSubmit={onSubmit}>
              <Input
                type="email"
                name="email"
                placeholder="이메일"
                onChange={handleCange}
                required
              />
              <Input
                type="password"
                name="password"
                placeholder="비밀번호"
                onChange={handleCange}
                required
              />
              <Button type="submit">로그인</Button>
            </InputForm>
          ) : (
            <InputForm onSubmit={onSubmit}>
              <Input
                type="email"
                name="email"
                placeholder="이메일"
                onChange={handleCange}
                required
              />
              <Input
                type="password"
                name="password"
                placeholder="비밀번호"
                onChange={handleCange}
                required
              />
              <Input type="password" placeholder="비밀번호 확인" />
              <Input
                type="text"
                name="nick_name"
                placeholder="닉네임"
                onChange={handleCange}
                required
              />
              <Button type="submit">회원 가입</Button>
            </InputForm>
          )}

          {openLogin ? (
            <Text>
              계정이 없으신가요?
              <ToggleButton
                onClick={() => {
                  setOpenLogin(false);
                  setOpenSignup(true);
                }}
              >
                회원 가입
              </ToggleButton>
            </Text>
          ) : (
            <Text>
              계정이 없으신가요?
              <ToggleButton
                onClick={() => {
                  setOpenLogin(true);
                  setOpenSignup(false);
                }}
              >
                로그인
              </ToggleButton>
            </Text>
          )}
        </ModalForm>
      ) : (
        <ButtonContainer>
          <Button
            onClick={() => {
              setOpenLogin(true);
            }}
          >
            로그인
          </Button>
          <GoogleLoginBtn>Google 로그인</GoogleLoginBtn>
          <Button
            onClick={() => {
              setOpenSignup(true);
            }}
          >
            회원 가입
          </Button>
        </ButtonContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #d1d1d1;
  border-radius: 8px;
  width: 400px;
  padding: 1rem;
`;

const Button = styled.button`
  border: 1px solid #ccc;
  background-color: #f8f8ff;
  padding: 0.5rem;
  border-radius: 8px;
  width: 300px;
  margin: 0.5rem 0;
`;

const ModalForm = styled.div`
  border: 1px solid #d1d1d1;
  border-radius: 8px;
  width: 400px;
  padding: 1rem;
`;

const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Text = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: blue;
  margin-left: 0.5rem;
  cursor: pointer;
  text-decoration: underline;
`;

export default LoginSignupModal;
