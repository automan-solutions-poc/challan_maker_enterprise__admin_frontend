import React, { useEffect, useState } from "react";
import { Row, Col, Card, Alert, Table } from "react-bootstrap";
import { Building2, Users, CreditCard } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import api from "../api/adminAPI";
import Loader from "../components/Loader";

const PIE_COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#ef4444", "#a855f7"];
const BAR_COLOR = "#6366f1";

const chartTooltipStyle = {
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "#f8fafc",
};

export default function Dashboard() {
  const [stats, setStats] = useState({ tenants: 0, users: 0, subscriptions: 0 });
  const [charts, setCharts] = useState({
    tenant_status_breakdown: [],
    tenants_by_plan: [],
    challans_by_month: [],
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
      setCharts(
        data.charts || {
          tenant_status_breakdown: [],
          tenants_by_plan: [],
          challans_by_month: [],
        }
      );
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading Dashboard..." />;

  const overviewBar = [
    { name: "Tenants", count: stats.tenants },
    { name: "Users", count: stats.users },
    { name: "Subscriptions", count: stats.subscriptions },
  ];

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

      <Row className="g-4 mb-4">
        {statCards.map((card, idx) => (
          <Col md={4} key={idx}>
            <Card className="h-100 p-4 border-0 position-relative overflow-hidden">
              <div
                className="position-absolute"
                style={{
                  top: "-20px",
                  right: "-20px",
                  width: "100px",
                  height: "100px",
                  background: card.gradient,
                  opacity: "0.1",
                  borderRadius: "50%",
                }}
              />
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-4 p-3 me-3 d-flex align-items-center justify-content-center"
                  style={{
                    background: card.gradient,
                    color: "white",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  }}
                >
                  {card.icon}
                </div>
                <h6
                  className="text-muted fw-bold mb-0"
                  style={{ fontSize: "0.8rem", letterSpacing: "0.02rem" }}
                >
                  {card.title.toUpperCase()}
                </h6>
              </div>
              <div className="display-5 fw-bold">{card.value}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-1">Platform overview</h5>
            <p className="text-muted small mb-4">Key counts</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={overviewBar} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis type="number" allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} width={90} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" fill={BAR_COLOR} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-1">Tenants by status</h5>
            <p className="text-muted small mb-3">Active, pending, inactive</p>
            {(charts.tenant_status_breakdown || []).length === 0 ? (
              <p className="text-muted">No tenant data.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={charts.tenant_status_breakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {charts.tenant_status_breakdown.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-1">Tenants by plan</h5>
            <p className="text-muted small mb-3">Free, Basic, Premium</p>
            {(charts.tenants_by_plan || []).length === 0 ? (
              <p className="text-muted">No plan data.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={charts.tenants_by_plan}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {charts.tenants_by_plan.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col>
          <Card className="border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-1">Challans platform-wide</h5>
            <p className="text-muted small mb-4">Last 6 months</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={charts.challans_by_month || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" name="Challans" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
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
