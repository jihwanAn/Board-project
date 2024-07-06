import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { requestGet } from "../../api/fetch";
import URL from "../../constants/url";
import {
  getSessionItem,
  setSessionItem,
  removeSessionItem,
} from "../../utils/storage";
import CODE from "../../constants/code";

const DetailPost = () => {
  const [isAuthor, setIsAuthor] = useState(false);
  const location = useLocation();
  const currPost = location.state.post;
  const session = getSessionItem("token");

  const handleResponse = (res) => {
    console.log(res.headers);
    const Authorization = res.headers.authorization;
    if (Authorization) {
      const token = Authorization.split("Bearer ")[1];
      setSessionItem("token", token);
    }
    setIsAuthor(res.data.isAuthor);
  };

  useEffect(() => {
    const fetchPostDetail = async () => {
      await requestGet(
        URL.POST_DETAIL,
        { post: currPost },
        handleResponse,
        (error) => {
          if (error.status === CODE.UNAUTHORIZED) {
            removeSessionItem("token");
            removeSessionItem("user");
            alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
          } else {
            console.error(error);
          }
        }
      );
    };

    if (session) {
      fetchPostDetail();
    }
  }, [currPost, session]);

  return (
    <Container>
      <Title>{currPost.title}</Title>
      <UserInfo>
        <span style={{ color: "black", fontWeight: "bold" }}>
          {currPost.nick_name}
        </span>
        <span>{formatDate(currPost.created_at)}</span>
        <span>조회: {currPost.view_count}</span>
      </UserInfo>
      {isAuthor && (
        <ButtonForm>
          <button>수정</button>
          <button>삭제</button>
        </ButtonForm>
      )}
      <Content>{currPost.content}</Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  padding: 1rem;
  color: #5f5f5f;
`;

const UserInfo = styled.span`
  display: flex;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 1rem;
  justify-content: right;
  margin-bottom: 1rem;

  :nth-child(n) {
    margin-left: 1rem;
    font-size: 15px;
    color: #6a6a6a;
  }
`;

const Content = styled.p`
  padding-left: 1rem;
`;

const ButtonForm = styled.div`
  display: flex;
  justify-content: right;

  :nth-child(n) {
    margin: 0 1rem;
    color: #6a6a6a;
  }
`;

export default DetailPost;
