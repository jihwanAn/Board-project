import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { requestPost } from "../../api/fetch";
import URL from "../../constants/url";
import { getSessionItem } from "../../utils/storage";

const CreatePost = () => {
  const [inputs, setInputs] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const session = getSessionItem("token");
    if (!session) {
      alert("로그인이 필요합니다. 로그인 후 다시 이용해 주세요.");
      return;
    }

    if (inputs.title.trim() === "") {
      alert("제목을 입력해 주세요");
      return;
    }
    if (inputs.content.trim() === "") {
      alert("내용을 입력해 주세요");
      return;
    }

    try {
      requestPost(URL.POST_CREATE, { token: session, ...inputs });
      alert("게시글이 작성되었습니다.");
      navigate(URL.BOARD);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Title>게시 글 작성</Title>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="title">제목</Label>
        <Input
          type="text"
          value={inputs.title}
          onChange={(e) =>
            setInputs((state) => ({ ...state, title: e.target.value }))
          }
        />

        <Label htmlFor="content">내용</Label>
        <TextArea
          value={inputs.content}
          onChange={(e) =>
            setInputs((state) => ({ ...state, content: e.target.value }))
          }
        />
        <BtnContainer>
          <button type="submit">작성 완료</button>
        </BtnContainer>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
`;

const Title = styled.h2`
  color: #646363;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  margin-bottom: 8px;
  color: #555;
`;

const Input = styled.input`
  margin-bottom: 16px;
`;

const TextArea = styled.textarea`
  margin-bottom: 16px;
  resize: none;
  height: 300px;
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;

export default CreatePost;
