"use client";

import { Card, Row, Col, Table, Tag, Typography, Space, Badge } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarOutlined,
  HeartOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import StatsCard from "@/components/shared/StatsCard";

const { Text, Title } = Typography;

// ── Mock Stats ─────────────────────────────────────────────────────────────────
const stats = [
  { title: "Total Horses", value: 48, icon: "🐴", color: "#1677ff", trend: { value: 12, label: "this month" } },
  { title: "Total Users", value: 124, icon: <UserOutlined />, color: "#52c41a", trend: { value: 8, label: "this month" } },
  { title: "Active Bookings", value: 36, icon: <CalendarOutlined />, color: "#faad14", trend: { value: 5, label: "this week" } },
  { title: "Pending Reports", value: 12, icon: <FileTextOutlined />, color: "#ff4d4f", trend: { value: -3, label: "vs last week" } },
  { title: "Monthly Revenue", value: "$18,240", icon: <DollarOutlined />, color: "#722ed1", trend: { value: 15, label: "vs last month" } },
  { title: "Wellness Sessions", value: 89, icon: <HeartOutlined />, color: "#13c2c2", trend: { value: 22, label: "this month" } },
];

// ── Mock Recent Bookings ───────────────────────────────────────────────────────
const recentBookings = [
  { key: "1", horse: "Storm", expert: "Dr. Khalid", type: "Physio", status: "confirmed", date: "2026-04-05" },
  { key: "2", horse: "Luna", expert: "Sara Hassan", type: "Workout", status: "pending", date: "2026-04-06" },
  { key: "3", horse: "Thunder", expert: "Dr. Amira", type: "Both", status: "confirmed", date: "2026-04-07" },
  { key: "4", horse: "Bella", expert: "Mohammed Ali", type: "Physio", status: "canceled", date: "2026-04-08" },
  { key: "5", horse: "Shadow", expert: "Dr. Khalid", type: "Workout", status: "confirmed", date: "2026-04-09" },
];

const bookingColumns = [
  { title: "Horse", dataIndex: "horse", key: "horse", render: (v: string) => <Text strong>{v}</Text> },
  { title: "Expert", dataIndex: "expert", key: "expert" },
  { title: "Type", dataIndex: "type", key: "type" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (v: string) => {
      const color = v === "confirmed" ? "green" : v === "pending" ? "orange" : "red";
      return <Tag color={color}>{v.toUpperCase()}</Tag>;
    },
  },
  { title: "Date", dataIndex: "date", key: "date" },
];

// ── Mock Horse Health ──────────────────────────────────────────────────────────
const horseHealth = [
  { key: "1", name: "Storm", status: "active", lastCheck: "2026-03-28", vet: "Dr. Amira" },
  { key: "2", name: "Luna", status: "injured", lastCheck: "2026-04-01", vet: "Dr. Khalid" },
  { key: "3", name: "Thunder", status: "training", lastCheck: "2026-03-25", vet: "Dr. Amira" },
  { key: "4", name: "Bella", status: "active", lastCheck: "2026-04-03", vet: "Dr. Hana" },
];

const healthColumns = [
  { title: "Horse", dataIndex: "name", key: "name", render: (v: string) => <Text strong>🐴 {v}</Text> },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (v: string) => {
      const map: Record<string, string> = {
        active: "green",
        injured: "red",
        training: "blue",
        resting: "orange",
      };
      return <Badge color={map[v] || "default"} text={v} />;
    },
  },
  { title: "Last Check", dataIndex: "lastCheck", key: "lastCheck" },
  { title: "Veterinarian", dataIndex: "vet", key: "vet" },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <Title level={4} style={{ margin: 0 }}>Welcome back 👋</Title>
        <Text style={{ color: "#8c8c8c" }}>Here's what's happening at Blue Atlantic today.</Text>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {stats.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      {/* Tables */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <CalendarOutlined style={{ color: "#1677ff" }} />
                <Text strong>Recent Bookings</Text>
              </Space>
            }
            style={{ borderRadius: 16, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <Table
              dataSource={recentBookings}
              columns={bookingColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={
              <Space>
                <span>🐴</span>
                <Text strong>Horse Health Status</Text>
              </Space>
            }
            style={{ borderRadius: 16, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <Table
              dataSource={horseHealth}
              columns={healthColumns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
