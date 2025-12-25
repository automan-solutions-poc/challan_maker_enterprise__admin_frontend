import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spinner, Alert, Table } from "react-bootstrap";
import api from "../api/adminAPI"; // ✅ Import your axios instance
// (make sure api.js exports axios.create({ baseURL: "http://127.0.0.1:6001/api" }))

export default function Dashboard() {
  const [stats, setStats] = useState({
    tenants: 0,
    users: 0,
    subscriptions: 0,
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("admin_token");

      const response = await api.get("/dashboard/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;

      setStats({
        tenants: data.tenants || 0,
        users: data.users || 0,
        subscriptions: data.subscriptions || 0,
      });

      setLogs(data.logs || []);
    } catch (err) {
      console.error("❌ Dashboard error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------
  // 🌀 Loading Spinner
  // ----------------------------------------------
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // ----------------------------------------------
  // 🧾 Main Dashboard
  // ----------------------------------------------
  return (
    <div>
      <h3 className="mb-4 fw-semibold">📊 Admin Dashboard</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* ====== DASHBOARD STATS ====== */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-0 text-center bg-primary text-white">
            <Card.Body>
              <h2>{stats.tenants}</h2>
              <p className="mb-0">Active Tenants</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 text-center bg-success text-white">
            <Card.Body>
              <h2>{stats.users}</h2>
              <p className="mb-0">Tenant Users</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 text-center bg-warning text-white">
            <Card.Body>
              <h2>{stats.subscriptions}</h2>
              <p className="mb-0">Active Subscriptions</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ====== RECENT LOGS ====== */}
      <Card className="shadow-sm border-0">
        <Card.Header className="fw-bold bg-white">
          🕓 Recent Activity Logs
        </Card.Header>
        <Card.Body>
          {logs.length === 0 ? (
            <p className="text-muted">No recent logs found.</p>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Action</th>
                  <th>Description</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{log.action_type}</td>
                    <td>{log.description}</td>
                    <td>
                      {new Date(log.timestamp).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
