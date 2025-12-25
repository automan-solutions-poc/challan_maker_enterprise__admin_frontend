import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import TenantsPage from "./pages/TenantsPage";
import TenantUsersPage from "./pages/TenantUsersPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    // ✅ BrowserRouter must wrap *everything* that uses routes
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="tenant-users" element={<TenantUsersPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
        </Route>

        {/* Default fallback route */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
