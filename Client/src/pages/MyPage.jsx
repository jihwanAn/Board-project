import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import URL from "../constants/url";
import { requestGet } from "../api/fetch";
import { formatDate } from "../utils/formatDate";

const MyPage = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikePosts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = location.state;

  const fetchUserActivity = () => {
    requestGet(
      URL.MYPAGE,
      { user_id: userInfo.user_id },
      (res) => {
        if (res.status === 200) {
          const { userLikedPosts, userPosts } = res.data;
          setMyPosts(userPosts);
          setLikePosts(userLikedPosts);
        }
      },
      (error) => {
        alert("정보를 불러오지 못했습니다. 잠시후 다시 시도해주세요.");
        navigate(URL.MAIN);
      }
    );
  };

  useEffect(() => {
    if (!userInfo) {
      alert("비정상적인 접근입니다.");
      return navigate(URL.MAIN);
    }

    fetchUserActivity();
  }, []);

  return (
    <Container>
      <UserInfoBox>
        <div>이메일 : {userInfo?.email}</div>
        <div>닉네임 : {userInfo?.nick_name}</div>
      </UserInfoBox>

      <div>작성한 게시글</div>
      <Box>
        {myPosts.length > 0 ? (
          myPosts.map((post, idx) => (
            <Post key={`post_${idx}`} to={URL.POST_DETAIL} state={post.id}>
              <div>{post.title}</div>
              <div>{formatDate(post.created_at)}</div>
            </Post>
          ))
        ) : (
          <Post>작성하신 게시글이 없습니다.</Post>
        )}
      </Box>

      <div>좋아요 누른 게시글</div>
      <Box>
        {likedPosts.length > 0 ? (
          likedPosts.map((post, idx) => (
            <Post key={`post_${idx}`} to={URL.POST_DETAIL} state={post.id}>
              <div>{post.title}</div>
              <div>{post.nick_name}</div>
            </Post>
          ))
        ) : (
          <Post>좋아요를 누른 게시글이 없습니다.</Post>
        )}
      </Box>
    </Container>
  );
};

const Container = styled.div`
  padding: 1rem;
  width: 100%;
`;

const UserInfoBox = styled.div`
  display: flex;
  margin-bottom: 1rem;

  :nth-child(n) {
    margin-right: 2rem;
  }
`;

const Box = styled.div`
  border: 1px solid #ccc;
  height: 300px;
  overflow: hidden;
  margin: 0.5rem 0 1rem 0;
  padding: 0.5rem;
`;

const Post = styled(Link)`
  display: flex;
  width: 100%;

  :nth-child(n) {
    flex: 1;
  }
`;

export default MyPage;
