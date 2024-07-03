import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import URL from "../../constants/url";
import { requestGet } from "../../api/fetch";
import { formatDate } from "../../utils/formatDate";

const Board = () => {
  const [posts, setPosts] = useState([]);
  const [seachOptions, setSearchOptions] = useState({
    page: 0,
    totalPage: 0,
  });

  useEffect(() => {
    requestGet(URL.BOARD, { page: seachOptions.page }, (res) => {
      const board = res.data;
      setPosts(board);
    });
  }, []);

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
                  <TitleLink to={URL.POST_DETAIL} state={{ post }}>
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

export default Board;
