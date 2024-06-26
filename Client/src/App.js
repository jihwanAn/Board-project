import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import Header from "./components/Header";
import Main from "./pages/Main";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import URL from "./constants/url";

function App() {
  const [user, setUser] = useState();

  return (
    <Container>
      <Header user={user} />
      <Contents>
        <Routes>
          <Route path={URL.MAIN} element={<Main />} />
          <Route path={URL.LOGIN} element={<Login setUser={setUser} />} />
          <Route path={URL.REGISTER} element={<Register />} />
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
  padding: 1rem;
  height: 100%;
`;

export default App;
