"use client";

import { useState } from "react";
import { Tag, Typography, Input, Select, Space, Modal, Badge, Row, Col } from "antd";
import {
  SearchOutlined, TrophyOutlined, EnvironmentOutlined,
  CalendarOutlined, FireOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

type QualStatus = "qualified" | "pending" | "competing" | "completed" | "withdrawn";

interface Championship {
  id: string;
  tournamentName: string;
  location: string;
  country: string;
  flag: string;
  date: string;
  endDate: string;
  category: string;
  riderName: string;
  horseName: string;
  horseBreed: string;
  status: QualStatus;
  prize?: string;
  result?: string;
  description?: string;
}

const championships: Championship[] = [
  {
    id: "1",
    tournamentName: "Gulf Arabian Championship 2026",
    location: "Riyadh", country: "Saudi Arabia", flag: "🇸🇦",
    date: "2026-05-10", endDate: "2026-05-15",
    category: "Speed Racing",
    riderName: "Ahmed Al-Rashidi",
    horseName: "Storm", horseBreed: "Arabian",
    status: "qualified",
    prize: "$50,000",
    description: "The most prestigious Arabian speed race in the Gulf region.",
  },
  {
    id: "2",
    tournamentName: "International Dressage Open",
    location: "Dubai", country: "UAE", flag: "🇦🇪",
    date: "2026-05-20", endDate: "2026-05-23",
    category: "Dressage",
    riderName: "Sara Hassan",
    horseName: "Luna", horseBreed: "Thoroughbred",
    status: "pending",
    prize: "$30,000",
    description: "An international showcase of the finest dressage horses.",
  },
  {
    id: "3",
    tournamentName: "National Endurance Cup 100km",
    location: "Jeddah", country: "Saudi Arabia", flag: "🇸🇦",
    date: "2026-04-28", endDate: "2026-04-28",
    category: "Endurance",
    riderName: "Fatima Noor",
    horseName: "Bella", horseBreed: "Arabian",
    status: "competing",
    prize: "$25,000",
    description: "100km endurance challenge through the desert terrain.",
  },
  {
    id: "4",
    tournamentName: "Spring Classic Show Jumping",
    location: "Abu Dhabi", country: "UAE", flag: "🇦🇪",
    date: "2026-04-15", endDate: "2026-04-17",
    category: "Show Jumping",
    riderName: "Khalid Al-Mansouri",
    horseName: "Thunder", horseBreed: "Warmblood",
    status: "completed",
    prize: "$15,000",
    result: "🥇 1st Place",
    description: "Spring season show jumping — Thunder delivered a flawless performance.",
  },
  {
    id: "5",
    tournamentName: "Desert Challenge Cup",
    location: "Riyadh", country: "Saudi Arabia", flag: "🇸🇦",
    date: "2026-06-05", endDate: "2026-06-06",
    category: "Speed Racing",
    riderName: "Mohammed Talib",
    horseName: "Shadow", horseBreed: "Quarter Horse",
    status: "qualified",
    prize: "$20,000",
    description: "High-speed sprint competition under desert conditions.",
  },
];

const STATUS_CONFIG: Record<QualStatus, { color: string; label: string; glow: string }> = {
  qualified:  { color: "#52c41a", label: "✅ Qualified",   glow: "rgba(82,196,26,0.3)" },
  pending:    { color: "#faad14", label: "⏳ Pending",      glow: "rgba(250,173,20,0.3)" },
  competing:  { color: "#1677ff", label: "🏇 Live Now!",   glow: "rgba(22,119,255,0.4)" },
  completed:  { color: "#722ed1", label: "🏁 Completed",   glow: "rgba(114,46,209,0.3)" },
  withdrawn:  { color: "#ff4d4f", label: "❌ Withdrawn",    glow: "rgba(255,77,79,0.3)" },
};

const CAT_COLORS: Record<string, string> = {
  "Speed Racing": "#ff4d4f",
  "Dressage":     "#722ed1",
  "Endurance":    "#13c2c2",
  "Show Jumping": "#1677ff",
  "Reining":      "#fa8c16",
  "Polo":         "#52c41a",
};

export default function PublicChampionshipsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [selected, setSelected] = useState<Championship | null>(null);

  const filtered = championships.filter((c) => {
    const match =
      c.tournamentName.toLowerCase().includes(search.toLowerCase()) ||
      c.riderName.toLowerCase().includes(search.toLowerCase()) ||
      c.horseName.toLowerCase().includes(search.toLowerCase());
    return match &&
      (!statusFilter || c.status === statusFilter) &&
      (!categoryFilter || c.category === categoryFilter);
  });

  const live = championships.filter((c) => c.status === "competing");
  const upcoming = championships.filter((c) => c.status === "qualified" || c.status === "pending");

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px", background: "#0f0f0f",
        borderBottom: "1px solid #1a1a1a", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #1677ff, #0050d0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 900, fontSize: 16,
          }}>B</div>
          <Text style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>Blue Atlantic</Text>
        </div>
        <Space>
          <a href="/showcase" style={{ color: "#888", fontSize: 13, textDecoration: "none" }}>Our Horses</a>
          <a href="/public-championships" style={{ color: "#1677ff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Championships</a>
        </Space>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{
        padding: "56px 40px 48px",
        background: "linear-gradient(135deg, #0a0a0a, #0d1a2e)",
        textAlign: "center",
        borderBottom: "1px solid #111",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 500, height: 300,
          background: "radial-gradient(ellipse, rgba(22,119,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <TrophyOutlined style={{ fontSize: 48, color: "#FFD700", marginBottom: 16 }} />
        <Title style={{ color: "#fff", margin: 0, fontSize: 40, fontWeight: 900 }}>
          Championships
        </Title>
        <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, display: "block", marginTop: 8 }}>
          Follow our riders & horses in competitions around the world
        </Text>

        {/* Quick stats */}
        <div style={{
          display: "inline-flex", gap: 36, marginTop: 32,
          background: "rgba(255,255,255,0.04)",
          padding: "14px 36px", borderRadius: 50,
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
          {[
            { value: championships.length,   label: "Total Entries" },
            { value: live.length,             label: "Live Now 🔴", color: "#ff4d4f" },
            { value: upcoming.length,         label: "Upcoming" },
            { value: championships.filter(c => c.status === "completed").length, label: "Completed" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <Text style={{ color: s.color || "#1677ff", fontSize: 24, fontWeight: 800, display: "block" }}>{s.value}</Text>
              <Text style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{s.label}</Text>
            </div>
          ))}
        </div>
      </div>

      {/* ── Live Now Banner ───────────────────────────────────────────────────── */}
      {live.length > 0 && (
        <div style={{
          background: "linear-gradient(90deg, #0d2137, #001529)",
          borderBottom: "1px solid #1677ff30",
          padding: "14px 40px",
          display: "flex", alignItems: "center", gap: 16, overflowX: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff4d4f", animation: "pulse 1s infinite" }} />
            <Text style={{ color: "#ff4d4f", fontWeight: 700, fontSize: 13 }}>LIVE NOW</Text>
          </div>
          {live.map((c) => (
            <div key={c.id} style={{
              padding: "6px 16px", borderRadius: 20, flexShrink: 0,
              background: "rgba(22,119,255,0.15)",
              border: "1px solid rgba(22,119,255,0.3)",
              cursor: "pointer",
            }} onClick={() => setSelected(c)}>
              <Text style={{ color: "#fff", fontSize: 13 }}>
                🐴 {c.horseName} · {c.riderName} · {c.tournamentName}
              </Text>
            </div>
          ))}
        </div>
      )}

      {/* ── Filters ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: "20px 40px", background: "#111", borderBottom: "1px solid #1a1a1a" }}>
        <Space wrap>
          <Input
            prefix={<SearchOutlined style={{ color: "#444" }} />}
            placeholder="Search tournaments, riders, horses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 280, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }}
          />
          <Select placeholder="All Statuses" allowClear value={statusFilter} onChange={setStatusFilter} style={{ width: 160 }}>
            {(Object.keys(STATUS_CONFIG) as QualStatus[]).map((k) => (
              <Option key={k} value={k}>{STATUS_CONFIG[k].label}</Option>
            ))}
          </Select>
          <Select placeholder="All Categories" allowClear value={categoryFilter} onChange={setCategoryFilter} style={{ width: 160 }}>
            {Object.keys(CAT_COLORS).map((c) => <Option key={c} value={c}>{c}</Option>)}
          </Select>
        </Space>
      </div>

      {/* ── Cards ────────────────────────────────────────────────────────────── */}
      <div style={{ padding: "36px 40px" }}>
        <Row gutter={[20, 20]}>
          {filtered.map((c) => (
            <Col key={c.id} xs={24} sm={12} lg={8}>
              <div
                onClick={() => setSelected(c)}
                style={{
                  background: "#141414",
                  border: `1px solid ${c.status === "competing" ? "#1677ff40" : "#1f1f1f"}`,
                  borderRadius: 16, padding: 22, cursor: "pointer",
                  transition: "all 0.25s",
                  boxShadow: c.status === "competing" ? `0 0 20px ${STATUS_CONFIG[c.status].glow}` : "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#1677ff50";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = c.status === "competing" ? "#1677ff40" : "#1f1f1f";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {/* Top Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <Tag style={{
                    background: `${CAT_COLORS[c.category] || "#1677ff"}20`,
                    border: `1px solid ${CAT_COLORS[c.category] || "#1677ff"}40`,
                    color: CAT_COLORS[c.category] || "#1677ff",
                    borderRadius: 6, fontSize: 11, fontWeight: 600,
                  }}>
                    {c.category}
                  </Tag>
                  <div style={{
                    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: `${STATUS_CONFIG[c.status].color}20`,
                    border: `1px solid ${STATUS_CONFIG[c.status].color}40`,
                    color: STATUS_CONFIG[c.status].color,
                  }}>
                    {STATUS_CONFIG[c.status].label}
                  </div>
                </div>

                {/* Tournament Name */}
                <Title level={5} style={{ color: "#fff", margin: "0 0 6px", lineHeight: 1.4 }}>
                  {c.tournamentName}
                </Title>

                {/* Location & Date */}
                <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                  <Text style={{ color: "#555", fontSize: 12 }}>
                    <EnvironmentOutlined /> {c.flag} {c.location}
                  </Text>
                  <Text style={{ color: "#555", fontSize: 12 }}>
                    <CalendarOutlined /> {c.date}
                  </Text>
                </div>

                {/* Rider & Horse */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
                  padding: "12px 14px",
                  background: "#1a1a1a", borderRadius: 10,
                  marginBottom: 14,
                }}>
                  <div>
                    <Text style={{ color: "#555", fontSize: 11, display: "block" }}>Rider</Text>
                    <Text style={{ color: "#ddd", fontSize: 13, fontWeight: 600 }}>👤 {c.riderName}</Text>
                  </div>
                  <div>
                    <Text style={{ color: "#555", fontSize: 11, display: "block" }}>Horse</Text>
                    <Text style={{ color: "#ddd", fontSize: 13, fontWeight: 600 }}>🐴 {c.horseName}</Text>
                  </div>
                </div>

                {/* Prize & Result */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {c.prize && (
                    <Text style={{ color: "#52c41a", fontSize: 13, fontWeight: 700 }}>
                      💰 {c.prize}
                    </Text>
                  )}
                  {c.result && (
                    <Text style={{ fontSize: 18 }}>{c.result}</Text>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <div style={{
        textAlign: "center", padding: "28px 40px",
        borderTop: "1px solid #1a1a1a",
      }}>
        <Space size={24} style={{ marginBottom: 10 }}>
          <a href="/showcase" style={{ color: "#555", fontSize: 13, textDecoration: "none" }}>Our Horses</a>
          <a href="/public-championships" style={{ color: "#555", fontSize: 13, textDecoration: "none" }}>Championships</a>
        </Space>
        <br />
        <Text style={{ color: "#2a2a2a", fontSize: 13 }}>© 2026 Blue Atlantic Equestrian Club</Text>
      </div>

      {/* ── Detail Modal ─────────────────────────────────────────────────────── */}
      <Modal
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={null}
        width={560}
        styles={{ body: { background: "#111", padding: 0 } }}
        style={{ top: 60 }}
      >
        {selected && (
          <div style={{ background: "#111", borderRadius: 16, overflow: "hidden" }}>
            {/* Header */}
            <div style={{
              padding: "28px 28px 20px",
              background: `linear-gradient(135deg, #141414, #0d1a2e)`,
              borderBottom: "1px solid #1a1a1a",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <Tag style={{
                  background: `${CAT_COLORS[selected.category]}20`,
                  border: `1px solid ${CAT_COLORS[selected.category]}40`,
                  color: CAT_COLORS[selected.category], borderRadius: 6, fontWeight: 600,
                }}>{selected.category}</Tag>
                <div style={{
                  padding: "4px 12px", borderRadius: 20,
                  background: `${STATUS_CONFIG[selected.status].color}20`,
                  color: STATUS_CONFIG[selected.status].color, fontWeight: 700, fontSize: 13,
                }}>{STATUS_CONFIG[selected.status].label}</div>
              </div>
              <Title level={4} style={{ color: "#fff", margin: 0 }}>{selected.tournamentName}</Title>
              {selected.result && (
                <div style={{ marginTop: 10, fontSize: 28 }}>{selected.result}</div>
              )}
            </div>

            <div style={{ padding: "24px 28px" }}>
              {/* Description */}
              {selected.description && (
                <Text style={{ color: "#888", lineHeight: 1.7, display: "block", marginBottom: 20 }}>
                  {selected.description}
                </Text>
              )}

              {/* Details Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Location", value: `${selected.flag} ${selected.location}, ${selected.country}` },
                  { label: "Start Date", value: selected.date },
                  { label: "End Date", value: selected.endDate },
                  { label: "Prize Pool", value: selected.prize || "—" },
                ].map((d) => (
                  <div key={d.label} style={{ padding: 14, background: "#1a1a1a", borderRadius: 10 }}>
                    <Text style={{ color: "#555", fontSize: 11, display: "block" }}>{d.label}</Text>
                    <Text style={{ color: "#ddd", fontWeight: 600 }}>{d.value}</Text>
                  </div>
                ))}
              </div>

              {/* Rider & Horse */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{
                  padding: 18, background: "#1a1a1a", borderRadius: 12,
                  textAlign: "center", border: "1px solid #2a2a2a",
                }}>
                  <Text style={{ fontSize: 32 }}>👤</Text>
                  <Text style={{ display: "block", color: "#fff", fontWeight: 700, marginTop: 6 }}>
                    {selected.riderName}
                  </Text>
                  <Text style={{ color: "#555", fontSize: 12 }}>Rider</Text>
                </div>
                <div style={{
                  padding: 18, background: "#1a1a1a", borderRadius: 12,
                  textAlign: "center", border: "1px solid #2a2a2a",
                }}>
                  <Text style={{ fontSize: 32 }}>🐴</Text>
                  <Text style={{ display: "block", color: "#fff", fontWeight: 700, marginTop: 6 }}>
                    {selected.horseName}
                  </Text>
                  <Text style={{ color: "#555", fontSize: 12 }}>{selected.horseBreed}</Text>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
