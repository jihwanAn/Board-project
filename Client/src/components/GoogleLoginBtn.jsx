import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { requestGet } from "../api/fetch";
import URL from "../constants/url";
import CODE from "../constants/code";

const GoogleLoginBtn = ({ setUser }) => {
  const navigate = useNavigate();

  const onSuccessLogin = (res) => {
    const user = res.data;

    // 회원으로 등록 되지 않은 구글 계정
    if (res.status === CODE.ACCOUNT_NOT_REGISTERD) {
      navigate(URL.REGISTER, { state: user });
    } else {
      // 회원으로 등록 된 구글 계정
      localStorage.setItem("user", JSON.stringify(user));
      navigate(URL.MAIN);
    }
  };

  // 토큰 받아오기
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      requestGet(URL.LOGIN_GOOGLE, { tokenResponse }, onSuccessLogin);
      setUser(true);
    },
    onError: (error) => console.log("Login Failed", error),
    flow: "implicit",
  });

  return (
    <div>
      <div onClick={googleLogin}>Google 로그인</div>
    </div>
  );
};

export default GoogleLoginBtn;
