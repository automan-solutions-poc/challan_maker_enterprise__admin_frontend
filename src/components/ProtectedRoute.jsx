import React from "react";
import { Navigate } from "react-router-dom";

export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    return Date.now() > exp;
  } catch (e) {
    return true;
  }
}

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("admin_token");
  const user = localStorage.getItem("admin_user");

  if (!token || !user || isTokenExpired(token)) {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    return <Navigate to="/login" replace />;
  }

  return children;
}
