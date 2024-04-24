import React from "react";

function DateConverter({ dateString }) {
  if (!dateString) return ""; // dateString이 null이면 빈 문자열

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const formattedDate = formatDate(dateString);

  return <span>{formattedDate}</span>;
}

export default DateConverter;
