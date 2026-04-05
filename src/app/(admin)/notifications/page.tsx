"use client";

import { Card, List, Badge, Typography, Tag, Space, Button } from "antd";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Text, Title } = Typography;

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  time: string;
}

const initialNotifications: Notification[] = [
  { id: "1", title: "New Booking", message: "Storm has been booked for physio on Apr 6.", type: "info", read: false, time: "2 hours ago" },
  { id: "2", title: "Low Stock Alert", message: "Horse Feed Mix is running low (15 kg remaining).", type: "warning", read: false, time: "4 hours ago" },
  { id: "3", title: "Report Approved", message: "Luna's Recovery Update has been approved.", type: "success", read: true, time: "Yesterday" },
  { id: "4", title: "Expense Rejected", message: "Transport expense was rejected by finance.", type: "error", read: true, time: "Yesterday" },
  { id: "5", title: "Wellness Session", message: "Thunder's workout session completed successfully.", type: "success", read: true, time: "2 days ago" },
];

const TYPE_COLOR: Record<string, string> = { info: "blue", warning: "orange", success: "green", error: "red" };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Notifications <Badge count={unread} style={{ marginLeft: 8 }} />
          </Title>
          <Text style={{ color: "#8c8c8c" }}>Stay updated on platform activity</Text>
        </div>
        <Button icon={<CheckOutlined />} onClick={markAllRead}>Mark All Read</Button>
      </div>

      <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              style={{
                background: item.read ? "transparent" : "#f0f7ff",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 8,
                cursor: "pointer",
              }}
              onClick={() => markRead(item.id)}
            >
              <Space align="start" style={{ width: "100%" }}>
                <BellOutlined style={{ fontSize: 20, color: TYPE_COLOR[item.type] === "blue" ? "#1677ff" : TYPE_COLOR[item.type] === "orange" ? "#faad14" : TYPE_COLOR[item.type] === "green" ? "#52c41a" : "#ff4d4f", marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <Space>
                    <Text strong>{item.title}</Text>
                    <Tag color={TYPE_COLOR[item.type]}>{item.type}</Tag>
                    {!item.read && <Badge color="blue" text="New" />}
                  </Space>
                  <br />
                  <Text style={{ color: "#595959" }}>{item.message}</Text>
                  <br />
                  <Text style={{ fontSize: 12, color: "#8c8c8c" }}>{item.time}</Text>
                </div>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
