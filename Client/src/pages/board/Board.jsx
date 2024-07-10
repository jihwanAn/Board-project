import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import URL from "../../constants/url";
import { requestGet } from "../../api/fetch";
import { formatDate } from "../../utils/formatDate";

const Board = () => {
  const [posts, setPosts] = useState([]);
  const [pageOptions, setPageOptions] = useState({
    page: 1,
    itemsPerPage: 5,
    totalPages: 0,
  });

  const handlePageChange = (currPage) => {
    setPageOptions((prev) => ({
      ...prev,
      page: currPage,
    }));
  };

  const fetchPosts = () => {
    requestGet(
      URL.BOARD,
      { page: pageOptions.page, itemsPerPage: pageOptions.itemsPerPage },
      (res) => {
        const { totalPages, board } = res.data;
        setPosts(board);
        setPageOptions((prev) => ({
          ...prev,
          totalPages: totalPages,
        }));
      },
      (error) => {
        console.log(error);
        alert(
          "게시글을 불러오는데 실패하였습니다. 잠시 후 다시 시도해 주세요."
        );
        navigator(URL.MAIN);
      }
    );
  };

  useEffect(() => {
    fetchPosts();
  }, [pageOptions.page]);

  return (
    <Container>
      <StyledTable>
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성자</th>
            <th>날짜</th>
            <th>조회</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post, idx) => (
              <tr key={post.id}>
                <td>0000</td>
                <TitleCell>
                  <TitleLink to={URL.POST_DETAIL} state={post}>
                    {post.title}
                  </TitleLink>
                </TitleCell>
                <td>{post.nick_name}</td>
                <td>{formatDate(post.created_at)}</td>
                <td>{post.view_count}</td>
              </tr>
            ))
          ) : (
            <NoDataMessage>
              <td colSpan="5">작성된 게시글이 없습니다.</td>
            </NoDataMessage>
          )}
        </tbody>
      </StyledTable>

      {/* 페이지네이션 */}
      <Pagination>
        {pageOptions.totalPages > 0 && (
          <PaginationList>
            {[...Array(pageOptions.totalPages)].map((_, idx) => (
              <PaginationItem
                key={idx + 1}
                onClick={() => handlePageChange(idx + 1)}
                $active={pageOptions.page === idx + 1}
              >
                {idx + 1}
              </PaginationItem>
            ))}
          </PaginationList>
        )}
      </Pagination>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background-color: #f2f2f2;
    border-bottom: 1px solid #ccc;
    padding: 5px;
    font-size: 14px;
  }

  td {
    padding: 0.5rem;
    text-align: center;
  }

  td:nth-child(2) {
    width: 60%;
  }
  td:nth-child(3) {
    width: 12%;
  }
  td:nth-child(4) {
    width: 15%;
  }
`;

const TitleCell = styled.td`
  max-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TitleLink = styled(Link)`
  display: block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;

const NoDataMessage = styled.tr`
  td {
    padding: 3rem;
    color: #868686;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const PaginationList = styled.ul`
  display: flex;
`;

const PaginationItem = styled.li`
  cursor: pointer;
  margin-right: 0.5rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.colors.primaryLight};

  background-color: ${(props) =>
    props.$active ? props.theme.colors.primaryLight : "#fff"};
  color: ${(props) =>
    props.$active ? "#fff" : props.theme.colors.primaryLight};

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
    color: #fff;
  }
`;

export default Board;
