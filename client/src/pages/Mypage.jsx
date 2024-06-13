import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";
import PostActions from "../components/PostActions";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch user data");
      }

      const userData = response.data;

      setUserInfo(userData.user);
      setUserPosts(userData.user.posts);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().slice(0, 10);
  };

  return (
    <main>
      <UserInfoWrap>
        <UserInfo>
          <UserInfoItem>
            <strong>아이디:</strong> {userInfo.userId}
          </UserInfoItem>
          <UserInfoItem>
            <strong>이름:</strong> {userInfo.name}
          </UserInfoItem>
        </UserInfo>
        <UserPosts>
          <ul>
            {userPosts.map((post) => (
              <UserPost key={post._id}>
                <StyledLink to={`/view?id=${post._id}`}>
                  {post.subject}{" "}
                  {post.comments.length > 0 && (
                    <CommentCount>({post.comments.length})</CommentCount>
                  )}
                </StyledLink>
                <PostViews>조회: {post.views}</PostViews>
                <PostDate>{formatDate(post.date)}</PostDate>
              </UserPost>
            ))}
          </ul>
        </UserPosts>
      </UserInfoWrap>

      <PostActions buttonText={{ back: "목록으로" }} />
    </main>
  );
};

const UserInfoWrap = styled.section`
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const UserInfoItem = styled.p`
  flex: 1;
`;

const UserPosts = styled.div`
  margin-top: 20px;
  width: 100%;
  border: 1px solid rgb(175, 175, 175);
  border-radius: 7px;
  height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;

  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
`;

const UserPost = styled.li`
  border-bottom: 1px solid rgb(175, 175, 175);
  padding: 15px;
  display: flex;
  align-items: center;
`;

const StyledLink = styled(Link)`
  flex: 3;
  color: blue;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CommentCount = styled.span`
  font-size: 0.9rem;
  color: #d36f11;
  margin-left: 4px;
`;

const PostViews = styled.span`
  flex: 0.4;
  color: #666;
  font-size: 15px;
`;

const PostDate = styled.span`
  flex: 0.6;
  color: #666;
  margin-left: 5px;
  font-size: 15px;
`;

export default MyPage;
