const objectId = window.location.search.split("=")[1];

async function displayPostData() {
  try {
    const response = await fetch(`http://localhost:3000/board/${objectId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        credentials: "include", // 쿠키를 자동으로 보내도록 설정
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
    const responseData = await response.json();
    const { board, isOwner } = responseData;

    document.querySelectorAll("#viewForm > div").forEach((element) => {
      const id = element.id;

      // 날짜 변환
      if (id === "date") {
        element.innerHTML += " " + formatTimestamp(board[id]);
      } else {
        element.innerHTML += " " + board[id];
      }
    });

    // isOwner 값에 따라 수정/삭제 버튼 렌더링
    if (isOwner) {
      const btnForm = document.querySelector(".btnForm");

      const updateBtn = document.createElement("button");
      updateBtn.id = "updateBtn";
      updateBtn.className = "btn btn-primary btn-animated";
      updateBtn.textContent = "수정";
      const deleteBtn = document.createElement("button");
      deleteBtn.id = "deleteBtn";
      deleteBtn.className = "btn btn-primary btn-animated";
      deleteBtn.textContent = "삭제";

      btnForm.appendChild(updateBtn);
      btnForm.appendChild(deleteBtn);
      updateBtn.addEventListener("click", handleUpdateBtnClick);
      deleteBtn.addEventListener("click", handleDeleteBtnClick);
    }
  } catch (error) {
    console.error("Error fetching post data:", error);
  }
}

// 수정 버튼 클릭 시
async function handleUpdateBtnClick() {
  location.href = `./update.html?id=${objectId}`;
}

// 삭제 버튼 클릭 시
async function handleDeleteBtnClick() {
  try {
    const response = await fetch(`http://localhost:3000/board/${objectId}`, {
      method: "delete",
    });
    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
    location.href = "../index.html";
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}

// 날짜 포멧 변환
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
};

displayPostData();
