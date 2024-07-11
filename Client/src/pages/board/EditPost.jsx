import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import URL from "../../constants/url";
import { requestPost } from "../../api/fetch";
import CATEGORY from "../../constants/category";

const EditPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(location.state);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
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

    requestPost(URL.POST_EDIT, { post: inputs }, (res) => {
      if (res.status === 200) {
        alert("수정이 완료되었습니다.");
        navigate(URL.BOARD, { state: inputs.category });
      }
    });
  };

  const handleCancelClick = () => {
    window.history.back();
  };

  useEffect(() => {
    if (!location.state) {
      alert("비정상적인 접근입니다.");
      navigate(URL.MAIN);
      return;
    }
  }, []);

  return (
    <Container onSubmit={handleSubmit}>
      <ButtonForm>
        <button>수정 완료</button>
        <button type="button" onClick={handleCancelClick}>
          취소
        </button>
      </ButtonForm>
      <Form>
        <CategoryForm>
          <Label htmlFor="category">카테고리</Label>
          <Select
            value={inputs.category}
            onChange={(e) => {
              setInputs((prev) => ({
                ...prev,
                category: Number(e.target.value),
              }));
            }}
          >
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
      </Form>
    </Container>
  );
};

const Container = styled.form`
  display: flex;
  flex-direction: column;
`;

const ButtonForm = styled.div`
  display: flex;
  justify-content: right;
  border-bottom: 1px solid #ccc;
  padding: 1rem;
  display: flex;
  justify-content: right;

  :nth-child(n) {
    margin: 0 1rem;
    color: #6a6a6a;
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
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

export default EditPost;
