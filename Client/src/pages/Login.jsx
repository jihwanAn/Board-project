import React from "react";
import styled from "styled-components";
import GoogleLoginBtn from "../components/GoogleLoginBtn";

const Login = ({ setUser }) => {
  return (
    <Container>
      <div>로그인</div>
      <GoogleLoginBtn setUser={setUser} />
      <div>회원 가입</div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export default Login;
