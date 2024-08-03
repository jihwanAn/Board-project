export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const mon = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  const datePart = `${year}.${mon}.${day}`;
  const timePart = `${hours}:${min}`;

  // 날짜 체크
  const now = new Date();
  const nowY = now.getFullYear();
  const nowM = String(now.getMonth() + 1).padStart(2, "0");
  const nowD = String(now.getDate()).padStart(2, "0");
  const nowDatePart = `${nowY}.${nowM}.${nowD}`;

  const isToday = nowDatePart === datePart;

  if (isToday) {
    return timePart;
  } else {
    return `${datePart} ${timePart}`;
  }
};
