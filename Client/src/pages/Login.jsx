import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import GoogleLoginBtn from "../components/GoogleLoginBtn";
import URL from "../constants/url";
import CODE from "../constants/code";
import { requestGet, requestPost } from "../api/fetch";
import { setSessionItem } from "../utils/storage";

const Login = () => {
  const [mode, setMode] = useState(""); // "" | "login" | "signup"
  const [inputs, setInputs] = useState({});
  const [nickNameChecked, setNickNameChecked] = useState(false);
  const emailRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const verifyNickName = (e) => {
    e.preventDefault();

    requestGet(URL.CHECK_NICKNAME, { nick_name: inputs.nick_name }, (res) => {
      if (res.status === CODE.DUPLICATE_NICKNAME) {
        return alert("이미 사용 중인 닉네임입니다.");
      } else {
        setNickNameChecked(true);
        return alert("사용 가능한 닉네임 입니다.");
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "login") {
      await requestPost(
        URL.LOGIN,
        inputs,
        (res) => {
          if (res.status === CODE.INVALID_CREDENTIALS) {
            alert("아이디 또는 비밀번호가 일치하지 않습니다.");
          } else if (res.status === CODE.ACCOUNT_NOT_REGISTERD) {
            alert("일치하는 회원 정보가 존재하지 않습니다.");
          } else if (res.status === 200) {
            const token = res.headers["authorization"].split("Bearer ")[1];
            const userInfo = res.data;
            setSessionItem("token", token);
            setSessionItem("user", userInfo);
            navigate(URL.MAIN);
          }
        },
        (error) => {
          alert("로그인 실패하였습니다. 잠시 후 다시 시도해 주세요.");
        }
      );
    }

    if (mode === "signup") {
      if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputs.email)
      )
        return alert("올바른 이메일 형식이 아닙니다.");
      if (
        !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          inputs.password
        )
      )
        return alert(
          "비밀번호는 영문, 숫자, 특수문자 포함 8자 이상이어야 합니다."
        );
      if (inputs.password !== inputs.CheckPassword)
        return alert("비밀번호가 일치하지 않습니다.");

      if (!nickNameChecked) return alert("닉네임 중복 확인을 완료해 주세요.");
      if (
        inputs.nick_name.length > 20 ||
        !/^[가-힣a-zA-Z0-9]*$/.test(inputs.nick_name)
      )
        return alert(
          "닉네임은 한글, 영문, 숫자를 포함한 20글자 이내로 입력해 주세요."
        );

      await requestPost(
        URL.SIGNUP,
        inputs,
        (res) => {
          if (res.status === CODE.DUPLICATE_EMAIL) {
            alert("이미 사용 중인 이메일입니다.");
            setInputs((prev) => ({
              ...prev,
              email: "",
            }));
            emailRef.current.focus();
            return;
          }
          if (res.status === 200) {
            alert("회원 가입이 완료되었습니다.");
            navigate(URL.MAIN);
          }
        },
        (error) => {
          alert("회원 가입 실패하였습니다. 잠시 후 다시 시도해 주세요.");
        }
      );
    }
  };

  return (
    <Container>
      {mode ? (
        <ModalForm>
          <div style={{ display: "flex", justifyContent: "right" }}>
            <button id="cancelBtn" onClick={() => setMode("")}>
              X
            </button>
          </div>

          <InputForm onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              placeholder="이메일"
              onChange={handleChange}
              ref={emailRef}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="비밀번호"
              onChange={handleChange}
              required
            />
            {mode === "signup" && (
              <>
                <Input
                  type="password"
                  name="CheckPassword"
                  placeholder="비밀번호 확인"
                  onChange={handleChange}
                  required
                />
                <Nickname>
                  <Input
                    type="text"
                    name="nick_name"
                    placeholder="닉네임"
                    onChange={handleChange}
                    disabled={nickNameChecked}
                    required
                  />
                  <Button
                    type="button"
                    onClick={verifyNickName}
                    style={{
                      fontSize: "15px",
                      width: "110px",
                      marginLeft: "0.5rem",
                    }}
                    disabled={nickNameChecked}
                  >
                    중복 확인
                  </Button>
                </Nickname>
              </>
            )}
            <Button type="submit">
              {mode === "login" ? "로그인" : "회원 가입"}
            </Button>
          </InputForm>

          <Text>
            {mode === "login" ? "계정이 없으신가요?" : "계정이 있으신가요?"}
            <ToggleButton
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "회원 가입" : "로그인"}
            </ToggleButton>
          </Text>
        </ModalForm>
      ) : (
        <ButtonContainer>
          <Button onClick={() => setMode("login")}>로그인</Button>
          <GoogleLoginBtn>Google 로그인</GoogleLoginBtn>
          <Button onClick={() => setMode("signup")}>회원 가입</Button>
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

const Nickname = styled.div`
  display: flex;
  width: 100%;
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

export default Login;
