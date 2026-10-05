import React, { useState, useEffect } from "react";
import API from "../api/adminAPI";
import { Table, Button, Alert, Card, Form, Badge } from "react-bootstrap";
import { Eye, FileText, Building2 } from "lucide-react";
import Loader from "../components/Loader";

export default function AdminChallansPage() {
  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    API.get("/tenants").then((res) => {
      setTenants(res.data.tenants || []);
    }).catch(() => {});
  }, []);

  const fetchChallans = async (tid) => {
    const id = tid || tenantId;
    if (!id) return;
    setLoading(true);
    try {
      const res = await API.get(`/tenants/${id}/challans`);
      setChallans(res.data.challans || []);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load challans");
    } finally {
      setLoading(false);
    }
  };

  const handleTenantChange = (e) => {
    const tid = e.target.value;
    setTenantId(tid);
    if (tid) fetchChallans(tid);
    else setChallans([]);
  };

  const handleViewPDF = (pdfUrl) => {
    if (!pdfUrl) return alert("PDF not available yet.");
    const fullUrl = pdfUrl.startsWith("http") ? pdfUrl : `${API.defaults.baseURL}${pdfUrl}`;
    window.open(fullUrl, "_blank");
  };

  const getTenantName = () => {
    const t = tenants.find((t) => String(t.id) === String(tenantId));
    return t ? t.name : "this tenant";
  };

  return (
    <div>
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Challans</h3>
        <p className="text-muted small">View challans and PDFs for any tenant.</p>
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

      {loading ? <Loader text="Loading challans..." /> : tenantId ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Challan No</th>
                  <th>Customer</th>
                  <th>Serial No</th>
                  <th>Problem</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                {challans.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-4">
                      No challans found for {getTenantName()}.
                    </td>
                  </tr>
                ) : (
                  challans.map((c, i) => (
                    <tr key={c.challan_no || i}>
                      <td>{i + 1}</td>
                      <td className="fw-semibold">
                        <div className="d-flex align-items-center gap-2">
                          <Building2 size={16} className="text-muted" /> {c.challan_no}
                        </div>
                      </td>
                      <td>{c.customer_name}</td>
                      <td>{c.serial_number}</td>
                      <td style={{ maxWidth: 200 }} className="text-truncate">{c.problem}</td>
                      <td>
                        {c.status === "delivered" ? (
                          <Badge className="badge-gradient-success px-3 py-2 rounded-pill">Delivered</Badge>
                        ) : (
                          <Badge className="badge-gradient-warning px-3 py-2 rounded-pill">Pending</Badge>
                        )}
                      </td>
                      <td>{c.date}</td>
                      <td>
                        <Button
                          size="sm"
                          variant={c.pdf_url ? "outline-danger" : "outline-secondary"}
                          className="rounded-pill px-3 d-flex align-items-center gap-1"
                          disabled={!c.pdf_url}
                          onClick={() => handleViewPDF(c.pdf_url)}
                        >
                          <FileText size={14} />
                          <Eye size={14} />
                          {c.pdf_url ? "View PDF" : "No PDF"}
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
        <p className="text-muted">Select a tenant from the dropdown above to view its challans.</p>
      )}
    </div>
  );
}
