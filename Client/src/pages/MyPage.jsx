import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import URL from "../constants/url";
import CODE from "../constants/code";
import { requestGet, requestPost } from "../api/fetch";
import { formatDate } from "../utils/formatDate";
import { getSessionItem, setSessionItem } from "../utils/storage";
import Loading from "../components/LoadingSpinner";

const MyPage = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [likedPosts, setLikePosts] = useState([]);
  const [isNicknameChanging, setIsNicknameChanging] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = location.state;
  const user = getSessionItem("user");
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserActivity = () => {
    requestGet(
      URL.MYPAGE,
      { user_id: userInfo.user_id },
      (res) => {
        if (res.status === 200) {
          const { userLikedPosts, userPosts } = res.data;
          setMyPosts(userPosts);
          setLikePosts(userLikedPosts);
          setIsLoading(false);
        }
      },
      (error) => {
        alert("정보를 불러오지 못했습니다. 잠시후 다시 시도해주세요.");
        navigate(URL.MAIN);
      }
    );
  };

  const updateUserNickName = (nickName) => {
    if (user) {
      user.nick_name = nickName;
      setSessionItem("user", user);
    } else {
      alert("재로그인이 필요합니다.");
      navigate(URL.MAIN);
    }
  };

  const requestNickChange = () => {
    if (nicknameInput.trim() === "") {
      return alert("변경하실 닉네임을 입력해주세요.");
    }

    // 중복 체크
    requestGet(
      URL.CHECK_NICKNAME,
      { nick_name: nicknameInput },
      (res) => {
        if (res.status === CODE.DUPLICATE_NICKNAME) {
          return alert("사용하실 수 없는 닉네임입니다.");
        }

        // 닉네임 변경 요청
        requestPost(
          URL.CHANGE_NICKNAME,
          { nick_name: nicknameInput },
          (res) => {
            if (res.status === 200) {
              alert("닉네임이 정상적으로 변경되었습니다.");
              updateUserNickName(nicknameInput);
              setIsNicknameChanging(false);
            }
          },
          (error) => {
            if (error.response.status === CODE.TOKEN_EXPIRED) {
              return alert(
                "세션이 만료되었습니다. 재 로그인 후 다시 시도해 주세요."
              );
            } else {
              alert("작업을 완료할 수 없습니다. 잠시 후 다시 시도해 주세요.");
              return navigate(URL.MAIN);
            }
          }
        );
      },
      (error) => {
        alert("작업을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return setNicknameInput(false);
      }
    );
  };

  const handleNickNameChange = () => {
    setIsNicknameChanging(!isNicknameChanging);
  };

  useEffect(() => {
    if (!userInfo) {
      alert("비정상적인 접근입니다.");
      return navigate(URL.MAIN);
    }

    fetchUserActivity();
  }, []);

  return isLoading ? (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "40vh",
      }}
    >
      <Loading />
    </Container>
  ) : (
    <Container>
      <UserInfoBox>
        <Wrap>이메일 : {userInfo?.email}</Wrap>
        <Wrap>닉네임 : {user?.nick_name}</Wrap>
        {!isNicknameChanging ? (
          <button onClick={handleNickNameChange}>닉네임 변경</button>
        ) : (
          <Wrap>
            <Input
              onChange={(e) => {
                setNicknameInput(e.target.value);
              }}
            />
            <Button onClick={requestNickChange}>변경</Button>
            <button onClick={handleNickNameChange}>취소</button>
          </Wrap>
        )}
      </UserInfoBox>

      <Label>작성한 게시글</Label>
      <Box>
        {myPosts.length > 0 ? (
          myPosts.map((post, idx) => (
            <Post key={`post_${idx}`} to={URL.POST_DETAIL} state={post.id}>
              <Title>{post.title}</Title>
              <div>{formatDate(post.created_at)}</div>
            </Post>
          ))
        ) : (
          <Empty>작성하신 게시글이 없습니다.</Empty>
        )}
      </Box>

      <Label>좋아요 누른 게시글</Label>
      <Box>
        {likedPosts.length > 0 ? (
          likedPosts.map((post, idx) => (
            <Post key={`post_${idx}`} to={URL.POST_DETAIL} state={post.id}>
              <Title>{post.title}</Title>
              <div> 작성자 : {post.nick_name}</div>
            </Post>
          ))
        ) : (
          <Empty>좋아요를 누른 게시글이 없습니다.</Empty>
        )}
      </Box>
    </Container>
  );
};

const Container = styled.div`
  padding: 1em;
  width: 100%;
`;

const UserInfoBox = styled.div`
  display: flex;
  margin-bottom: 1em;

  // 모바일
  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const Wrap = styled.div`
  margin-right: 1em;
`;

const Input = styled.input`
  padding: 0;

  &:focus {
    outline: none;
    border: 2px solid #8f9cff;
  }
`;

const Button = styled.button`
  margin: 0 0.5em;
`;

const Box = styled.div`
  border: 1px solid #ccc;
  height: 20em;
  overflow: hidden;
  border-radius: 3px;
  margin: 0.5em 0 1em 0;
`;

const Post = styled(Link)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0.2em;
  padding-right: 2em;
  border-bottom: 1px solid #ddd;
`;

const Title = styled.div`
  max-width: 70%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Label = styled.div`
  font-weight: bold;
  color: ${(props) => props.theme.colors.primaryDark};
`;

const Empty = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5em;
  color: #aaa;
`;

export default MyPage;
