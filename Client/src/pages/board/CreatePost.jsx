import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { requestPost } from "../../api/fetch";
import URL from "../../constants/url";
import CODE from "../../constants/code";
import {
  getSessionItem,
  setSessionItem,
  removeSessionItem,
} from "../../utils/storage";

const CreatePost = () => {
  const [inputs, setInputs] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputs.title.trim() === "") {
      alert("제목을 입력해 주세요");
      return;
    }
    if (inputs.content.trim() === "") {
      alert("내용을 입력해 주세요");
      return;
    }
    if (inputs.title.length > 70) {
      alert("제목은 70자 이내로 작성해 주세요.");
      return;
    }

    try {
      const session = getSessionItem("token");
      if (!session) {
        alert("로그인이 필요합니다. 로그인 후 다시 이용해 주세요.");
        return;
      }

      const handleResponse = (res) => {
        if (res.status === 200) {
          const Authorization = res.headers.authorization;
          if (Authorization) {
            const token = Authorization.split("Bearer ")[1];
            setSessionItem("token", token);
          }
          alert("게시글이 작성되었습니다.");
          navigate(URL.BOARD);
        }
      };

      await requestPost(
        URL.POST_CREATE,
        { ...inputs },
        handleResponse,
        (error) => {
          if (error.response.status === CODE.UNAUTHORIZED) {
            removeSessionItem("token");
            removeSessionItem("user");
            alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
            return;
          } else {
            console.error(error);
            alert("게시글 작성에 실패했습니다. 다시 시도해 주세요.");
          }
        }
      );
    } catch (error) {
      console.error(error);
      alert("게시글 작성에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <Container>
      <Title>게시 글 작성</Title>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="title">제목</Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={inputs.title}
          onChange={handleChange}
        />

        <Label htmlFor="content">내용</Label>
        <TextArea
          id="content"
          name="content"
          value={inputs.content}
          onChange={handleChange}
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
