import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import TenantsPage from "./pages/TenantsPage";
import TenantUsersPage from "./pages/TenantUsersPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tenants" element={<TenantsPage />} />
        <Route path="tenant-users" element={<TenantUsersPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
      </Route>

      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}
