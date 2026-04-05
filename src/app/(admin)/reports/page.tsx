"use client";

import { useState } from "react";
import { Card, Table, Tag, Button, Input, Select, Space, Typography, Popconfirm } from "antd";
import { PlusOutlined, SearchOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { Report, ReportStatus } from "@/types";
import StatsCard from "@/components/shared/StatsCard";
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const { Text, Title } = Typography;
const { Option } = Select;

const initialReports: Report[] = [
  { id: "1", title: "Storm — Monthly Physio Report", type: "Physio", expertName: "Dr. Khalid", horseName: "Storm", sessionId: "S-001", date: "2026-04-05", status: "pending", tag: "Health" },
  { id: "2", title: "Luna — Recovery Update", type: "Injury", expertName: "Sara Hassan", horseName: "Luna", sessionId: "S-002", date: "2026-04-03", status: "approved", tag: "Recovery" },
  { id: "3", title: "Thunder — Workout Performance", type: "Workout", expertName: "Dr. Amira", horseName: "Thunder", sessionId: "S-003", date: "2026-04-01", status: "pending", tag: "Training" },
  { id: "4", title: "Bella — Vaccination Record", type: "Checkup", expertName: "Mohammed Ali", horseName: "Bella", sessionId: "S-004", date: "2026-03-28", status: "approved", tag: "Vaccination" },
  { id: "5", title: "Shadow — Treatment Plan", type: "Treatment", expertName: "Dr. Khalid", horseName: "Shadow", sessionId: "S-005", date: "2026-03-25", status: "rejected", tag: "Treatment" },
];

const STATUS_COLOR: Record<ReportStatus, string> = { approved: "green", pending: "orange", rejected: "red" };

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const router = useRouter();

  const filtered = reports.filter((r) => {
    const match = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.horseName.toLowerCase().includes(search.toLowerCase()) ||
      r.expertName.toLowerCase().includes(search.toLowerCase());
    return match && (!statusFilter || r.status === statusFilter);
  });

  const updateStatus = (id: string, status: ReportStatus) => {
    setReports((p) => p.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Report ${status}`);
  };

  const handleDelete = (id: string) => {
    setReports((p) => p.filter((r) => r.id !== id));
    toast.success("Report deleted");
  };

  const totals = { total: reports.length, pending: reports.filter(r => r.status === "pending").length, approved: reports.filter(r => r.status === "approved").length, experts: new Set(reports.map(r => r.expertName)).size };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title", render: (v: string) => <Text strong>{v}</Text> },
    { title: "Type", dataIndex: "type", key: "type", render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: "Expert", dataIndex: "expertName", key: "expertName" },
    { title: "Horse", dataIndex: "horseName", key: "horseName", render: (v: string) => `🐴 ${v}` },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Tag", dataIndex: "tag", key: "tag", render: (v: string) => <Tag>{v}</Tag> },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (v: ReportStatus) => <Tag color={STATUS_COLOR[v]}>{v.toUpperCase()}</Tag>,
    },
    {
      title: "Actions", key: "actions",
      render: (_: unknown, r: Report) => (
        <Space>
          {r.status === "pending" && (
            <>
              <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => updateStatus(r.id, "approved")}>Approve</Button>
              <Button size="small" danger icon={<CloseOutlined />} onClick={() => updateStatus(r.id, "rejected")}>Reject</Button>
            </>
          )}
          <Popconfirm title="Delete this report?" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Reports Log</Title>
          <Text style={{ color: "#8c8c8c" }}>Manage all reports in the platform</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/reports/create")} style={{ borderRadius: 8 }}>Quick Add</Button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <StatsCard title="Total Reports" value={totals.total} icon={<FileTextOutlined />} color="#1677ff" />
        <StatsCard title="Pending Review" value={totals.pending} icon={<ClockCircleOutlined />} color="#faad14" />
        <StatsCard title="Approved This Week" value={totals.approved} icon={<CheckCircleOutlined />} color="#52c41a" />
        <StatsCard title="Expert Contributors" value={totals.experts} icon={<UserOutlined />} color="#722ed1" />
      </div>

      <Card style={{ marginBottom: 16, borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Space wrap>
          <Input prefix={<SearchOutlined />} placeholder="Search by title, horse, or expert" value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ width: 320, borderRadius: 8 }} />
          <Select placeholder="Select Status" allowClear value={statusFilter} onChange={setStatusFilter} style={{ width: 180 }}>
            <Option value="approved">Approved</Option>
            <Option value="pending">Pending</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
        </Space>
      </Card>

      <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Table dataSource={filtered} columns={columns} rowKey="id" scroll={{ x: true }} />
      </Card>
    </div>
  );
}
