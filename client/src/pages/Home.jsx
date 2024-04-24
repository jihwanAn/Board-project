import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";
import CarouselContainer from "../components/Carousel";
import DateConverter from "../components/DateConverter";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://port-0-free-board-754g42aluoci77d.sel5.cloudtype.app/board"
      );
      const sortedPosts = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Container>
      <CarouselContainer />
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>No</TableHeader>
            <TableHeader>제목</TableHeader>
            <TableHeader>작성자</TableHeader>
            <TableHeader>등록일</TableHeader>
            <TableHeader>조회</TableHeader>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <TableRow key={post._id}>
              <TableData>{index + 1}</TableData>
              <TableData>
                <StyledLink to={`./view?id=${post._id}`}>
                  {post.subject}
                </StyledLink>
              </TableData>
              <TableData>{post.writer}</TableData>
              <TableData>
                <DateConverter dateString={post.date} />
              </TableData>
              <TableData>{post.views}</TableData>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
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

  &:hover {
    color: #0056b3;
  }
`;

export default Home;
