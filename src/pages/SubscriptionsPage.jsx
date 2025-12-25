import React, { useEffect, useState } from "react";
import API from "../api/adminAPI";
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";

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
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    fetchSubscriptions();
  }, []);

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
      <h4>💳 Subscriptions</h4>
      {msg && <Alert variant="info">{msg}</Alert>}

      <div className="mb-3">
        <Button onClick={() => setShowModal(true)}>➕ New Subscription</Button>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover size="sm">
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
            {subscriptions.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.tenant_id}</td>
                <td>{s.plan_name}</td>
                <td>₹{s.price}</td>
                <td>{s.start_date}</td>
                <td>{s.end_date}</td>
                <td>{s.is_active ? "✅ Active" : "❌ Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Create Subscription Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createSubscription}>
            <Form.Group className="mb-2">
              <Form.Label>Tenant ID</Form.Label>
              <Form.Control
                value={form.tenant_id}
                onChange={(e) => setForm({ ...form, tenant_id: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Plan Name</Form.Label>
              <Form.Control
                value={form.plan_name}
                onChange={(e) => setForm({ ...form, plan_name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                required
              />
            </Form.Group>

            <Button type="submit" className="mt-2 w-100">
              Create
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
