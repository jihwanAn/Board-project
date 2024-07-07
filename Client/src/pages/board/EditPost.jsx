import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import URL from "../../constants/url";
import { requestPost } from "../../api/fetch";

const EditPost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(location.state);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputs.title.trim() === "") {
      alert("제목을 입력해 주세요");
      titleRef.current.focus();
      return;
    }
    if (inputs.content.trim() === "") {
      alert("내용을 입력해 주세요");
      contentRef.current.focus();
      return;
    }
    if (inputs.title.length > 70) {
      alert("제목은 70자 이내로 작성해 주세요.");
      return;
    }

    requestPost(URL.POST_EDIT, { post: inputs }, (res) => {
      if (res.status === 200) {
        alert("수정이 완료되었습니다.");
        navigate(URL.BOARD);
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

    contentRef.current.focus();
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
        <Label htmlFor="title">제목</Label>
        <Input
          type="text"
          id="title"
          name="title"
          ref={titleRef}
          value={inputs.title}
          onChange={handleChange}
        />

        <Label htmlFor="content">내용</Label>
        <TextArea
          id="content"
          name="content"
          ref={contentRef}
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
