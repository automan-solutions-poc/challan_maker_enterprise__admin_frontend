import React, { useEffect, useState } from "react";
import API from "../api/adminAPI";
import { Table, Button, Modal, Form, Alert, Card } from "react-bootstrap";
import { Plus, CreditCard } from "lucide-react";
import Loader from "../components/Loader";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    tenant_id: "",
    plan_name: "",
    price: "",
    start_date: "",
    end_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await API.get("/subscriptions");
      setSubscriptions(res.data.subscriptions || []);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscriptions(); }, []);

  const createSubscription = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/subscriptions", form);
      setMsg(res.data.message);
      setShowModal(false);
      setForm({ tenant_id: "", plan_name: "", price: "", start_date: "", end_date: "" });
      fetchSubscriptions();
    } catch (err) {
      setMsg(err.response?.data?.error || "Failed to create subscription");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Subscriptions</h3>
          <p className="text-muted small">Manage subscription plans for tenants.</p>
        </div>
        <Button className="btn-gradient d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <Plus size={20} /> New Subscription
        </Button>
      </div>

      {msg && <Alert variant="info" className="border-0 shadow-sm mb-4">{msg}</Alert>}

      {loading ? <Loader text="Loading subscriptions..." /> : (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tenant ID</th>
                  <th>Plan</th>
                  <th>Price</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">No subscriptions found.</td>
                  </tr>
                ) : (
                  subscriptions.map((s) => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.tenant_id}</td>
                      <td className="fw-semibold">
                        <div className="d-flex align-items-center gap-2">
                          <CreditCard size={16} className="text-muted" /> {s.plan_name}
                        </div>
                      </td>
                      <td>₹{s.price}</td>
                      <td>{s.start_date ? new Date(s.start_date).toLocaleDateString() : '-'}</td>
                      <td>{s.end_date ? new Date(s.end_date).toLocaleDateString() : '-'}</td>
                      <td>
                        {s.is_active ? (
                          <span className="badge badge-gradient-success">Active</span>
                        ) : (
                          <span className="badge bg-secondary">Inactive</span>
                        )}
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
          <Modal.Title className="fw-bold">Create Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createSubscription}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Tenant ID</Form.Label>
              <Form.Control value={form.tenant_id} onChange={(e) => setForm({ ...form, tenant_id: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Plan Name</Form.Label>
              <Form.Control value={form.plan_name} onChange={(e) => setForm({ ...form, plan_name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Price</Form.Label>
              <Form.Control type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Start Date</Form.Label>
              <Form.Control type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">End Date</Form.Label>
              <Form.Control type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
            </Form.Group>
            <Button type="submit" className="btn-gradient w-100 mt-2">Create</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
