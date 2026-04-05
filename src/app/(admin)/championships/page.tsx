"use client";

import { useState } from "react";
import {
  Card, Table, Tag, Button, Input, Select, Space, Typography,
  Modal, Form, Badge, Tooltip, Row, Col, DatePicker, Alert,
  Popconfirm, Drawer,
} from "antd";
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  TrophyOutlined, EnvironmentOutlined, CalendarOutlined,
  CheckCircleOutlined, EyeOutlined, ThunderboltOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import PermissionGuard from "@/components/guards/PermissionGuard";
import { PERMISSIONS } from "@/types/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import StatsCard from "@/components/shared/StatsCard";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ── Types ──────────────────────────────────────────────────────────────────────
type QualStatus = "qualified" | "pending" | "withdrawn" | "competing" | "completed";

interface Championship {
  id: string;
  tournamentName: string;
  location: string;
  country: string;
  date: string;
  endDate: string;
  category: string;
  riderName: string;
  horseName: string;
  horseBreed: string;
  status: QualStatus;
  notes: string;
  prize?: string;
  result?: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────
const initial: Championship[] = [
  {
    id: "1",
    tournamentName: "Gulf Arabian Championship 2026",
    location: "Riyadh",
    country: "🇸🇦 Saudi Arabia",
    date: "2026-05-10",
    endDate: "2026-05-15",
    category: "Speed Racing",
    riderName: "Ahmed Al-Rashidi",
    horseName: "Storm",
    horseBreed: "Arabian",
    status: "qualified",
    notes: "Main class — 1200m sprint. Storm is fully prepared.",
    prize: "$50,000",
  },
  {
    id: "2",
    tournamentName: "International Dressage Open",
    location: "Dubai",
    country: "🇦🇪 UAE",
    date: "2026-05-20",
    endDate: "2026-05-23",
    category: "Dressage",
    riderName: "Sara Hassan",
    horseName: "Luna",
    horseBreed: "Thoroughbred",
    status: "pending",
    notes: "Awaiting final qualification results from the committee.",
    prize: "$30,000",
  },
  {
    id: "3",
    tournamentName: "National Endurance Cup 100km",
    location: "Jeddah",
    country: "🇸🇦 Saudi Arabia",
    date: "2026-04-28",
    endDate: "2026-04-28",
    category: "Endurance",
    riderName: "Fatima Noor",
    horseName: "Bella",
    horseBreed: "Arabian",
    status: "competing",
    notes: "Race day! Bella is in top condition.",
    prize: "$25,000",
  },
  {
    id: "4",
    tournamentName: "Spring Classic Show Jumping",
    location: "Abu Dhabi",
    country: "🇦🇪 UAE",
    date: "2026-04-15",
    endDate: "2026-04-17",
    category: "Show Jumping",
    riderName: "Khalid Al-Mansouri",
    horseName: "Thunder",
    horseBreed: "Warmblood",
    status: "completed",
    notes: "Excellent performance.",
    prize: "$15,000",
    result: "🥇 1st Place",
  },
  {
    id: "5",
    tournamentName: "Desert Challenge Cup",
    location: "Riyadh",
    country: "🇸🇦 Saudi Arabia",
    date: "2026-06-05",
    endDate: "2026-06-06",
    category: "Speed Racing",
    riderName: "Mohammed Talib",
    horseName: "Shadow",
    horseBreed: "Quarter Horse",
    status: "qualified",
    notes: "Shadow peaked form. Ready for competition.",
    prize: "$20,000",
  },
];

const STATUS_CONFIG: Record<QualStatus, { color: string; label: string; bg: string }> = {
  qualified:  { color: "#52c41a", label: "✅ Qualified",   bg: "#f6ffed" },
  pending:    { color: "#faad14", label: "⏳ Pending",      bg: "#fffbe6" },
  withdrawn:  { color: "#ff4d4f", label: "❌ Withdrawn",    bg: "#fff2f0" },
  competing:  { color: "#1677ff", label: "🏇 Competing",   bg: "#e6f0ff" },
  completed:  { color: "#722ed1", label: "🏁 Completed",   bg: "#f9f0ff" },
};

const CATEGORIES = ["Speed Racing", "Endurance", "Dressage", "Show Jumping", "Reining", "Polo"];

export default function ChampionshipsPage() {
  const { can } = usePermissions();
  const [data, setData] = useState<Championship[]>(initial);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Championship | null>(null);
  const [quickDrawer, setQuickDrawer] = useState(false);
  const [selected, setSelected] = useState<Championship | null>(null);
  const [form] = Form.useForm();

  // ── Filters ────────────────────────────────────────────────────────────────
  const filtered = data.filter((c) => {
    const matchSearch =
      c.tournamentName.toLowerCase().includes(search.toLowerCase()) ||
      c.riderName.toLowerCase().includes(search.toLowerCase()) ||
      c.horseName.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    const matchCat = !categoryFilter || c.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Championship) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const openQuickView = (record: Championship) => {
    setSelected(record);
    setQuickDrawer(true);
  };

  const handleDelete = (id: string) => {
    setData((p) => p.filter((c) => c.id !== id));
    toast.success("Entry removed");
  };

  const quickStatusUpdate = (id: string, status: QualStatus) => {
    setData((p) => p.map((c) => (c.id === id ? { ...c, status } : c)));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
    toast.success(`Status updated to "${STATUS_CONFIG[status].label}"`);
  };

  const handleSubmit = (values: Omit<Championship, "id">) => {
    if (editing) {
      setData((p) => p.map((c) => (c.id === editing.id ? { ...c, ...values } : c)));
      toast.success("Championship updated ✅");
    } else {
      setData((p) => [{ id: String(Date.now()), ...values }, ...p]);
      toast.success("Championship added ✅");
    }
    setModalOpen(false);
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = {
    total: data.length,
    qualified: data.filter((c) => c.status === "qualified").length,
    competing: data.filter((c) => c.status === "competing").length,
    completed: data.filter((c) => c.status === "completed").length,
  };

  // ── Columns ────────────────────────────────────────────────────────────────
  const columns = [
    {
      title: "Tournament",
      key: "tournament",
      width: 260,
      render: (_: unknown, r: Championship) => (
        <div>
          <Text strong style={{ display: "block", fontSize: 14 }}>
            <TrophyOutlined style={{ color: "#faad14", marginRight: 6 }} />
            {r.tournamentName}
          </Text>
          <Space size={4} style={{ marginTop: 2 }}>
            <Tag color="blue" style={{ fontSize: 11 }}>{r.category}</Tag>
            <Text style={{ fontSize: 11, color: "#8c8c8c" }}>
              <EnvironmentOutlined /> {r.location}, {r.country}
            </Text>
          </Space>
        </div>
      ),
    },
    {
      title: "Rider & Horse",
      key: "entry",
      render: (_: unknown, r: Championship) => (
        <div>
          <Text strong style={{ display: "block" }}>👤 {r.riderName}</Text>
          <Text style={{ color: "#8c8c8c", fontSize: 13 }}>🐴 {r.horseName} ({r.horseBreed})</Text>
        </div>
      ),
    },
    {
      title: "Dates",
      key: "dates",
      render: (_: unknown, r: Championship) => (
        <div>
          <Text style={{ fontSize: 13 }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {r.date}
          </Text>
          <br />
          <Text style={{ color: "#8c8c8c", fontSize: 12 }}>Until: {r.endDate}</Text>
        </div>
      ),
    },
    {
      title: "Prize",
      dataIndex: "prize",
      key: "prize",
      render: (v?: string) => v
        ? <Text strong style={{ color: "#52c41a" }}>{v}</Text>
        : <Text style={{ color: "#ccc" }}>—</Text>,
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      render: (v?: string) => v
        ? <Text strong style={{ fontSize: 16 }}>{v}</Text>
        : <Text style={{ color: "#ccc" }}>—</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (v: QualStatus) => (
        <div style={{
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: 20,
          background: STATUS_CONFIG[v].bg,
          border: `1px solid ${STATUS_CONFIG[v].color}40`,
        }}>
          <Text style={{ color: STATUS_CONFIG[v].color, fontSize: 12, fontWeight: 600 }}>
            {STATUS_CONFIG[v].label}
          </Text>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, r: Championship) => (
        <Space>
          <Tooltip title="Quick View & Update">
            <Button size="small" icon={<EyeOutlined />} onClick={() => openQuickView(r)} />
          </Tooltip>
          {can(PERMISSIONS.MANAGE_BOOKINGS) && (
            <>
              <Tooltip title="Edit">
                <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
              </Tooltip>
              <Popconfirm title="Remove this entry?" onConfirm={() => handleDelete(r.id)}>
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PermissionGuard permission={PERMISSIONS.VIEW_BOOKINGS}>
      <div>
        {/* ── Header ── */}
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              <TrophyOutlined style={{ color: "#faad14", marginRight: 8 }} />
              Championships & Qualifications
            </Title>
            <Text style={{ color: "#8c8c8c" }}>
              Track qualified riders & horses for upcoming tournaments
            </Text>
          </div>
          {can(PERMISSIONS.MANAGE_BOOKINGS) && (
            <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 8 }}>
              Add Entry
            </Button>
          )}
        </div>

        {/* ── Stats ── */}
        <div className="stats-grid" style={{ marginBottom: 16 }}>
          <StatsCard title="Total Entries"   value={stats.total}     icon={<TrophyOutlined />}        color="#1677ff" />
          <StatsCard title="Qualified"       value={stats.qualified} icon={<CheckCircleOutlined />}   color="#52c41a" />
          <StatsCard title="Now Competing"   value={stats.competing} icon={<ThunderboltOutlined />}   color="#faad14" />
          <StatsCard title="Completed"       value={stats.completed} icon={<TrophyOutlined />}        color="#722ed1" />
        </div>

        {/* ── Filters ── */}
        <Card style={{ marginBottom: 16, borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <Space wrap>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search by tournament, rider, or horse..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 320, borderRadius: 8 }}
            />
            <Select placeholder="Status" allowClear value={statusFilter} onChange={setStatusFilter} style={{ width: 160 }}>
              {(Object.keys(STATUS_CONFIG) as QualStatus[]).map((k) => (
                <Option key={k} value={k}>{STATUS_CONFIG[k].label}</Option>
              ))}
            </Select>
            <Select placeholder="Category" allowClear value={categoryFilter} onChange={setCategoryFilter} style={{ width: 160 }}>
              {CATEGORIES.map((c) => <Option key={c} value={c}>{c}</Option>)}
            </Select>
          </Space>
        </Card>

        {/* ── Table ── */}
        <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <Table dataSource={filtered} columns={columns} rowKey="id" scroll={{ x: true }} />
        </Card>

        {/* ── Quick View & Update Drawer ── */}
        <Drawer
          title={
            <Space>
              <TrophyOutlined style={{ color: "#faad14" }} />
              <span>Quick View & Update</span>
            </Space>
          }
          open={quickDrawer}
          onClose={() => setQuickDrawer(false)}
          width={420}
        >
          {selected && (
            <div>
              {/* Tournament Info */}
              <div style={{
                background: "#f5f6fa", borderRadius: 12, padding: 16, marginBottom: 20,
              }}>
                <Title level={5} style={{ margin: "0 0 4px" }}>{selected.tournamentName}</Title>
                <Tag color="blue">{selected.category}</Tag>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                  <Text><EnvironmentOutlined /> {selected.location}, {selected.country}</Text>
                  <Text><CalendarOutlined /> {selected.date} → {selected.endDate}</Text>
                  {selected.prize && <Text>💰 Prize: <strong>{selected.prize}</strong></Text>}
                </div>
              </div>

              {/* Rider & Horse */}
              <Row gutter={12} style={{ marginBottom: 20 }}>
                <Col span={12}>
                  <div style={{ padding: 14, background: "#e6f0ff", borderRadius: 10, textAlign: "center" }}>
                    <Text style={{ fontSize: 24 }}>👤</Text>
                    <Text style={{ display: "block", fontWeight: 700, marginTop: 4 }}>{selected.riderName}</Text>
                    <Text style={{ fontSize: 12, color: "#8c8c8c" }}>Rider</Text>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ padding: 14, background: "#f6ffed", borderRadius: 10, textAlign: "center" }}>
                    <Text style={{ fontSize: 24 }}>🐴</Text>
                    <Text style={{ display: "block", fontWeight: 700, marginTop: 4 }}>{selected.horseName}</Text>
                    <Text style={{ fontSize: 12, color: "#8c8c8c" }}>{selected.horseBreed}</Text>
                  </div>
                </Col>
              </Row>

              {/* Notes */}
              {selected.notes && (
                <Alert message={selected.notes} type="info" showIcon style={{ marginBottom: 20, borderRadius: 8 }} />
              )}

              {/* Result */}
              {selected.result && (
                <div style={{ textAlign: "center", padding: 16, background: "#f9f0ff", borderRadius: 12, marginBottom: 20 }}>
                  <Text style={{ fontSize: 28 }}>{selected.result}</Text>
                </div>
              )}

              {/* Current Status */}
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>Current Status:</Text>
                <div style={{
                  display: "inline-block", padding: "6px 14px", borderRadius: 20,
                  background: STATUS_CONFIG[selected.status].bg,
                  border: `1px solid ${STATUS_CONFIG[selected.status].color}40`,
                }}>
                  <Text style={{ color: STATUS_CONFIG[selected.status].color, fontWeight: 700 }}>
                    {STATUS_CONFIG[selected.status].label}
                  </Text>
                </div>
              </div>

              {/* ⚡ Quick Status Update (Admin only) */}
              {can(PERMISSIONS.MANAGE_BOOKINGS) && (
                <div>
                  <Text strong style={{ display: "block", marginBottom: 8 }}>
                    ⚡ Quick Status Update:
                  </Text>
                  <Space wrap>
                    {(Object.keys(STATUS_CONFIG) as QualStatus[]).map((s) => (
                      <Button
                        key={s}
                        size="small"
                        type={selected.status === s ? "primary" : "default"}
                        onClick={() => quickStatusUpdate(selected.id, s)}
                        style={{
                          borderColor: STATUS_CONFIG[s].color,
                          color: selected.status === s ? "#fff" : STATUS_CONFIG[s].color,
                          background: selected.status === s ? STATUS_CONFIG[s].color : undefined,
                          borderRadius: 20,
                        }}
                      >
                        {STATUS_CONFIG[s].label}
                      </Button>
                    ))}
                  </Space>

                  <div style={{ marginTop: 20 }}>
                    <Button
                      type="primary" icon={<EditOutlined />} block
                      onClick={() => { setQuickDrawer(false); openEdit(selected); }}
                      style={{ borderRadius: 8 }}
                    >
                      Full Edit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Drawer>

        {/* ── Add / Edit Modal ── */}
        <Modal
          title={editing ? "Edit Championship Entry" : "Add New Championship Entry"}
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={() => form.submit()}
          okText={editing ? "Update" : "Add"}
          width={620}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
            <Form.Item name="tournamentName" label="Tournament Name" rules={[{ required: true }]}>
              <Input placeholder="e.g. Gulf Arabian Championship 2026" />
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="location" label="City" rules={[{ required: true }]}>
                  <Input placeholder="e.g. Riyadh" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                  <Input placeholder="e.g. 🇸🇦 Saudi Arabia" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="date" label="Start Date" rules={[{ required: true }]}>
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
                  <Input type="date" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select>
                {CATEGORIES.map((c) => <Option key={c} value={c}>{c}</Option>)}
              </Select>
            </Form.Item>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="riderName" label="Rider Name" rules={[{ required: true }]}>
                  <Input placeholder="Full name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="horseName" label="Horse Name" rules={[{ required: true }]}>
                  <Input placeholder="Horse name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="horseBreed" label="Breed" rules={[{ required: true }]}>
                  <Input placeholder="e.g. Arabian" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="prize" label="Prize Pool">
                  <Input placeholder="e.g. $50,000" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>
                {(Object.keys(STATUS_CONFIG) as QualStatus[]).map((k) => (
                  <Option key={k} value={k}>{STATUS_CONFIG[k].label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="result" label="Result (if completed)">
              <Input placeholder="e.g. 🥇 1st Place" />
            </Form.Item>

            <Form.Item name="notes" label="Notes">
              <TextArea rows={3} placeholder="Any notes about preparation, conditions, etc." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PermissionGuard>
  );
}
