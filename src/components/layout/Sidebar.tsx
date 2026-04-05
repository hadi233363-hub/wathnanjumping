"use client";

import { useState } from "react";
import { Layout, Menu, Switch, Avatar, Button, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/types/permissions";
import { useDarkMode } from "@/components/layout/DarkModeProvider";
import {
  DashboardOutlined, UserOutlined, CalendarOutlined, HeartOutlined,
  InboxOutlined, DollarOutlined, FileTextOutlined, PictureOutlined,
  BellOutlined, AuditOutlined, SettingOutlined, LogoutOutlined,
  BulbOutlined, WalletOutlined, SafetyOutlined, FileDoneOutlined, TrophyOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { Text } = Typography;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode, setDarkMode } = useDarkMode();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { can } = usePermissions();

  const handleLogout = () => { dispatch(logout()); router.push("/login"); };

  const mainItems = [
    can(PERMISSIONS.VIEW_DASHBOARD)    && { key: "/",                   label: "Dashboard",      icon: <DashboardOutlined /> },
    can(PERMISSIONS.MANAGE_USERS)      && { key: "/users",              label: "Users",          icon: <UserOutlined /> },
    can(PERMISSIONS.VIEW_HORSES)       && { key: "/horses",             label: "Horses",         icon: <span>🐴</span> },
    can(PERMISSIONS.VIEW_BOOKINGS)     && { key: "/booking-management", label: "Bookings",       icon: <CalendarOutlined /> },
    can(PERMISSIONS.VIEW_WELLNESS)     && { key: "/wellness",           label: "Wellness",       icon: <HeartOutlined /> },
    can(PERMISSIONS.VIEW_INVOICES)     && { key: "/invoices",           label: "Invoices",       icon: <FileDoneOutlined /> },
    can(PERMISSIONS.VIEW_FINANCE)      && { key: "/finance",            label: "Finance",        icon: <DollarOutlined /> },
    can(PERMISSIONS.VIEW_REIMBURSEMENT)&& { key: "/reimbursement",      label: "Reimbursement",  icon: <WalletOutlined /> },
    can(PERMISSIONS.VIEW_INVENTORY)    && { key: "/inventory",          label: "Inventory",      icon: <InboxOutlined /> },
    can(PERMISSIONS.VIEW_REPORTS)      && { key: "/reports",            label: "Reports",        icon: <FileTextOutlined /> },
    can(PERMISSIONS.VIEW_MEDIA)        && { key: "/media-library",      label: "Media Library",  icon: <PictureOutlined /> },
    can(PERMISSIONS.VIEW_BOOKINGS)     && { key: "/championships",      label: "Championships",  icon: <TrophyOutlined /> },
  ].filter(Boolean) as { key: string; label: string; icon: React.ReactNode }[];

  const otherItems = [
    can(PERMISSIONS.VIEW_NOTIFICATIONS)&& { key: "/notifications", label: "Notifications", icon: <BellOutlined /> },
    can(PERMISSIONS.VIEW_AUDIT)        && { key: "/audit",          label: "Audit Logs",   icon: <AuditOutlined /> },
    can(PERMISSIONS.MANAGE_ROLES)      && { key: "/roles",          label: "Permissions",  icon: <SafetyOutlined /> },
    can(PERMISSIONS.MANAGE_SETTINGS)   && { key: "/settings",       label: "Settings",     icon: <SettingOutlined /> },
  ].filter(Boolean) as { key: string; label: string; icon: React.ReactNode }[];

  const menuItems = [
    {
      type: "group" as const,
      label: !collapsed
        ? <Text style={{ fontSize: 10, color: darkMode ? "#555" : "#aaa", letterSpacing: 1.2, fontWeight: 700 }}>MAIN MENU</Text>
        : null,
      children: mainItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
        onClick: () => router.push(item.key),
      })),
    },
    { type: "divider" as const },
    {
      type: "group" as const,
      label: !collapsed
        ? <Text style={{ fontSize: 10, color: darkMode ? "#555" : "#aaa", letterSpacing: 1.2, fontWeight: 700 }}>OTHERS</Text>
        : null,
      children: otherItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
        onClick: () => router.push(item.key),
      })),
    },
  ];

  return (
    <Sider
      collapsible collapsed={collapsed} onCollapse={setCollapsed}
      width={220} theme={darkMode ? "dark" : "light"}
      style={{
        minHeight: "100vh", position: "sticky", top: 0, left: 0, overflow: "auto",
        borderRight: darkMode ? "1px solid #1f1f1f" : "1px solid #f0f0f0",
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? "18px 8px" : "18px 20px",
        display: "flex", alignItems: "center", gap: 10,
        borderBottom: darkMode ? "1px solid #1f1f1f" : "1px solid #f0f0f0",
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, #1677ff, #0050d0)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 800, fontSize: 17,
        }}>B</div>
        {!collapsed && <Text style={{ fontWeight: 800, fontSize: 15, color: "#1677ff" }}>Blue Atlantic</Text>}
      </div>

      {/* Menu */}
      <Menu
        mode="inline" selectedKeys={[pathname]} items={menuItems}
        theme={darkMode ? "dark" : "light"}
        style={{ border: "none", paddingTop: 8, flex: 1 }}
      />

      {/* Bottom */}
      <div style={{
        padding: collapsed ? "12px 8px" : "12px 16px",
        borderTop: darkMode ? "1px solid #1f1f1f" : "1px solid #f0f0f0",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {/* Dark Mode Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BulbOutlined style={{ color: "#faad14", fontSize: 16 }} />
          {!collapsed && <Text style={{ fontSize: 13, flex: 1 }}>Dark Mode</Text>}
          {!collapsed && (
            <Switch
              size="small"
              checked={darkMode}
              onChange={setDarkMode}
              style={{ background: darkMode ? "#1677ff" : undefined }}
            />
          )}
        </div>

        {/* User */}
        {user && !collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar size={30} icon={<UserOutlined />} style={{ background: "#1677ff", flexShrink: 0 }} />
            <div style={{ overflow: "hidden" }}>
              <Text style={{ display: "block", fontSize: 13, fontWeight: 600 }} ellipsis>{user.name}</Text>
              <Text style={{ fontSize: 11, color: "#8c8c8c" }}>{user.role}</Text>
            </div>
          </div>
        )}

        {/* Logout */}
        <Button danger type="text" icon={<LogoutOutlined />} onClick={handleLogout}
          style={{ textAlign: "left", paddingLeft: collapsed ? 4 : 8 }}>
          {!collapsed && "Logout"}
        </Button>
      </div>
    </Sider>
  );
}
