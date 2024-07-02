import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import URL from "./constants/url";
import Header from "./components/Header";
import Main from "./pages/Main";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyPage from "./pages/MyPage";
import Board from "./pages/board/Board";
import CreatePost from "./pages/board/CreatePost";
import DetailPost from "./pages/board/DetailPost";

function App() {
  // 임시 로그인 상태
  // const [user, setUser] = useState(null);

  return (
    <Container>
      <Header />
      <Contents>
        <Routes>
          <Route path={URL.MAIN} element={<Main />} />
          <Route path={URL.LOGIN} element={<Login />} />
          <Route path={URL.REGISTER} element={<Register />} />
          <Route path={URL.MYPAGE} element={<MyPage />} />
          <Route path={URL.BOARD} element={<Board />} />
          <Route path={URL.POST_CREATE} element={<CreatePost />} />
          <Route path={URL.POST_DETAIL} element={<DetailPost />} />
        </Routes>
      </Contents>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
`;

const Contents = styled.main`
  height: 100%;
`;

export default App;
