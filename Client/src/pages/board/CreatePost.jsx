import React, { useState, useEffect, useRef } from "react";
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
import CATEGORY from "../../constants/category";

const CreatePost = () => {
  const [inputs, setInputs] = useState({
    category_id: -1,
    title: "",
    content: "",
  });
  const navigate = useNavigate();
  const categoryRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputs.category_id < 0) {
      alert("카테고리를 선택해 주세요.");
      return;
    }
    if (inputs.title.trim() === "") {
      alert("제목을 입력해 주세요.");
      return;
    }
    if (inputs.content.trim() === "") {
      alert("내용을 입력해 주세요.");
      return;
    }
    if (inputs.title.length > 70) {
      alert("제목은 100자 이내로 작성해 주세요.");
      return;
    }

    const handleResponse = (res) => {
      if (res.status === 200) {
        const Authorization = res.headers.authorization;
        if (Authorization) {
          const token = Authorization.split("Bearer ")[1];
          setSessionItem("token", token);
        }
        const category_id = res.data;
        navigate(URL.POSTS, { state: category_id });
      }
    };

    await requestPost(URL.POST_CREATE, inputs, handleResponse, (error) => {
      removeSessionItem("token");
      removeSessionItem("user");

      if (error.response.status === CODE.TOKEN_EXPIRED) {
        alert("세션이 만료되었습니다. 로그인 후 다시 시도해 주세요.");
        return navigate(URL.LOGIN);
      } else {
        alert("비정상적인 요청입니다. 메인 페이지로 이동합니다.");
        return navigate(URL.MAIN);
      }
    });
  };

  useEffect(() => {
    const session = getSessionItem("token");
    if (!session) {
      alert("로그아웃 상태입니다. 로그인 페이지로 이동합니다.");
      return navigate(URL.LOGIN);
    }

    categoryRef.current.focus();
  }, []);

  return (
    <Container>
      <Title>게시 글 작성</Title>
      <Form onSubmit={handleSubmit}>
        <CategoryForm>
          <Label htmlFor="category">카테고리</Label>
          <Select
            onChange={(e) => {
              setInputs((prev) => ({
                ...prev,
                category_id: Number(e.target.value),
              }));
            }}
            ref={categoryRef}
          >
            <option value="-1">카테고리를 선택해주세요.</option>
            {Object.keys(CATEGORY).map((key) => (
              <option value={key} key={CATEGORY[key].name}>
                {CATEGORY[key].name}
              </option>
            ))}
          </Select>
        </CategoryForm>
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

const CategoryForm = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`;

const Select = styled.select`
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  padding: 0.5rem;
  margin-left: 1rem;
`;

const Label = styled.label`
  color: #555;
`;

const Input = styled.input`
  margin: 1rem 0;
`;

const TextArea = styled.textarea`
  margin: 1rem 0;
  resize: none;
  height: 300px;
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;

export default CreatePost;
