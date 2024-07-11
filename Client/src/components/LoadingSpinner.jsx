import React from "react";
import styled from "styled-components";

const Loading = () => {
  return <Spinner />;
};

const Spinner = styled.div`
  border: 5px solid rgba(0, 0, 0, 0.1);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border-left-color: #67c2ff;
  animation: spin 0.8s ease infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default Loading;
