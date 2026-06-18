import React, { useState, useEffect } from "react";
import API from "../api/adminAPI";
import { Button, Modal, Form, Table, Alert, Card } from "react-bootstrap";
import { Plus, Building2 } from "lucide-react";
import Loader from "../components/Loader";

const toDateInputValue = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const emptyForm = {
    name: "",
    email: "",
    theme_color: "#114e9e",
    plan: "Free",
    subscription_start: "",
    subscription_end: "",
    status: "active",
    logo: null,
    pdf_limit: "",
  };

  const [form, setForm] = useState(emptyForm);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tenants");
      setTenants(res.data.tenants || []);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load tenants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTenants(); }, []);

  const handleSaveTenant = async () => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({
        name: form.name,
        email: form.email,
        theme_color: form.theme_color,
        plan: form.plan,
        subscription_start: form.subscription_start || null,
        subscription_end: form.subscription_end || null,
        status: form.status,
        pdf_limit: form.pdf_limit !== "" ? form.pdf_limit : null,
      }));
      if (form.logo) formData.append("logo", form.logo);

      if (editingTenant) {
        await API.put(`/tenants/${editingTenant.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("Tenant updated successfully");
      } else {
        await API.post("/tenants", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("Tenant created successfully");
      }

      setShowModal(false);
      setEditingTenant(null);
      setForm(emptyForm);
      fetchTenants();
    } catch (err) {
      console.error(err);
      setMsg("Operation failed");
    }
  };

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
      pdf_limit: tenant.max_limit != null ? tenant.max_limit : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (tenantId) => {
    if (!window.confirm("Are you sure you want to delete this tenant?")) return;
    try {
      await API.delete(`/tenants/${tenantId}`);
      setMsg("Tenant deleted successfully");
      fetchTenants();
    } catch (err) {
      console.error(err);
      setMsg("Failed to delete tenant");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Tenants</h3>
          <p className="text-muted small">Manage all registered tenants.</p>
        </div>
        <Button
          className="btn-gradient d-flex align-items-center gap-2"
          onClick={() => { setForm(emptyForm); setEditingTenant(null); setShowModal(true); }}
        >
          <Plus size={20} /> Add Tenant
        </Button>
      </div>

      {msg && <Alert variant="info" className="border-0 shadow-sm mb-4">{msg}</Alert>}

      {loading ? <Loader text="Loading tenants..." /> : (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>PDF Limit</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-4">No tenants found.</td>
                  </tr>
                ) : (
                  tenants.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td className="fw-semibold">
                        <div className="d-flex align-items-center gap-2">
                          <Building2 size={16} className="text-muted" /> {t.name}
                        </div>
                      </td>
                      <td>{t.email}</td>
                      <td><span className="badge badge-gradient-primary">{t.plan}</span></td>
                      <td>
                        {t.max_limit == null ? (
                          <span className="text-muted">—</span>
                        ) : t.max_limit === -1 ? (
                          <span className="text-success fw-semibold">Unlimited</span>
                        ) : (
                          <span>{t.pdf_count} / {t.max_limit}</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${t.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>{new Date(t.created_at).toLocaleDateString()}</td>
                      <td>
                        <Button size="sm" variant="outline-warning" className="me-2 rounded-pill px-3" onClick={() => handleEdit(t)}>Edit</Button>
                        <Button size="sm" variant="outline-danger" className="rounded-pill px-3" onClick={() => handleDelete(t.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {editingTenant ? "Edit Tenant" : "Add Tenant"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Name</Form.Label>
              <Form.Control value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Email</Form.Label>
              <Form.Control type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Plan</Form.Label>
              <Form.Select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                <option>Free</option>
                <option>Basic</option>
                <option>Premium</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Status</Form.Label>
              <Form.Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">PDF Limit <span className="text-muted fw-normal">(-1 = unlimited)</span></Form.Label>
              <Form.Control
                type="number"
                min="-1"
                value={form.pdf_limit}
                onChange={(e) => setForm({ ...form, pdf_limit: e.target.value })}
                placeholder="Auto from plan if empty"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Subscription Start</Form.Label>
              <Form.Control type="date" value={form.subscription_start} onChange={(e) => setForm({ ...form, subscription_start: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Subscription End</Form.Label>
              <Form.Control type="date" value={form.subscription_end} onChange={(e) => setForm({ ...form, subscription_end: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Logo</Form.Label>
              <Form.Control type="file" onChange={(e) => setForm({ ...form, logo: e.target.files[0] })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button className="btn-gradient px-4" onClick={handleSaveTenant}>
            {editingTenant ? "Update Tenant" : "Create Tenant"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
