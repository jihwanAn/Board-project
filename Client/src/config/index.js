export const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : `${process.env.REACT_APP_SERVER_URL}:${process.env.PORT || 3000}`;
