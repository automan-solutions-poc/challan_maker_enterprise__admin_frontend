import React, { useState, useEffect } from "react";
import API from "../api/adminAPI";
import { Button, Modal, Form, Table, Alert } from "react-bootstrap";

// ------------------------------
// Helpers
// ------------------------------
const toDateInputValue = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [msg, setMsg] = useState("");

  const emptyForm = {
    name: "",
    email: "",
    theme_color: "#114e9e",
    plan: "Free",
    subscription_start: "",
    subscription_end: "",
    status: "active",
    logo: null,
  };

  const [form, setForm] = useState(emptyForm);

  // --------------------------------------------------
  // FETCH TENANTS
  // --------------------------------------------------
  const fetchTenants = async () => {
    try {
      const res = await API.get("/tenants");
      setTenants(res.data.tenants || []);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to load tenants");
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // --------------------------------------------------
  // CREATE / UPDATE TENANT
  // --------------------------------------------------
  const handleSaveTenant = async () => {
    try {
      const formData = new FormData();

      formData.append(
        "data",
        JSON.stringify({
          name: form.name,
          email: form.email,
          theme_color: form.theme_color,
          plan: form.plan,
          subscription_start: form.subscription_start || null,
          subscription_end: form.subscription_end || null,
          status: form.status,
        })
      );

      if (form.logo) {
        formData.append("logo", form.logo);
      }

      if (editingTenant) {
        await API.put(`/tenants/${editingTenant.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("✅ Tenant updated successfully");
      } else {
        await API.post("/tenants", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("✅ Tenant created successfully");
      }

      setShowModal(false);
      setEditingTenant(null);
      setForm(emptyForm);
      fetchTenants();
    } catch (err) {
      console.error(err);
      setMsg("❌ Operation failed");
    }
  };

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------
  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setForm({
      name: tenant.name,
      email: tenant.email,
      theme_color: tenant.theme_color || "#114e9e",
      plan: tenant.plan,
      subscription_start: toDateInputValue(tenant.subscription_start),
      subscription_end: toDateInputValue(tenant.subscription_end),
      status: tenant.status,
      logo: null,
    });
    setShowModal(true);
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------
  const handleDelete = async (tenantId) => {
    if (!window.confirm("Are you sure you want to delete this tenant?")) return;

    try {
      await API.delete(`/tenants/${tenantId}`);
      setMsg("🗑️ Tenant deleted successfully");
      fetchTenants();
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to delete tenant");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Tenants</h3>
        <Button
          onClick={() => {
            setForm(emptyForm);
            setEditingTenant(null);
            setShowModal(true);
          }}
        >
          + Add Tenant
        </Button>
      </div>

      {msg && <Alert variant="info">{msg}</Alert>}

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Plan</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.name}</td>
              <td>{t.email}</td>
              <td>{t.plan}</td>
              <td>{t.status}</td>
              <td>{new Date(t.created_at).toLocaleDateString()}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  className="me-2"
                  onClick={() => handleEdit(t)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTenant ? "Edit Tenant" : "Add Tenant"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Plan</Form.Label>
              <Form.Select
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
              >
                <option>Free</option>
                <option>Basic</option>
                <option>Premium</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Subscription Start</Form.Label>
              <Form.Control
                type="date"
                value={form.subscription_start}
                onChange={(e) =>
                  setForm({ ...form, subscription_start: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Subscription End</Form.Label>
              <Form.Control
                type="date"
                value={form.subscription_end}
                onChange={(e) =>
                  setForm({ ...form, subscription_end: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Logo</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) =>
                  setForm({ ...form, logo: e.target.files[0] })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveTenant}>
            {editingTenant ? "Update Tenant" : "Create Tenant"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
