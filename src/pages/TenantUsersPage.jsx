import React, { useState, useEffect } from "react";
import API from "../api/adminAPI";
import { Table, Button, Modal, Form, Alert, Card } from "react-bootstrap";
import { Plus, Users, Trash2 } from "lucide-react";
import Loader from "../components/Loader";

export default function TenantUsersPage() {
  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "tenant_staff" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    API.get("/tenants").then((res) => {
      setTenants(res.data.tenants || []);
    }).catch(() => {});
  }, []);

  const fetchUsers = async (tid) => {
    const id = tid || tenantId;
    if (!id) return;
    setLoading(true);
    try {
      const res = await API.get(`/tenant_users/${id}`);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load tenant users");
    } finally {
      setLoading(false);
    }
  };

  const handleTenantChange = (e) => {
    const tid = e.target.value;
    setTenantId(tid);
    if (tid) fetchUsers(tid);
    else setUsers([]);
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/tenant_users/${tenantId}/${userId}`);
      setMsg("User deleted successfully");
      fetchUsers();
    } catch (err) {
      setMsg(err.response?.data?.error || "Failed to delete user");
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
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Tenant Users</h3>
        <p className="text-muted small">Select a tenant to view and manage its users.</p>
      </div>

      {msg && <Alert variant="info" className="border-0 shadow-sm mb-4">{msg}</Alert>}

      <div className="mb-4" style={{ maxWidth: "400px" }}>
        <Form.Label className="fw-semibold small">Select Tenant</Form.Label>
        <Form.Select
          value={tenantId}
          onChange={handleTenantChange}
          className="rounded-pill"
        >
          <option value="">-- Choose a tenant --</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </Form.Select>
      </div>

      {loading ? <Loader text="Loading users..." /> : tenantId ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Active</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">No users found for this tenant.</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td className="fw-semibold">
                        <div className="d-flex align-items-center gap-2">
                          <Users size={16} className="text-muted" /> {u.name}
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'tenant_admin' ? 'badge-gradient-primary' : 'bg-info text-white'}`}>
                          {u.role === 'tenant_admin' ? 'Admin' : 'Staff'}
                        </span>
                      </td>
                      <td>{u.is_active ? <span className="badge bg-success">Active</span> : <span className="badge bg-secondary">Inactive</span>}</td>
                      <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td>
                      <td>
                        <Button size="sm" variant="outline-danger" className="rounded-pill px-3" onClick={() => deleteUser(u.id)}>
                          <Trash2 size={14} className="me-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ) : (
        <p className="text-muted">Select a tenant from the dropdown above to view its users.</p>
      )}

      {tenantId && (
        <Button className="btn-gradient d-flex align-items-center gap-2 mt-4" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Add User
        </Button>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Create Tenant User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createUser}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Name</Form.Label>
              <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Email</Form.Label>
              <Form.Control type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Password</Form.Label>
              <Form.Control type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Role</Form.Label>
              <Form.Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="tenant_staff">Staff</option>
                <option value="tenant_admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" className="btn-gradient w-100 mt-2">Create User</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
