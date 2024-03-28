const token = localStorage.getItem("token");

// 로그인 상태 확인
const isLoggedIn = token ? true : false;

// 로그인 상태에 따른 my page 버튼 생성
function renderLoginStatusButton() {
  if (isLoggedIn) {
    document.querySelector(".right").innerHTML = `
      <button id="writeBtn">글 작성</button>
      <button id="myPageBtn">마이페이지</button>
      <button id="logoutBtn">로그아웃</button>
    `;
  }

  const myPageBtn = document.querySelector("#myPageBtn");
  const writeBtn = document.querySelector("#writeBtn");
  const logoutBtn = document.querySelector("#logoutBtn");

  if (writeBtn) {
    writeBtn.addEventListener("click", handleWriteButtonClick);
  }
  if (myPageBtn) {
    myPageBtn.addEventListener("click", handleMyPageButtonClick);
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handlelogoutButtonClick);
  }
}

// 글 작성 버튼 클릭 시
function handleWriteButtonClick() {
  if (token) {
    fetch("http://localhost:3000/board", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // 토큰이 유효하면 글 작성 페이지로
          location.href = "./pages/write.html";
        } else {
          // 토큰이 유효하지 않으면 로그인 페이지로
          location.href = "./pages/login.html";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    // 토큰이 없으면 로그인 페이지로 이동
    location.href = "./pages/login.html";
  }
}

// My page 버튼 클릭 시
function handleMyPageButtonClick() {
  if (isLoggedIn) {
    fetch("http://localhost:3000/board", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          location.href = "./pages/myPage.html";
        } else {
          // 토큰이 만료되었거나 유효하지 않을 경우 로그인 페이지로 리다이렉트
          location.href = "./pages/login.html";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    location.href = "./pages/login.html"; // 비로그인 상태일 경우 로그인 페이지로 이동
  }
}

// 로그아웃
function handlelogoutButtonClick() {
  fetch("http://localhost:3000/user/logout", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.ok) {
        localStorage.removeItem("token");
        console.log("Logout successful");
        location.reload();
      } else {
        console.error("Logout failed");
      }
    })
    .catch((error) => {
      // 네트워크 오류 등의 예외 처리
      console.error("Network error:", error);
    });
}

// 게시글 렌더링
function renderPostList(boards) {
  const tbody = document.querySelector("#list");

  // 템플릿 함수
  const template = (idx, post) => `
    <tr>
      <td>${idx + 1}</td>
      <td class="title"><a href='./pages/view.html?id=${post._id}'>${
    post.subject
  }</a></td>
      <td>${post.writer}</td>
      <td>${formatTimestamp(post.date)}</td>
      <td>${post.views}</td>
    </tr>
  `;

  // 리스트 초기화
  tbody.innerHTML = "";

  // 리스트 생성
  for (let i = boards.length - 1; i >= 0; i--) {
    const post = boards[i];
    tbody.innerHTML += template(i, post);
    post.refresh = false;
  }
}

// 데이터 불러오기
async function fetchData() {
  try {
    const response = await fetch("http://localhost:3000/board");
    const boards = await response.json();
    renderPostList(boards);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

// 초기화 함수
function initialize() {
  fetchData();
  renderLoginStatusButton();
}

initialize();
