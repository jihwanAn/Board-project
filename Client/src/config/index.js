export const SREVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "product_URL";
