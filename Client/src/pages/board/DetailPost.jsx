import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { requestGet, requestPost, requestDelete } from "../../api/fetch";
import URL from "../../constants/url";
import {
  getSessionItem,
  setSessionItem,
  removeSessionItem,
} from "../../utils/storage";
import CODE from "../../constants/code";
import CATEGORY from "../../constants/category";
import Loading from "../../components/LoadingSpinner";

const DetailPost = () => {
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.state;
  const session = getSessionItem("token");
  const user = getSessionItem("user");

  const getPost = async () => {
    if (!postId) {
      alert("비정상적인 접근입니다. 메인 페이지로 돌아갑니다.");
      navigate(URL.MAIN);
      return;
    }

    requestGet(URL.POST_DETAIL, { post_id: postId }, (res) => {
      if (res.status === 200) {
        if (res.headers.authorization) {
          const token = res.headers.authorization.split("Bearer ")[1];
          setSessionItem("token", token);
        }
        setPost(res.data);
      }
    });
  };

  const handleEditClick = () => {
    if (!session) {
      return alert("로그아웃 상태입니다. 로그인 후 다시 시도해 주세요.");
    }

    navigate(URL.POST_EDIT, { state: post });
  };

  const handleDelete = () => {
    if (!session) {
      return alert("로그아웃 상태입니다. 로그인 후 다시 시도해 주세요.");
    }

    requestDelete(
      URL.POST_DELETE,
      { post_id: postId, user_id: user.user_id },
      (res) => {
        if (res.status === 200) {
          alert("게시글이 삭제되었습니다.");
          navigate(URL.POSTS);
        }
      },
      (error) => {
        removeSessionItem("token");
        removeSessionItem("user");

        if (error.response.status === CODE.TOKEN_EXPIRED) {
          return alert("세션이 만료되었습니다. 로그인 후 다시 시도해 주세요.");
        }
        return alert("작업을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      }
    );
  };

  const getComments = async () => {
    requestGet(
      URL.COMMENT,
      { post_id: postId },
      (res) => {
        if (res.status === 200) {
          setComments(res.data);
          setIsLoading(false);
        }
      },
      (error) => {
        alert("응답 오류");
        navigate(URL.MAIN);
      }
    );
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!session) {
      return alert("로그인 후 이용 가능합니다.");
    }
    if (comment.trim().length === 0) {
      return alert("댓글을 입력해 주세요.");
    }

    requestPost(
      URL.COMMENT,
      { post_id: postId, user_id: user.user_id, comment },
      (res) => {
        if (res.status === 200) {
          alert("댓글이 작성되었습니다.");
          setComment("");
          getComments();
        }
      },
      (error) => {
        removeSessionItem("token");
        removeSessionItem("user");

        if (error.response.status === CODE.TOKEN_EXPIRED) {
          return alert("세션이 만료되었습니다. 로그인 후 다시 시도해 주세요.");
        }
        return alert("작업을 완료하지 못했습니다.");
      }
    );
  };

  const handleDeleteComment = (id) => {
    if (!session) {
      return alert("로그인 후 다시 시도해 주세요.");
    }

    requestDelete(
      URL.COMMENT,
      { user_id: user.user_id, comment_id: id },
      (res) => {
        if (res.status === 200) {
          alert("댓글을 삭제했습니다.");
          getComments();
        }
      },
      (error) => {
        removeSessionItem("token");
        removeSessionItem("user");

        if (error.response.status === CODE.TOKEN_EXPIRED) {
          return alert("세션이 만료되었습니다. 로그인 후 다시 시도해 주세요.");
        }
        return alert("작업을 완료하지 못했습니다. 잠시후 다시 시도해 주세요.");
      }
    );
  };

  useEffect(() => {
    getPost();
    getComments();
  }, [postId, session]);

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
      {post ? (
        <>
          <Title>{post.title}</Title>
          <Info>
            <div>{`게시판 > ${CATEGORY[post.category_id].name}`}</div>
            <div>
              <span style={{ color: "black", fontWeight: "bold" }}>
                {post.nick_name}
              </span>
              <span>{formatDate(post.created_at)}</span>
              <span>{`조회: ${post.view_count}`}</span>
            </div>
          </Info>
          {user?.user_id === post.user_id ? (
            <ButtonForm>
              <button type="button" onClick={handleEditClick}>
                수정
              </button>
              <button type="button" onClick={handleDelete}>
                삭제
              </button>
            </ButtonForm>
          ) : null}
          <Content>{post.content}</Content>
          <CommentsForm>
            <Form className="writeComment" onSubmit={handleSubmitComment}>
              <TextArea
                value={comment}
                placeholder={`${post.nick_name}님의 게시글에 댓글 달기`}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <button type="submit">댓글 작성</button>
            </Form>
            {comments ? (
              comments.map((comment, idx) => (
                <Form className="commentItem" key={`comment_${idx}`}>
                  <div>
                    <UserInfo>
                      <div>{comment.nick_name}</div>
                      <div>{formatDate(comment.created_at)}</div>
                    </UserInfo>
                    <div>{comment.content}</div>
                  </div>
                  {user ? (
                    user.user_id === comment.user_id ? (
                      <button
                        type="button"
                        onClick={() => {
                          handleDeleteComment(comment.id);
                        }}
                      >
                        삭제
                      </button>
                    ) : null
                  ) : null}
                </Form>
              ))
            ) : (
              <Form style={{ color: "#aaaaaa" }}>작성된 댓글이 없습니다.</Form>
            )}
          </CommentsForm>
        </>
      ) : (
        <Title>해당 게시글에 접근하지 못했습니다.</Title>
      )}
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

const Info = styled.span`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  color: #6a6a6a;

  :nth-child(2) {
    font-size: 15px;

    :nth-child(n) {
      margin-left: 1rem;
    }
  }
`;

const Content = styled.p`
  padding-left: 1rem;
  height: 300px;
`;

const ButtonForm = styled.div`
  display: flex;
  justify-content: right;

  :nth-child(n) {
    margin: 0 1rem;
    color: #6a6a6a;
  }
`;

const CommentsForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 1rem;

  &.writeComment {
    border-top: 1px solid #ccc;
    padding: 1rem;
  }

  &.commentItem {
    justify-content: space-between;
  }
`;

const UserInfo = styled.div`
  display: flex;

  :nth-child(2) {
    margin-left: 1rem;
    color: #999;
  }
`;

const TextArea = styled.textarea`
  resize: none;
  flex: 1;
  margin-right: 1rem;
`;

export default DetailPost;
