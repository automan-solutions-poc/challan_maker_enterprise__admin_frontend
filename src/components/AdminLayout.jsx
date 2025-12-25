import React from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin_user") || "null");

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/login");
  };

  return (
    <Container fluid className="vh-100 bg-light">
      <Row className="h-100">
        {/* Sidebar */}
        <Col md={2} className="bg-dark text-white p-0 d-flex flex-column">
          <div className="p-3 border-bottom text-center fw-bold fs-5">
            {admin?.full_name || "Admin Panel"}
          </div>

          <Nav className="flex-column flex-grow-1 p-2">
            <Nav.Link as={NavLink} to="/admin/dashboard" className="text-white">
              📊 Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/tenants" className="text-white">
              🏢 Tenants
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/tenant-users" className="text-white">
              👥 Tenant Users
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin/subscriptions" className="text-white">
              💳 Subscriptions
            </Nav.Link>
          </Nav>

          <div className="p-3 border-top">
            <Button variant="danger" className="w-100" onClick={logout}>
              Logout
            </Button>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4 overflow-auto">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
