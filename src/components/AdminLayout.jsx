import React, { useState } from "react";
import { Container, Nav, Button } from "react-bootstrap";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  LogOut,
  Menu,
  Sun,
  Moon,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import "./AdminLayout.css";

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin_user") || "null");

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/login");
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="admin-layout">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <Menu size={20} />
      </button>

      <aside
        className={`admin-sidebar ${isSidebarOpen ? "is-open" : ""} ${isSidebarCollapsed ? "is-collapsed" : ""}`}
      >
        <div className="d-flex flex-column h-100">
          <div className="admin-header px-4 py-4 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3 overflow-hidden">
              <div className="admin-logo d-flex align-items-center justify-content-center shadow-sm flex-shrink-0">
                <Shield size={20} />
              </div>
              <div className="overflow-hidden sidebar-text">
                <h5 className="admin-name mb-0 fw-bold">Automan</h5>
                <small className="text-muted text-uppercase tracking-wider" style={{ fontSize: '9px', fontWeight: '700' }}>Admin Panel</small>
              </div>
            </div>
            <Button
              variant="link"
              className="text-muted p-0 d-none d-md-flex align-items-center justify-content-center sidebar-collapse-toggle"
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </Button>
          </div>

          <Nav className="admin-nav flex-column">
            <Nav.Link as={NavLink} to="/admin/dashboard" className="admin-link" onClick={() => setSidebarOpen(false)}>
              <LayoutDashboard size={18} className="sidebar-icon" /><span className="sidebar-text">Dashboard</span>
            </Nav.Link>

            <div className="nav-section-title mt-3 mb-1 sidebar-text">MANAGEMENT</div>

            <Nav.Link as={NavLink} to="/admin/tenants" className="admin-link" onClick={() => setSidebarOpen(false)}>
              <Building2 size={18} className="sidebar-icon" /><span className="sidebar-text">Tenants</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/tenant-users" className="admin-link" onClick={() => setSidebarOpen(false)}>
              <Users size={18} className="sidebar-icon" /><span className="sidebar-text">Tenant Users</span>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/subscriptions" className="admin-link" onClick={() => setSidebarOpen(false)}>
              <CreditCard size={18} className="sidebar-icon" /><span className="sidebar-text">Subscriptions</span>
            </Nav.Link>
          </Nav>

          <div className="admin-footer p-3">
            <div className="mb-3 px-2">
              <div className="d-flex align-items-center gap-2 mb-3">
                 <div className="bg-primary rounded-circle flex-shrink-0" style={{ width: '8px', height: '8px' }}></div>
                 <small className="text-muted fw-semibold sidebar-text">Logged in as {admin?.full_name || 'Admin'}</small>
              </div>
              <Button
                variant="link"
                className="theme-toggle-btn w-100 d-flex align-items-center justify-content-start p-2 text-decoration-none"
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <><Moon size={18} className="sidebar-icon" /><span className="sidebar-text">Dark Mode</span></>
                ) : (
                  <><Sun size={18} className="sidebar-icon" /><span className="sidebar-text">Light Mode</span></>
                )}
              </Button>
            </div>
            <Button
              variant="outline-danger"
              className="logout-btn w-100 d-flex align-items-center justify-content-center py-2"
              onClick={logout}
              style={{ borderRadius: '12px' }}
            >
              <LogOut size={16} className="sidebar-icon" /><span className="sidebar-text">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      <main className={`admin-content ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Container fluid className="p-4">
          <Outlet />
        </Container>
      </main>
    </div>
  );
}
