import React from "react";
import styled from "styled-components";

const DateConverter = ({ dateString }) => {
  if (!dateString) return "-";

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return {
      fullDate: `${year}.${month}.${day} ${hours}:${minutes}`,
      timeOnly: `${hours}:${minutes}`,
    };
  };

  const { fullDate, timeOnly } = formatDate(dateString);

  return (
    <DateText>
      <span className="fullDate">{fullDate}</span>
      <span className="timeOnly">{timeOnly}</span>
    </DateText>
  );
};

const DateText = styled.span`
  .fullDate {
    display: inline;
  }
  .timeOnly {
    display: none;
  }

  @media (max-width: 576px) {
    .fullDate {
      display: none;
    }
    .timeOnly {
      display: inline;
    }
  }
`;

export default DateConverter;
