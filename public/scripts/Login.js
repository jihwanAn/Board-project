const loginForm = document.querySelector("#loginForm");
const signupForm = document.querySelector("#signupForm");

// 로그인
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const userId = document.getElementById("userId_login").value;
  const password = document.getElementById("password_login").value;

  if (userId.length === 0) {
    alert("아이디를 입력해주세요.");
    return;
  }
  if (password.length === 0) {
    alert("비밀번호를 입력해주세요.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/user/login`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, password }),
      credentials: "same-origin", // 쿠키 전송을 위해 credentials 옵션 설정
    });

    if (response.ok) {
      const { accessToken } = await response.json();

      //로컬 스토리지에 토큰 저장
      localStorage.setItem("token", accessToken);
      // 리프레시 토큰 삭제
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      location.href = "../index.html";
    } else {
      const { message } = await response.json();
      console.log(message);
      alert(message);
    }
  } catch (error) {
    console.error(error);
    alert("서버 에러");
  }
});

// 회원가입
function openModal() {
  document.getElementById("myModal").style.display = "block";
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userName = document.getElementById("userName_signup").value;
  const userId = document.getElementById("userId_signup").value;
  const password = document.getElementById("password_signup").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // 유효성 검사
  if (userName.length <= 1) {
    alert("이름을 입력해주세요.");
    return;
  }
  if (userId.length < 3 || userId.length > 12) {
    alert("아이디는 3자 이상, 12자 이하로 입력해주세요.");
    return;
  }
  if (password.length < 8) {
    alert("비밀번호는 8자 이상으로 입력해주세요.");
    return;
  }
  if (password !== confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  // 회원가입 데이터를 객체로 생성
  const userData = {
    name: userName,
    userId: userId,
    password: password,
  };

  try {
    // 서버에 post 요청 보내기
    const response = await fetch(`http://localhost:3000/user/signup`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      location.href = "../index.html";
      alert(`${userName}님 회원가입을 축하드립니다!`);
    } else {
      const errorData = await response.json();
      if (errorData.error === "이미 사용 중인 아이디입니다.") {
        alert(errorData.error);
      } else {
        throw new Error(errorData.message);
      }
    }
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
});
