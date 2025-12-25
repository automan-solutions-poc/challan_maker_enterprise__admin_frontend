import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("admin_token");
  const user = localStorage.getItem("admin_user");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
