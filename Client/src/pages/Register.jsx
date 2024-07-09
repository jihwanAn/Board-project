import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { requestPost, requestGet } from "../api/fetch";
import URL from "../constants/url";
import CODE from "../constants/code";

const Register = () => {
  const [inputs, setInputs] = useState({ nick_name: "" });
  const [nickNameChecked, setNickNameChecked] = useState(false);
  const inputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 닉네임 중복 검사
  const verifyNickName = (e) => {
    e.preventDefault();
    if (inputs.nick_name.trim() === "") {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (
      inputs.nick_name.length > 16 ||
      !/^[가-힣a-zA-Z0-9]*$/.test(inputs.nick_name)
    ) {
      alert("닉네임은 한글, 영문, 숫자를 포함한 16글자 이내로 입력해 주세요.");
      return;
    }

    requestGet(URL.CHECK_NICKNAME, { nick_name: inputs.nick_name }, (res) => {
      if (res.status === CODE.DUPLICATE_NICKNAME) {
        alert("이미 사용 중인 닉네임입니다.");
        return;
      } else {
        alert("사용 가능한 닉네임 입니다.");
        setNickNameChecked(true);
      }
    });
  };

  // 구글 계정으로 가입하기
  const registerAccount = (e) => {
    e.preventDefault();

    requestPost(
      URL.REGISTER,
      { userInfo: inputs },
      (res) => {
        if (res.status === 200) {
          alert(`${inputs.nick_name}님 회원 가입을 축하 드립니다.`);
          navigate(URL.MAIN);
        }
      },
      (error) => {
        console.log(error);
        alert("가입 실패하였습니다. 잠시 후 다시 시도해 주세요");
        navigate(URL.MAIN);
      }
    );
  };

  useEffect(() => {
    // 구글 로그인 실패
    if (!location.state) {
      alert("계정 정보가 존재하지 않습니다. 메인 페이지로 이동합니다.");
      navigate(URL.MAIN);
      return;
    }

    inputRef.current.focus();

    setInputs((state) => ({
      ...state,
      platform: location.state.platform,
      email: location.state.email,
    }));
  }, [location.state]);

  return (
    <Form onSubmit={registerAccount}>
      <InputBox>
        <Input
          value={inputs.nick_name}
          placeholder="사용하실 닉네임을 입력해 주세요."
          ref={inputRef}
          disabled={nickNameChecked}
          onChange={(e) =>
            setInputs((state) => ({ ...state, nick_name: e.target.value }))
          }
        />
        <button
          type="button"
          onClick={verifyNickName}
          disabled={nickNameChecked}
        >
          중복확인
        </button>
      </InputBox>
      <button type="submit" disabled={!nickNameChecked}>
        가입하기
      </button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Input = styled.input`
  width: 220px;
  padding: 0.3rem;
  border: none;
  border-bottom: 2px solid #c1c8ff;
  margin-right: 1rem;

  &:focus {
    outline: none;
    border: 2px solid #7381f2;
    border-radius: 5px;
  }
`;

const InputBox = styled.div`
  margin-bottom: 2rem;
`;

export default Register;
