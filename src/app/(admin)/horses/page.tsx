"use client";

import { useState } from "react";
import {
  Card, Table, Tag, Button, Input, Select, Space, Modal, Form,
  Typography, Badge, Tooltip, Upload, Image, Avatar, Row, Col, Tabs,
} from "antd";
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  UploadOutlined, FileTextOutlined, MedicineBoxOutlined, PictureOutlined,
} from "@ant-design/icons";
import { Horse, HorseStatus } from "@/types";
import { toast } from "react-toastify";
import PermissionGuard from "@/components/guards/PermissionGuard";
import { PERMISSIONS } from "@/types/permissions";
import { usePermissions } from "@/hooks/usePermissions";

const { Text, Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const STATUS_COLOR: Record<HorseStatus, string> = {
  active: "green", training: "blue", resting: "orange", injured: "red", inactive: "default",
};

// ── Horse Report type ──────────────────────────────────────────────────────────
interface HorseReport {
  id: string;
  horseId: string;
  type: "report" | "health_check" | "vaccination" | "treatment";
  title: string;
  description: string;
  expert: string;
  date: string;
}

// ── Initial data ───────────────────────────────────────────────────────────────
const initialHorses: (Horse & { imageUrl?: string })[] = [
  { id: "1", name: "Storm", gender: "male", status: "active", breed: "Arabian", age: 5, owner: "Ahmed Al-Rashidi", createdAt: "2025-01-10", imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400" },
  { id: "2", name: "Luna", gender: "female", status: "injured", breed: "Thoroughbred", age: 7, owner: "Sara Hassan", createdAt: "2025-02-14", imageUrl: "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=400" },
  { id: "3", name: "Thunder", gender: "male", status: "training", breed: "Warmblood", age: 4, owner: "Khalid Al-Mansouri", createdAt: "2025-03-01" },
  { id: "4", name: "Bella", gender: "female", status: "active", breed: "Arabian", age: 6, owner: "Fatima Noor", createdAt: "2025-03-15" },
  { id: "5", name: "Shadow", gender: "male", status: "resting", breed: "Quarter Horse", age: 9, owner: "Mohammed Talib", createdAt: "2025-04-20" },
];

const initialReports: HorseReport[] = [
  { id: "r1", horseId: "1", type: "report", title: "Monthly Performance Report", description: "Storm showed excellent performance during training. Speed improved by 15%.", expert: "Khalid Al-Mansouri", date: "2026-04-01" },
  { id: "r2", horseId: "1", type: "health_check", title: "Routine Health Check", description: "All vitals normal. Weight: 520kg. Temperature: 37.8°C. Heart rate: 36 bpm.", expert: "Dr. Amira", date: "2026-03-28" },
  { id: "r3", horseId: "2", type: "treatment", title: "Injury Treatment — Right Leg", description: "Applied anti-inflammatory treatment. Bandaged right front leg. Rest recommended for 2 weeks.", expert: "Dr. Khalid", date: "2026-04-03" },
  { id: "r4", horseId: "2", type: "vaccination", title: "Annual Vaccination", description: "Administered: Flu vaccine + Tetanus booster. Next due: April 2027.", expert: "Dr. Amira", date: "2026-04-02" },
];

const REPORT_TYPE_CONFIG = {
  report:       { color: "blue",   icon: <FileTextOutlined />,    label: "Performance Report" },
  health_check: { color: "green",  icon: <MedicineBoxOutlined />, label: "Health Check" },
  vaccination:  { color: "purple", icon: <MedicineBoxOutlined />, label: "Vaccination" },
  treatment:    { color: "red",    icon: <MedicineBoxOutlined />, label: "Treatment" },
};

export default function HorsesPage() {
  const { can } = usePermissions();
  const [horses, setHorses] = useState(initialHorses);
  const [reports, setReports] = useState<HorseReport[]>(initialReports);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  // Modals
  const [horseModal, setHorseModal] = useState(false);
  const [editingHorse, setEditingHorse] = useState<(Horse & { imageUrl?: string }) | null>(null);
  const [reportModal, setReportModal] = useState(false);
  const [selectedHorse, setSelectedHorse] = useState<(Horse & { imageUrl?: string }) | null>(null);
  const [detailModal, setDetailModal] = useState(false);

  const [horseForm] = Form.useForm();
  const [reportForm] = Form.useForm();

  const filtered = horses.filter((h) => {
    const match = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.owner.toLowerCase().includes(search.toLowerCase());
    return match && (!statusFilter || h.status === statusFilter);
  });

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const openAdd = () => { setEditingHorse(null); horseForm.resetFields(); setHorseModal(true); };
  const openEdit = (h: typeof horses[0]) => { setEditingHorse(h); horseForm.setFieldsValue(h); setHorseModal(true); };
  const openDetail = (h: typeof horses[0]) => { setSelectedHorse(h); setDetailModal(true); };
  const openAddReport = (h: typeof horses[0]) => { setSelectedHorse(h); reportForm.resetFields(); setReportModal(true); };

  const handleDeleteHorse = (id: string) => {
    setHorses((p) => p.filter((h) => h.id !== id));
    toast.success("Horse removed");
  };

  const handleHorseSubmit = (values: Partial<Horse> & { imageUrl?: string }) => {
    if (editingHorse) {
      setHorses((p) => p.map((h) => (h.id === editingHorse.id ? { ...h, ...values } : h)));
      toast.success("Horse updated ✅");
    } else {
      setHorses((p) => [{ id: String(Date.now()), createdAt: new Date().toISOString().split("T")[0], ...values } as typeof horses[0], ...p]);
      toast.success("Horse added ✅");
    }
    setHorseModal(false);
  };

  const handleAddReport = (values: Omit<HorseReport, "id" | "horseId">) => {
    const newReport: HorseReport = {
      id: String(Date.now()),
      horseId: selectedHorse!.id,
      ...values,
      date: new Date().toISOString().split("T")[0],
    };
    setReports((p) => [newReport, ...p]);
    toast.success("Report added ✅");
    setReportModal(false);
  };

  const getHorseReports = (horseId: string) => reports.filter((r) => r.horseId === horseId);

  // ── Columns ──────────────────────────────────────────────────────────────────
  const columns = [
    {
      title: "Horse",
      key: "horse",
      render: (_: unknown, r: typeof horses[0]) => (
        <Space>
          {r.imageUrl ? (
            <Image
              src={r.imageUrl}
              width={44} height={44}
              style={{ borderRadius: 10, objectFit: "cover" }}
              preview={false}
              // ✅ Only load when visible — no performance impact
              loading="lazy"
            />
          ) : (
            <Avatar size={44} style={{ background: "#1677ff", borderRadius: 10, fontSize: 20 }}>
              🐴
            </Avatar>
          )}
          <div>
            <Text strong style={{ cursor: "pointer", color: "#1677ff" }} onClick={() => openDetail(r)}>
              {r.name}
            </Text>
            <br />
            <Text style={{ fontSize: 12, color: "#8c8c8c" }}>{r.breed}</Text>
          </div>
        </Space>
      ),
    },
    { title: "Gender", dataIndex: "gender", key: "gender", render: (v: string) => <Tag color={v === "male" ? "blue" : "pink"}>{v}</Tag> },
    { title: "Age", dataIndex: "age", key: "age", render: (v: number) => `${v} yrs` },
    { title: "Owner", dataIndex: "owner", key: "owner" },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (v: HorseStatus) => <Badge color={STATUS_COLOR[v]} text={v.charAt(0).toUpperCase() + v.slice(1)} />,
    },
    {
      title: "Reports",
      key: "reports",
      render: (_: unknown, r: typeof horses[0]) => (
        <Tag color="blue" style={{ cursor: "pointer" }} onClick={() => openDetail(r)}>
          {getHorseReports(r.id).length} report(s)
        </Tag>
      ),
    },
    {
      title: "Actions", key: "actions",
      render: (_: unknown, r: typeof horses[0]) => (
        <Space>
          <Tooltip title="View Details">
            <Button size="small" icon={<FileTextOutlined />} onClick={() => openDetail(r)} />
          </Tooltip>
          {can(PERMISSIONS.ADD_HORSE_REPORTS) && (
            <Tooltip title="Add Report / Health Check">
              <Button size="small" icon={<MedicineBoxOutlined />} type="primary" ghost onClick={() => openAddReport(r)} />
            </Tooltip>
          )}
          {can(PERMISSIONS.MANAGE_HORSES) && (
            <>
              <Tooltip title="Edit">
                <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
              </Tooltip>
              <Tooltip title="Delete">
                <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDeleteHorse(r.id)} />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PermissionGuard permission={PERMISSIONS.VIEW_HORSES}>
      <div>
        {/* Header */}
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>Horse Management</Title>
            <Text style={{ color: "#8c8c8c" }}>Manage all horses, reports, and health records</Text>
          </div>
          {can(PERMISSIONS.MANAGE_HORSES) && (
            <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 8 }}>
              Add Horse
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card style={{ marginBottom: 16, borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <Space wrap>
            <Input prefix={<SearchOutlined />} placeholder="Search by name or owner" value={search}
              onChange={(e) => setSearch(e.target.value)} style={{ width: 260, borderRadius: 8 }} />
            <Select placeholder="Filter by status" allowClear value={statusFilter} onChange={setStatusFilter} style={{ width: 180 }}>
              {["active", "training", "resting", "injured", "inactive"].map((s) => (
                <Option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</Option>
              ))}
            </Select>
          </Space>
        </Card>

        {/* Table */}
        <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <Table dataSource={filtered} columns={columns} rowKey="id" />
        </Card>

        {/* ── Horse Detail Modal ─────────────────────────────────────────────── */}
        <Modal
          title={`🐴 ${selectedHorse?.name} — Profile`}
          open={detailModal}
          onCancel={() => setDetailModal(false)}
          footer={null}
          width={680}
        >
          {selectedHorse && (
            <Tabs defaultActiveKey="info">
              <TabPane tab="Info" key="info">
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={8}>
                    {selectedHorse.imageUrl ? (
                      <Image src={selectedHorse.imageUrl} width="100%" style={{ borderRadius: 12 }} loading="lazy" />
                    ) : (
                      <div style={{ width: "100%", height: 160, background: "#f5f6fa", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🐴</div>
                    )}
                  </Col>
                  <Col span={16}>
                    <Title level={4}>{selectedHorse.name}</Title>
                    <Space direction="vertical" size={4}>
                      <Text><strong>Breed:</strong> {selectedHorse.breed}</Text>
                      <Text><strong>Age:</strong> {selectedHorse.age} years</Text>
                      <Text><strong>Gender:</strong> {selectedHorse.gender}</Text>
                      <Text><strong>Owner:</strong> {selectedHorse.owner}</Text>
                      <Text><strong>Status:</strong> <Badge color={STATUS_COLOR[selectedHorse.status]} text={selectedHorse.status} /></Text>
                      <Text><strong>Added:</strong> {selectedHorse.createdAt}</Text>
                    </Space>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab={`Reports & Health (${getHorseReports(selectedHorse.id).length})`} key="reports">
                {can(PERMISSIONS.ADD_HORSE_REPORTS) && (
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => { setDetailModal(false); openAddReport(selectedHorse); }} style={{ marginBottom: 16 }}>
                    Add Report / Health Check
                  </Button>
                )}
                {getHorseReports(selectedHorse.id).length === 0 ? (
                  <Text style={{ color: "#8c8c8c" }}>No reports yet.</Text>
                ) : (
                  getHorseReports(selectedHorse.id).map((r) => (
                    <Card key={r.id} size="small" style={{ marginBottom: 10, borderRadius: 10 }}>
                      <Space style={{ marginBottom: 4 }}>
                        <Tag color={REPORT_TYPE_CONFIG[r.type].color}>{REPORT_TYPE_CONFIG[r.type].label}</Tag>
                        <Text style={{ fontSize: 12, color: "#8c8c8c" }}>{r.date}</Text>
                      </Space>
                      <Title level={5} style={{ margin: "4px 0" }}>{r.title}</Title>
                      <Text style={{ color: "#595959" }}>{r.description}</Text>
                      <br />
                      <Text style={{ fontSize: 12, color: "#8c8c8c" }}>By: {r.expert}</Text>
                    </Card>
                  ))
                )}
              </TabPane>
            </Tabs>
          )}
        </Modal>

        {/* ── Add/Edit Horse Modal ───────────────────────────────────────────── */}
        <Modal
          title={editingHorse ? "Edit Horse" : "Add New Horse"}
          open={horseModal} onCancel={() => setHorseModal(false)}
          onOk={() => horseForm.submit()} okText={editingHorse ? "Update" : "Add"} width={560}
        >
          <Form form={horseForm} layout="vertical" onFinish={handleHorseSubmit} style={{ marginTop: 16 }}>
            <Form.Item name="name" label="Horse Name" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
              <Select><Option value="male">Male</Option><Option value="female">Female</Option></Select>
            </Form.Item>
            <Form.Item name="breed" label="Breed" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="age" label="Age (years)" rules={[{ required: true }]}><Input type="number" min={0} /></Form.Item>
            <Form.Item name="owner" label="Owner" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>{["active","training","resting","injured","inactive"].map((s)=><Option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</Option>)}</Select>
            </Form.Item>
            <Form.Item name="imageUrl" label="Image URL (optional — from Cloudinary/Unsplash)">
              <Input placeholder="https://..." />
            </Form.Item>
          </Form>
        </Modal>

        {/* ── Add Report / Health Check Modal ───────────────────────────────── */}
        <Modal
          title={`Add Record for 🐴 ${selectedHorse?.name}`}
          open={reportModal} onCancel={() => setReportModal(false)}
          onOk={() => reportForm.submit()} okText="Add Record" width={560}
        >
          <Form form={reportForm} layout="vertical" onFinish={handleAddReport} style={{ marginTop: 16 }}>
            <Form.Item name="type" label="Record Type" rules={[{ required: true }]}>
              <Select>
                <Option value="report">📊 Performance Report</Option>
                <Option value="health_check">🩺 Health Check</Option>
                <Option value="vaccination">💉 Vaccination</Option>
                <Option value="treatment">🩹 Treatment</Option>
              </Select>
            </Form.Item>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="description" label="Description / Notes" rules={[{ required: true }]}>
              <Input.TextArea rows={4} placeholder="Enter detailed notes..." />
            </Form.Item>
            <Form.Item name="expert" label="Expert / Veterinarian" rules={[{ required: true }]}><Input /></Form.Item>
          </Form>
        </Modal>
      </div>
    </PermissionGuard>
  );
}
