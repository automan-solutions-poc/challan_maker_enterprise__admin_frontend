import React, { useEffect, useState } from "react";
import API from "../api/adminAPI";
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";

export default function TenantUsersPage() {
  const [tenantId, setTenantId] = useState("");
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "tenant_staff" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Fetch tenant users
  const fetchUsers = async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const res = await API.get(`/tenant_users/${tenantId}`);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load tenant users");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/tenant_users/${tenantId}`, form);
      setMsg(res.data.message);
      setShowModal(false);
      setForm({ name: "", email: "", password: "", role: "tenant_staff" });
      fetchUsers();
    } catch (err) {
      setMsg(err.response?.data?.error || "Failed to create user");
    }
  };

  return (
    <div>
      <h4>👥 Tenant Users</h4>
      {msg && <Alert variant="info">{msg}</Alert>}

      <div className="d-flex mb-3">
        <Form.Control
          placeholder="Enter Tenant ID..."
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
          style={{ width: "250px", marginRight: "10px" }}
        />
        <Button onClick={fetchUsers}>Load Users</Button>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          {users.length > 0 ? (
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Active</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.is_active ? "✅" : "❌"}</td>
                    <td>{u.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No users found for this tenant.</p>
          )}
        </>
      )}

      {tenantId && (
        <Button variant="primary" onClick={() => setShowModal(true)}>
          ➕ Add User
        </Button>
      )}

      {/* Create User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Tenant User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createUser}>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="tenant_staff">Staff</option>
                <option value="tenant_admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" className="mt-2 w-100">
              Create User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
