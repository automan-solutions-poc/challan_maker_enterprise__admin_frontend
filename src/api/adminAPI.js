import axios from "axios";
import { trackApiError } from "../analytics";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    trackApiError(error, { surface: "admin_api" });
    return Promise.reject(error);
  }
);

export default API;
