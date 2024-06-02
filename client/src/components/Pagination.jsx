import React from "react";
import styled, { keyframes } from "styled-components";

const Pagination = ({ posts, postsPerPage, currentPage, setCurrentPage }) => {
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const maxPageButtons = 10;

  const currentGroup = Math.ceil(currentPage / maxPageButtons);
  const startPage = (currentGroup - 1) * maxPageButtons + 1;
  const endPage = Math.min(currentGroup * maxPageButtons, totalPages);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const goToNextGroup = () => {
    if (endPage < totalPages) {
      setCurrentPage(endPage + 1);
    }
  };

  const goToPrevGroup = () => {
    if (startPage > 1) {
      setCurrentPage(startPage - 1);
    }
  };

  return (
    <Container>
      {startPage > 1 && (
        <PageNumber onClick={() => goToPage(1)}>처음</PageNumber>
      )}
      {startPage > 1 && <PageNumber onClick={goToPrevGroup}>이전</PageNumber>}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
        <PageNumber
          key={startPage + i}
          onClick={() => goToPage(startPage + i)}
          active={currentPage === startPage + i ? "true" : "false"}
        >
          {startPage + i}
        </PageNumber>
      ))}
      {endPage < totalPages && (
        <PageNumber onClick={goToNextGroup}>다음</PageNumber>
      )}
      {endPage < totalPages && (
        <PageNumber onClick={() => goToPage(totalPages)}>마지막</PageNumber>
      )}
    </Container>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
`;

const PageNumber = styled.button`
  display: flex;
  align-items: center;
  border: none;
  border-radius: 2px;
  background: ${(props) => (props.active ? "#76ace6" : "none")};
  color: ${(props) => (props.active ? "#fff" : "#76ace6")};
  margin: 0 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  animation: ${fadeIn} 0.3s ease-in-out;

  &:hover {
    background-color: #c2dcfa;
    color: #fff;
  }

  &:focus {
    outline: none;
  }
`;

export default Pagination;
