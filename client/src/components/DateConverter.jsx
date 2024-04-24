import React from "react";

function DateConverter({ dateString }) {
  if (!dateString) return ""; // dateString이 null이면 빈 문자열

  const formatDate = (dateString) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(5, 7);
    const day = dateString.slice(8, 10);
    const hours = dateString.slice(11, 13);
    const minutes = dateString.slice(14, 16);

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const formattedDate = formatDate(dateString);

  return <span>{formattedDate}</span>;
}

export default DateConverter;
