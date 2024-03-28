window.onload = async () => {
  try {
    const response = await fetch("http://localhost:3000/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await response.json();
    const userPosts = userData.filteredPostIds;

    document.getElementById("userId").textContent = userData.user.userId;
    document.getElementById("userName").textContent = userData.user.name;

    const postList = document.getElementById("userPosts");

    userPosts.forEach((post) => {
      const listItem = document.createElement("li");

      // 게시물 제목
      const link = document.createElement("a");
      link.href = `./view.html?id=${post._id}`;
      link.textContent = post.subject;

      // 등록일
      const dateElement = document.createElement("span");
      const postDate = new Date(post.date);
      dateElement.textContent = `${postDate.getFullYear()}-${
        postDate.getMonth() + 1
      }-${postDate.getDate()}`;

      // 조회수
      const viewsElement = document.createElement("span");
      viewsElement.textContent = ` 조회:${post.views}`;

      listItem.appendChild(link);
      listItem.appendChild(dateElement);
      listItem.appendChild(viewsElement);

      postList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
