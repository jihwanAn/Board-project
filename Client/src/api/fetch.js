import axios from "axios";
import { SERVER_URL } from "../config";
import { getSessionItem } from "../utils/storage";

const axiosInstance = axios.create({
  baseURL: SERVER_URL,
});

const setAuthHeader = async () => {
  const token = await getSessionItem("token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export const requestGet = async (url, params, handler, errorHandler) => {
  try {
    const headers = await setAuthHeader();

    const res = await axiosInstance.get(url, {
      params,
      headers,
    });
    console.log("GET", res);

    if (handler) handler(res);
  } catch (error) {
    if (error) errorHandler(error);
  }
};

export const requestPost = async (url, data, handler, errorHandler) => {
  try {
    const headers = await setAuthHeader();

    const res = await axiosInstance.post(url, data, {
      headers,
    });
    console.log("POST", res);

    if (handler) handler(res);
  } catch (error) {
    console.error("POST Error:", error);
    if (errorHandler) errorHandler(error);
  }
};
