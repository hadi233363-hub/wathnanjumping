"use client";

import { Card, Table, Tag, Typography, Input, Space } from "antd";
import { SearchOutlined, AuditOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Text, Title } = Typography;

const logs = [
  { id: "1", action: "LOGIN", user: "Ahmed Al-Rashidi", resource: "Auth", detail: "Successful login", ip: "192.168.1.10", timestamp: "2026-04-05 08:02:00" },
  { id: "2", action: "CREATE", user: "Sara Hassan", resource: "Horse", detail: "Added horse: Zara", ip: "192.168.1.15", timestamp: "2026-04-05 09:15:32" },
  { id: "3", action: "UPDATE", user: "Ahmed Al-Rashidi", resource: "Booking", detail: "Updated booking #B-003 status to confirmed", ip: "192.168.1.10", timestamp: "2026-04-05 10:30:18" },
  { id: "4", action: "APPROVE", user: "Khalid Al-Mansouri", resource: "Report", detail: "Approved report: Luna Recovery Update", ip: "192.168.1.22", timestamp: "2026-04-04 14:22:00" },
  { id: "5", action: "DELETE", user: "Ahmed Al-Rashidi", resource: "Inventory", detail: "Removed item: Old Antibiotics batch", ip: "192.168.1.10", timestamp: "2026-04-04 16:00:45" },
  { id: "6", action: "REJECT", user: "Khalid Al-Mansouri", resource: "Expense", detail: "Rejected expense: Transport", ip: "192.168.1.22", timestamp: "2026-04-03 11:45:00" },
  { id: "7", action: "LOGOUT", user: "Sara Hassan", resource: "Auth", detail: "User logged out", ip: "192.168.1.15", timestamp: "2026-04-03 17:00:00" },
];

const ACTION_COLOR: Record<string, string> = {
  LOGIN: "green", LOGOUT: "default", CREATE: "blue", UPDATE: "orange",
  DELETE: "red", APPROVE: "cyan", REJECT: "volcano",
};

export default function AuditPage() {
  const [search, setSearch] = useState("");

  const filtered = logs.filter((l) =>
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.resource.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: "Action", dataIndex: "action", key: "action", render: (v: string) => <Tag color={ACTION_COLOR[v]}>{v}</Tag> },
    { title: "User", dataIndex: "user", key: "user", render: (v: string) => <Text strong>{v}</Text> },
    { title: "Resource", dataIndex: "resource", key: "resource" },
    { title: "Detail", dataIndex: "detail", key: "detail", render: (v: string) => <Text style={{ color: "#595959" }}>{v}</Text> },
    { title: "IP Address", dataIndex: "ip", key: "ip", render: (v: string) => <Text style={{ fontFamily: "monospace", fontSize: 12 }}>{v}</Text> },
    { title: "Timestamp", dataIndex: "timestamp", key: "timestamp", render: (v: string) => <Text style={{ fontSize: 12, color: "#8c8c8c" }}>{v}</Text> },
  ];

  return (
    <div>
      <div className="page-header">
        <Title level={4} style={{ margin: 0 }}>Audit Logs</Title>
        <Text style={{ color: "#8c8c8c" }}>Complete system activity trail</Text>
      </div>

      <Card style={{ marginBottom: 16, borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Input prefix={<SearchOutlined />} placeholder="Search by user, action, or resource" value={search}
          onChange={(e) => setSearch(e.target.value)} style={{ width: 320, borderRadius: 8 }} />
      </Card>

      <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Table dataSource={filtered} columns={columns} rowKey="id" scroll={{ x: true }} />
      </Card>
    </div>
  );
}
