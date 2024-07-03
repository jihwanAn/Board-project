import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { requestGet } from "../../api/fetch";
import URL from "../../constants/url";
import { getSessionItem } from "../../utils/storage";

const DetailPost = () => {
  const [isAuthor, setIsAuthor] = useState(false);
  const location = useLocation();
  const currPost = location.state.post;

  // if (!currPost) {
  //   게시글에 접근할 수 없습니다.
  // }

  const session = getSessionItem("token");

  useEffect(() => {
    // 로그인 사용자인 경우에만
    if (session) {
      requestGet(URL.POST_DETAIL, { token: session, post: currPost }, (res) => {
        console.log(res);
        setIsAuthor(res.data.isAuthor);
      });
    }
  }, [session, currPost]);

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
        <BurttonForm>
          <button>수정</button>
          <button>삭제</button>
        </BurttonForm>
      )}
      <Content>{currPost.content}</Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  padding: 1rem;
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

const BurttonForm = styled.div`
  display: flex;
  justify-content: right;

  :nth-child(n) {
    margin: 0 1rem;
    color: #6a6a6a;
  }
`;

export default DetailPost;
