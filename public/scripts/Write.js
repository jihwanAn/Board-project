document
  .querySelector("#writeForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const subject = e.target.subject.value;
    const content = e.target.content.value;

    if (subject.length === 0 || content.length === 0) {
      alert("빈칸을 채워주세요.");
      return;
    }

    const writeData = {
      subject: subject,
      content: content,
    };

    try {
      const response = await fetch("http://localhost:3000/board", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          credentials: "include", // 쿠키를 자동으로 보내도록 설정
        },
        body: JSON.stringify(writeData),
      });

      if (response.ok) {
        const responseData = await response.json();
        const idx = responseData.idx;

        location.href = `./view.html?idx=${idx}`;
      } else {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "./login.html";
      }
    } catch (error) {
      console.error(error.message);
      alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  });
