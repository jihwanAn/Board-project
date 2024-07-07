import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { requestGet, requestDelete } from "../../api/fetch";
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
  const navigate = useNavigate();
  const currPost = location.state;
  const postId = currPost.id;
  const session = getSessionItem("token");

  const handleEditClick = () => {
    navigate(URL.POST_EDIT, { state: currPost });
  };

  const handleDelete = () => {
    requestDelete(
      URL.POST_DELETE,
      { postId },
      (res) => {
        if (res.status === 200) {
          alert("게시글이 삭제되었습니다.");
          navigate(URL.BOARD);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const handleResponse = (res) => {
    if (res.headers.authorization) {
      const token = res.headers.authorization.split("Bearer ")[1];
      setSessionItem("token", token);
    }
    setIsAuthor(res.data.isAuthor);
  };

  const getPost = async () => {
    if (!currPost) {
      alert("비정상적인 접근입니다.");
      navigate(URL.MAIN);
      return;
    }

    await requestGet(URL.POST_DETAIL, { postId }, handleResponse, (error) => {
      if (error.status === CODE.UNAUTHORIZED) {
        removeSessionItem("token");
        removeSessionItem("user");
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
      } else {
        console.error(error);
      }
    });
  };

  useEffect(() => {
    if (session) {
      getPost();
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
          <button type="button" onClick={handleEditClick}>
            수정
          </button>
          <button type="button" onClick={handleDelete}>
            삭제
          </button>
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
