import React from "react";
import styled from "styled-components";
import { StyledBtn } from "../components/Button";

function PostForm({
  subject,
  content,
  setSubject,
  setContent,
  handleSubmit,
  buttonText,
}) {
  return (
    <FormWrapper onSubmit={handleSubmit}>
      <div>
        제목 :
        <Input
          type="text"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>
      <div>
        내용 :
        <TextArea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></TextArea>
      </div>
      <div className="btnForm">
        <FormButton type="submit">{buttonText}</FormButton>
      </div>
    </FormWrapper>
  );
}

const FormWrapper = styled.form`
  border-bottom: 1px solid black;
`;

const Input = styled.input`
  display: block;
  box-sizing: border-box;
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
`;

const TextArea = styled.textarea`
  display: block;
  box-sizing: border-box;
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
  height: 300px;
  resize: none;
`;

const FormButton = styled(StyledBtn)`
  display: block;
  margin: 20px auto;
`;

export default PostForm;
