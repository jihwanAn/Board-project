const boards = JSON.parse(localStorage.getItem("boards"));
const updateForm = document.querySelector("#updateForm");
const updateFormDivs = updateForm.querySelectorAll("div");

const objectId = location.search.split("=")[1];

// 입력값 검증
const isEmpty = (value) => {
  if (value.length === 0) throw new Error("빈칸에 내용을 입력해주세요.");
};

// updateForm에 현재 포스트 값 추가
async function populateUpdateForm() {
  try {
    const response = await fetch(`http://localhost:3000/board/${objectId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }
    const postData = await response.json();
    const board = postData.board;

    updateFormDivs.forEach((element) => {
      const id = element.childNodes[1].name;
      element.children[0].value = board[id];
    });
  } catch (error) {
    console.error("Error fetching post data:", error);
  }
}

async function updateHandler(e) {
  e.preventDefault();
  const subject = e.target.subject.value;
  const content = e.target.content.value;

  try {
    isEmpty(subject);
    isEmpty(content);

    const data = {
      subject: subject,
      content: content,
    };

    const response = await fetch(`http://localhost:3000/board/${objectId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      location.href = `./view.html?id=${objectId}`;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}

populateUpdateForm();
updateForm.addEventListener("submit", updateHandler);
