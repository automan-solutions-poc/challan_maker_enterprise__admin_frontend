import axios from "axios";

const API = axios.create({
  // baseURL: "http://127.0.0.1:6001/api/admin",
  baseURL: "https://api.automan.solutions/api/admin",

});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
