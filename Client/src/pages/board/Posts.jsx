import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { requestGet } from "../../api/fetch";
import { formatDate } from "../../utils/formatDate";
import CATEGORY from "../../constants/category";
import URL from "../../constants/url";
import Loading from "../../components/LoadingSpinner";

const Posts = () => {
  const columns = ["", "제목", "", "작성자", "날짜"];
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [pageOptions, setPageOptions] = useState({
    category_id: location.state || -1,
    page: 1,
    itemsPerPage: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const handlePageChange = (currPage) => {
    setPageOptions((prev) => ({
      ...prev,
      page: currPage,
    }));
  };

  const fetchPosts = () => {
    requestGet(
      URL.POSTS,
      pageOptions,
      (res) => {
        if (res.status === 200) {
          const { totalPages, posts, totalItems } = res.data;
          setPosts(posts);
          setPageOptions((prev) => ({
            ...prev,
            totalPages: totalPages,
            totalItems,
          }));
          setIsLoading(false);
        }
      },
      (error) => {
        alert(
          "게시글을 불러오는데 실패하였습니다. 잠시 후 다시 시도해 주세요."
        );
        navigate(URL.MAIN);
      }
    );
  };

  useEffect(() => {
    fetchPosts();
  }, [pageOptions.category_id, pageOptions.page]);

  return isLoading ? (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "40vh",
      }}
    >
      <Loading />
    </Container>
  ) : (
    <Container>
      <CategoryForm>
        <Select
          value={pageOptions.category_id}
          onChange={(e) => {
            setPageOptions((prev) => ({
              ...prev,
              category_id: Number(e.target.value),
            }));
          }}
        >
          <option value={-1}>All</option>
          {Object.keys(CATEGORY).map((key) => (
            <option value={key} key={CATEGORY[key].name}>
              {CATEGORY[key].name}
            </option>
          ))}
        </Select>
      </CategoryForm>
      <StyledTable>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={`col_${idx}`}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr key={`post_${post.num}`}>
                {pageOptions.category_id === -1 && post.category_id ? (
                  <td> {`[${CATEGORY[post.category_id].name}]`}</td>
                ) : (
                  <td> {post.num}</td>
                )}

                <td>
                  <TitleLink to={URL.POST_DETAIL} state={post.id}>
                    {post.title}
                  </TitleLink>
                </td>
                <td>
                  <Reaction>
                    <Views>
                      <div>👀</div>
                      <div>{post.views}</div>
                    </Views>
                    {post.comments_count > 0 && (
                      <Comments>
                        <div>💬</div>
                        <div>{post.comments_count}</div>
                      </Comments>
                    )}
                    {post.likes_count > 0 && (
                      <Like>
                        <div>♥</div>
                        <div> {post.likes_count}</div>
                      </Like>
                    )}
                  </Reaction>
                </td>

                <td>{post.nick_name}</td>
                <td>{formatDate(post.created_at)}</td>
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

const CategoryForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  padding: 0.4em 1em;
`;

const Select = styled.select`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.3em;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background-color: #f2f2f2;
    border-bottom: 1px solid #ccc;
    padding: 0.2em;
    font-size: 0.8em;
  }

  td {
    padding: 0.3em;
    text-align: center;
    border-bottom: 1px solid #ccc;
    max-width: 0;
    white-space: nowrap;
  }

  td:nth-child(1) {
    color: #aaa;
    font-size: 0.8em;
    width: 8%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  td:nth-child(2) {
    width: 50%;
  }
  td:nth-child(3) {
    width: 17%;
  }
  td:nth-child(4) {
    width: 10%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  td:nth-child(5) {
    width: 15%;
  }

  // 모바일
  @media (max-width: 500px) {
    td:nth-child(5),
    th:nth-child(5) {
      display: none;
    }
  }
`;

const TitleLink = styled(Link)`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;

const Reaction = styled.div`
  display: flex;
  justify-content: end;

  :nth-child(n) {
    display: flex;
    align-items: center;
  }
`;

const Views = styled.div``;

const Comments = styled.div`
  margin-left: 0.5em;
`;

const Like = styled.div`
  margin-left: 0.5em;

  :nth-child(1) {
    color: red;
    opacity: 0.7;
  }
`;

const NoDataMessage = styled.tr`
  td {
    padding: 3em;
    color: #868686;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1em;
`;

const PaginationList = styled.ul`
  display: flex;
`;

const PaginationItem = styled.li`
  cursor: pointer;
  margin-right: 0.5em;
  padding: 0.2em 0.5em;
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

export default Posts;
