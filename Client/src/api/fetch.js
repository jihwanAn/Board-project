import axios from "axios";
import { SREVER_URL } from "../config";

export const requestGet = async (url, params, handler, errorHandler) => {
  try {
    const res = await axios({
      url: `${SREVER_URL}${url}`,
      method: "get",
      params,
    });
    console.log("GET", res);

    if (handler) handler(res);
  } catch (error) {
    if (error) errorHandler(error);
  }
};

export const requestPost = async (url, data, handler, errorHandler) => {
  try {
    const res = await axios({
      url: `${SREVER_URL}${url}`,
      method: "post",
      data,
    });
    console.log("Post", res);

    if (handler) handler(res);
  } catch (error) {
    if (error) errorHandler(error);
  }
};
