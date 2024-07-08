import React from "react";
import styled from "styled-components";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { requestGet } from "../api/fetch";
import URL from "../constants/url";
import CODE from "../constants/code";
import { setSessionItem } from "../utils/storage";

const GoogleLoginBtn = () => {
  const navigate = useNavigate();

  const onSuccessLogin = (res) => {
    // 회원으로 등록 되지 않은 구글 계정
    if (res.status === CODE.ACCOUNT_NOT_REGISTERD) {
      navigate(URL.REGISTER, { state: res.data });
    } else {
      console.log(res.headers);
      // 로그인 성공
      const token = res.headers["authorization"].split("Bearer ")[1];
      const userInfo = res.data.userInfo;
      setSessionItem("token", token);
      setSessionItem("user", userInfo);
      navigate(URL.MAIN);
    }
  };

  // 토큰 받아오기
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      requestGet(URL.LOGIN_GOOGLE, { tokenResponse }, onSuccessLogin, (res) => {
        console.log(res);
      });
    },
    onError: (error) => console.log("Login Failed", error),
    flow: "implicit",
  });

  return <Button onClick={googleLogin}>Google 로그인</Button>;
};
const Button = styled.button`
  margin: 1rem 0;
  border: 1px solid #ccc;
  background-color: #f8f8ff;
  padding: 0.5rem;
  border-radius: 8px;
  width: 300px;
`;

export default GoogleLoginBtn;
