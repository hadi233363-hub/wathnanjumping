"use client";

import { Layout, Input, Badge, Avatar, Typography, Space } from "antd";
import { BellOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/store/hooks";
import { usePathname } from "next/navigation";

const { Header } = Layout;
const { Text } = Typography;

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/users": "User Management",
  "/horses": "Horse Management",
  "/media-library": "Media Library",
  "/booking-management": "Booking Management",
  "/wellness": "Wellness",
  "/inventory": "Inventory",
  "/finance": "Finance",
  "/reimbursement": "Reimbursement",
  "/reports": "Reports",
  "/notifications": "Notifications",
  "/audit": "Audit Logs",
  "/settings": "Settings",
};

export default function AppHeader() {
  const user = useAppSelector((s) => s.auth.user);
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname] ?? "Blue Atlantic";

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: 64,
      }}
    >
      {/* Left: Page Title */}
      <Text style={{ fontWeight: 700, fontSize: 18, color: "#1a1a2e" }}>
        {pageTitle}
      </Text>

      {/* Right: Search + Bell + User */}
      <Space size={16}>
        <Input
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          placeholder="Search..."
          style={{ width: 220, borderRadius: 8, background: "#f5f6fa", border: "none" }}
        />

        <Badge count={3} size="small">
          <BellOutlined style={{ fontSize: 20, color: "#595959", cursor: "pointer" }} />
        </Badge>

        <Space size={8}>
          <Avatar size={36} icon={<UserOutlined />} style={{ background: "#1677ff" }} />
          {user && (
            <Text style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</Text>
          )}
        </Space>
      </Space>
    </Header>
  );
}
