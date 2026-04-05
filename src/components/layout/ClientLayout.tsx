"use client";

import { Layout } from "antd";
import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";
import { useDarkMode } from "./DarkModeProvider";

const { Content } = Layout;

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { darkMode } = useDarkMode();

  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }}>
      <Sidebar />
      <Layout style={{ background: "transparent" }}>
        <AppHeader />
        <Content
          style={{
            padding: 24,
            background: darkMode ? "#1a1a1a" : "#f5f6fa",
            minHeight: "calc(100vh - 64px)",
            transition: "background 0.3s",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
