import React, { useEffect, useState } from "react";
import { Row, Col, Card, Alert, Table } from "react-bootstrap";
import { Building2, Users, CreditCard } from "lucide-react";
import api from "../api/adminAPI";
import Loader from "../components/Loader";

export default function Dashboard() {
  const [stats, setStats] = useState({ tenants: 0, users: 0, subscriptions: 0 });
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
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading Dashboard..." />;

  const statCards = [
    {
      title: "Active Tenants",
      value: stats.tenants,
      icon: <Building2 size={24} />,
      gradient: "var(--primary-gradient)",
    },
    {
      title: "Tenant Users",
      value: stats.users,
      icon: <Users size={24} />,
      gradient: "var(--success-gradient)",
    },
    {
      title: "Subscriptions",
      value: stats.subscriptions,
      icon: <CreditCard size={24} />,
      gradient: "var(--warning-gradient)",
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Dashboard</h3>
          <p className="text-muted small">Admin overview at a glance.</p>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="border-0 shadow-sm mb-4">
          {error}
        </Alert>
      )}

      <Row className="g-4 mb-5">
        {statCards.map((card, idx) => (
          <Col md={4} key={idx}>
            <Card className="h-100 p-4 border-0 position-relative overflow-hidden">
              <div
                className="position-absolute"
                style={{
                  top: '-20px',
                  right: '-20px',
                  width: '100px',
                  height: '100px',
                  background: card.gradient,
                  opacity: '0.1',
                  borderRadius: '50%',
                }}
              />
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-4 p-3 me-3 d-flex align-items-center justify-content-center"
                  style={{
                    background: card.gradient,
                    color: 'white',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }}
                >
                  {card.icon}
                </div>
                <div>
                  <h6 className="text-muted fw-bold mb-0" style={{ fontSize: '0.8rem', letterSpacing: '0.02rem' }}>
                    {card.title.toUpperCase()}
                  </h6>
                </div>
              </div>
              <div className="display-5 fw-bold">{card.value}</div>
              <div className="mt-2">
                <small className="text-success fw-semibold">Updated just now</small>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="fw-bold bg-transparent border-bottom-0 pt-4 px-4">
          <h5 className="mb-0">Recent Activity Logs</h5>
        </Card.Header>
        <Card.Body className="px-4 pb-4">
          {logs.length === 0 ? (
            <p className="text-muted">No recent logs found.</p>
          ) : (
            <Table hover responsive className="mb-0">
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
                    <td>
                      <span className="badge badge-gradient-primary">{log.action_type}</span>
                    </td>
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
