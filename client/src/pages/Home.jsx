import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";
import CarouselContainer from "../components/Carousel";
import DateConverter from "../components/DateConverter";
import Pagination from "../components/Pagination";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/board`
      );

      const sortedPosts = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <Container>
      <CarouselContainer />
      <StyledTable>
        <thead>
          <tr>
            <TableHeader className="hidden_on_fir">No</TableHeader>
            <TableHeader width="63%">제목</TableHeader>
            <TableHeader>작성자</TableHeader>
            <TableHeader>등록일</TableHeader>
            <TableHeader className="hidden_on_fir">조회</TableHeader>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post, index) => (
            <TableRow key={post._id}>
              <TableData className="hidden_on_fir">
                {indexOfFirstPost + index + 1}
              </TableData>
              <TableData>
                <StyledLink to={`./view?id=${post._id}`}>
                  {post.subject}
                  {post.comments.length > 0 && (
                    <CommentCount>({post.comments.length})</CommentCount>
                  )}
                </StyledLink>
              </TableData>
              <TableData>{post.writer}</TableData>
              <TableData>
                <DateConverter dateString={post.date} />
              </TableData>
              <TableData className="hidden_on_fir">{post.views}</TableData>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>

      <Pagination
        posts={posts}
        postsPerPage={postsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 10px;
    text-align: center;
  }

  th {
    background-color: #f2f2f2;
    border-bottom: 1px solid #ccc;
    padding: 5px;
    font-size: 14px;
  }

  // small : 576px 스마트폰
  // Medium : 768px 테블릿

  @media (max-width: 768px) {
    .hidden_on_fir {
      display: none;
    }
  }

  @media (max-width: 576px) {
    .hidden_on_sec {
      display: none;
    }
  }
`;

const TableHeader = styled.th`
  font-weight: bold;
  color: #333;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ccc;
`;

const TableData = styled.td`
  color: #555;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #007bff;
  transition: color 0.3s ease;
  display: flex;

  &:hover {
    color: #0056b3;
  }
`;

const CommentCount = styled.span`
  font-size: 0.9rem;
  color: #d36f11;
  margin-left: 4px;
`;

export default Home;
