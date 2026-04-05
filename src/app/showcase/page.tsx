"use client";

import { useState } from "react";
import {
  Card, Row, Col, Tag, Typography, Modal, Tabs,
  Button, Input, Select, Space, Image, Divider,
} from "antd";
import {
  TrophyOutlined, StarOutlined, SearchOutlined,
  CalendarOutlined, ArrowLeftOutlined, InstagramOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// ── Data ───────────────────────────────────────────────────────────────────────
interface Achievement {
  year: string;
  title: string;
  place: string;
  medal: "🥇" | "🥈" | "🥉" | "🏅";
}

interface ShowcaseHorse {
  id: string;
  name: string;
  breed: string;
  gender: "Stallion" | "Mare" | "Gelding";
  age: number;
  color: string;
  origin: string;
  owner: string;
  trainer: string;
  status: "active" | "retired" | "training";
  imageUrl: string;
  galleryImages: string[];
  bio: string;
  achievements: Achievement[];
  stats: { races: number; wins: number; podiums: number; rating: number };
  tags: string[];
}

const horses: ShowcaseHorse[] = [
  {
    id: "1",
    name: "Storm",
    breed: "Arabian",
    gender: "Stallion",
    age: 5,
    color: "Dark Bay",
    origin: "Saudi Arabia",
    owner: "Ahmed Al-Rashidi",
    trainer: "Khalid Al-Mansouri",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&q=80",
      "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=400&q=80",
      "https://images.unsplash.com/photo-1504870712357-65ea720d6078?w=400&q=80",
    ],
    bio: "Storm is one of Blue Atlantic's finest stallions. Known for his explosive speed and exceptional endurance, he has dominated the Arabian racing circuit for the past three seasons.",
    achievements: [
      { year: "2026", title: "Gulf Arabian Championship", place: "1st Place", medal: "🥇" },
      { year: "2025", title: "National Speed Cup", place: "1st Place", medal: "🥇" },
      { year: "2025", title: "Spring Endurance Race", place: "2nd Place", medal: "🥈" },
      { year: "2024", title: "Arabian Classic Series", place: "1st Place", medal: "🥇" },
      { year: "2024", title: "Desert Challenge Cup", place: "3rd Place", medal: "🥉" },
    ],
    stats: { races: 18, wins: 12, podiums: 16, rating: 97 },
    tags: ["Champion", "Speed", "Endurance"],
  },
  {
    id: "2",
    name: "Luna",
    breed: "Thoroughbred",
    gender: "Mare",
    age: 7,
    color: "Grey",
    origin: "UAE",
    owner: "Sara Hassan",
    trainer: "Dr. Amira",
    status: "training",
    imageUrl: "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?w=400&q=80",
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&q=80",
    ],
    bio: "Luna is a graceful grey mare with an elegant style and remarkable intelligence. Currently in recovery and training for the upcoming season.",
    achievements: [
      { year: "2024", title: "International Dressage Open", place: "1st Place", medal: "🥇" },
      { year: "2023", title: "Gulf Dressage Championship", place: "2nd Place", medal: "🥈" },
      { year: "2023", title: "Spring Classic", place: "1st Place", medal: "🥇" },
    ],
    stats: { races: 14, wins: 8, podiums: 11, rating: 91 },
    tags: ["Dressage", "Elegant", "Champion"],
  },
  {
    id: "3",
    name: "Thunder",
    breed: "Warmblood",
    gender: "Stallion",
    age: 4,
    color: "Chestnut",
    origin: "Germany",
    owner: "Khalid Al-Mansouri",
    trainer: "Khalid Al-Mansouri",
    status: "training",
    imageUrl: "https://images.unsplash.com/photo-1504870712357-65ea720d6078?w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1504870712357-65ea720d6078?w=400&q=80",
    ],
    bio: "Thunder is a young Warmblood with outstanding jumping ability. At only 4 years old, he has already shown tremendous potential and is expected to compete at the highest levels.",
    achievements: [
      { year: "2026", title: "Young Horse National Championship", place: "1st Place", medal: "🥇" },
      { year: "2025", title: "Junior Show Jumping Cup", place: "2nd Place", medal: "🥈" },
    ],
    stats: { races: 6, wins: 3, podiums: 5, rating: 85 },
    tags: ["Jumping", "Young Talent", "Warmblood"],
  },
  {
    id: "4",
    name: "Bella",
    breed: "Arabian",
    gender: "Mare",
    age: 6,
    color: "Bay",
    origin: "Saudi Arabia",
    owner: "Fatima Noor",
    trainer: "Khalid Al-Mansouri",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?w=400&q=80",
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&q=80",
    ],
    bio: "Bella is a stunning Arabian mare, celebrated for her beauty and temperament. She excels in endurance racing and has a loyal fanbase across the Gulf region.",
    achievements: [
      { year: "2026", title: "Ladies Endurance Championship", place: "1st Place", medal: "🥇" },
      { year: "2025", title: "Arabian Beauty Classic", place: "1st Place", medal: "🥇" },
      { year: "2025", title: "Gulf Endurance 100km", place: "1st Place", medal: "🥇" },
      { year: "2024", title: "National Endurance Cup", place: "3rd Place", medal: "🥉" },
    ],
    stats: { races: 20, wins: 14, podiums: 18, rating: 94 },
    tags: ["Endurance", "Arabian Beauty", "3x Champion"],
  },
  {
    id: "5",
    name: "Shadow",
    breed: "Quarter Horse",
    gender: "Gelding",
    age: 9,
    color: "Black",
    origin: "USA",
    owner: "Mohammed Talib",
    trainer: "Sara Hassan",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1449052879870-6b3da71c2ead?w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1449052879870-6b3da71c2ead?w=400&q=80",
    ],
    bio: "Shadow is a powerful black Quarter Horse, a veteran of the sport. His experience and consistent performance have made him a fan favorite at every event.",
    achievements: [
      { year: "2025", title: "Open Sprint Championship", place: "2nd Place", medal: "🥈" },
      { year: "2024", title: "Quarter Horse Classic", place: "1st Place", medal: "🥇" },
      { year: "2023", title: "Speed Masters Cup", place: "1st Place", medal: "🥇" },
      { year: "2022", title: "National Quarter Sprint", place: "1st Place", medal: "🥇" },
    ],
    stats: { races: 32, wins: 19, podiums: 26, rating: 92 },
    tags: ["Veteran", "Sprint", "Consistent"],
  },
];

const STATUS_CONFIG = {
  active:   { color: "#52c41a", label: "Active Competitor" },
  training: { color: "#faad14", label: "In Training" },
  retired:  { color: "#8c8c8c", label: "Retired" },
};

const MEDAL_COLOR = { "🥇": "#FFD700", "🥈": "#C0C0C0", "🥉": "#CD7F32", "🏅": "#1677ff" };

export default function ShowcasePage() {
  const [search, setSearch] = useState("");
  const [breedFilter, setBreedFilter] = useState<string | undefined>(undefined);
  const [selectedHorse, setSelectedHorse] = useState<ShowcaseHorse | null>(null);

  const filtered = horses.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.breed.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (!breedFilter || h.breed === breedFilter);
  });

  const breeds = [...new Set(horses.map((h) => h.breed))];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>

      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #0d2137 50%, #0a0a0a 100%)",
        padding: "60px 40px 50px",
        textAlign: "center",
        borderBottom: "1px solid #1a1a1a",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, height: 300,
          background: "radial-gradient(ellipse, rgba(22,119,255,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            marginBottom: 24,
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14,
              background: "linear-gradient(135deg, #1677ff, #0050d0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 900, color: "#fff",
            }}>B</div>
            <div style={{ textAlign: "left" }}>
              <Text style={{ color: "#1677ff", fontSize: 12, letterSpacing: 3, display: "block", fontWeight: 600 }}>
                BLUE ATLANTIC
              </Text>
              <Text style={{ color: "#fff", fontSize: 11, letterSpacing: 2, opacity: 0.6 }}>
                EQUESTRIAN CLUB
              </Text>
            </div>
          </div>

          <Title style={{ color: "#fff", margin: 0, fontSize: 42, fontWeight: 900 }}>
            Our Champions
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, display: "block", marginTop: 8 }}>
            Meet the world-class horses of Blue Atlantic Equestrian Club
          </Text>

          {/* Stats bar */}
          <div style={{
            display: "inline-flex", gap: 40, marginTop: 32,
            background: "rgba(255,255,255,0.05)",
            padding: "16px 40px", borderRadius: 50,
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            {[
              { value: horses.length, label: "Horses" },
              { value: horses.reduce((s, h) => s + h.stats.wins, 0), label: "Total Wins" },
              { value: horses.reduce((s, h) => s + h.achievements.length, 0), label: "Championships" },
              { value: Math.round(horses.reduce((s, h) => s + h.stats.rating, 0) / horses.length), label: "Avg Rating" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <Text style={{ color: "#1677ff", fontSize: 26, fontWeight: 800, display: "block" }}>{stat.value}</Text>
                <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{stat.label}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: "24px 40px", background: "#111", borderBottom: "1px solid #1a1a1a" }}>
        <Space wrap>
          <Input
            prefix={<SearchOutlined style={{ color: "#555" }} />}
            placeholder="Search horses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff" }}
          />
          <Select
            placeholder="All Breeds"
            allowClear
            value={breedFilter}
            onChange={setBreedFilter}
            style={{ width: 160 }}
          >
            {breeds.map((b) => <Option key={b} value={b}>{b}</Option>)}
          </Select>
          <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
            {filtered.length} horse{filtered.length !== 1 ? "s" : ""} found
          </Text>
        </Space>
      </div>

      {/* ── Horse Cards Grid ─────────────────────────────────────────────────── */}
      <div style={{ padding: "40px" }}>
        <Row gutter={[24, 24]}>
          {filtered.map((horse) => (
            <Col key={horse.id} xs={24} sm={12} lg={8} xl={6}>
              <Card
                hoverable
                cover={
                  <div style={{ position: "relative", overflow: "hidden", height: 260 }}>
                    <img
                      src={horse.imageUrl}
                      alt={horse.name}
                      loading="lazy"
                      style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    {/* Status badge */}
                    <div style={{
                      position: "absolute", top: 12, right: 12,
                      background: "rgba(0,0,0,0.7)", borderRadius: 20,
                      padding: "4px 10px", backdropFilter: "blur(6px)",
                      border: `1px solid ${STATUS_CONFIG[horse.status].color}40`,
                    }}>
                      <Badge color={STATUS_CONFIG[horse.status].color} text={
                        <Text style={{ color: STATUS_CONFIG[horse.status].color, fontSize: 11, fontWeight: 600 }}>
                          {STATUS_CONFIG[horse.status].label}
                        </Text>
                      } />
                    </div>
                    {/* Win count */}
                    <div style={{
                      position: "absolute", bottom: 12, left: 12,
                      background: "rgba(0,0,0,0.75)", borderRadius: 20,
                      padding: "4px 12px", backdropFilter: "blur(6px)",
                    }}>
                      <Text style={{ color: "#FFD700", fontSize: 12 }}>
                        🏆 {horse.stats.wins} wins
                      </Text>
                    </div>
                  </div>
                }
                onClick={() => setSelectedHorse(horse)}
                style={{
                  background: "#161616",
                  border: "1px solid #222",
                  borderRadius: 16,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color 0.3s, transform 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#1677ff50";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#222";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
                bodyStyle={{ padding: "16px 18px" }}
              >
                {/* Name + Breed */}
                <Title level={4} style={{ color: "#fff", margin: 0 }}>{horse.name}</Title>
                <Text style={{ color: "#1677ff", fontSize: 13 }}>{horse.breed} · {horse.gender}</Text>

                {/* Tags */}
                <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {horse.tags.map((tag) => (
                    <Tag key={tag} style={{
                      background: "rgba(22,119,255,0.1)",
                      border: "1px solid rgba(22,119,255,0.2)",
                      color: "#1677ff", borderRadius: 6, fontSize: 11,
                    }}>{tag}</Tag>
                  ))}
                </div>

                {/* Mini stats */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 8, marginTop: 14,
                  padding: "10px 0",
                  borderTop: "1px solid #222",
                }}>
                  {[
                    { value: horse.stats.races, label: "Races" },
                    { value: horse.stats.wins, label: "Wins" },
                    { value: `${horse.stats.rating}%`, label: "Rating" },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center" }}>
                      <Text style={{ color: "#fff", fontSize: 16, fontWeight: 700, display: "block" }}>{s.value}</Text>
                      <Text style={{ color: "#555", fontSize: 11 }}>{s.label}</Text>
                    </div>
                  ))}
                </div>

                <Button
                  type="primary" block size="small"
                  style={{ marginTop: 10, borderRadius: 8, background: "#1677ff", border: "none" }}
                >
                  View Profile
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Divider between sections */}
      <Divider style={{ borderColor: "#1a1a1a", margin: "0 40px 40px" }} />

      {/* ══════════════════════════════════════════════════════════════════════
           PART 2 — UPCOMING CHAMPIONSHIPS
      ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "0 40px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(255,215,0,0.08)", padding: "8px 20px",
            borderRadius: 30, border: "1px solid rgba(255,215,0,0.15)",
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 20 }}>🏆</span>
            <Text style={{ color: "#FFD700", fontWeight: 700, letterSpacing: 2, fontSize: 12 }}>
              CHAMPIONSHIPS
            </Text>
          </div>
          <Title level={2} style={{ color: "#fff", margin: 0 }}>
            Upcoming & Live Competitions
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, display: "block", marginTop: 8 }}>
            Follow our riders and horses across the world
          </Text>
        </div>

        <Row gutter={[20, 20]}>
          {[
            {
              id: "c1", name: "Gulf Arabian Championship 2026",
              location: "🇸🇦 Riyadh", date: "10–15 May 2026",
              category: "Speed Racing", prize: "$50,000",
              rider: "Ahmed Al-Rashidi", horse: "Storm",
              status: "qualified", statusColor: "#52c41a", statusLabel: "✅ Qualified",
            },
            {
              id: "c2", name: "National Endurance Cup 100km",
              location: "🇸🇦 Jeddah", date: "28 Apr 2026",
              category: "Endurance", prize: "$25,000",
              rider: "Fatima Noor", horse: "Bella",
              status: "competing", statusColor: "#1677ff", statusLabel: "🏇 Live Now!",
            },
            {
              id: "c3", name: "International Dressage Open",
              location: "🇦🇪 Dubai", date: "20–23 May 2026",
              category: "Dressage", prize: "$30,000",
              rider: "Sara Hassan", horse: "Luna",
              status: "pending", statusColor: "#faad14", statusLabel: "⏳ Pending",
            },
            {
              id: "c4", name: "Desert Challenge Cup",
              location: "🇸🇦 Riyadh", date: "5–6 Jun 2026",
              category: "Speed Racing", prize: "$20,000",
              rider: "Mohammed Talib", horse: "Shadow",
              status: "qualified", statusColor: "#52c41a", statusLabel: "✅ Qualified",
            },
            {
              id: "c5", name: "Spring Classic Show Jumping",
              location: "🇦🇪 Abu Dhabi", date: "15–17 Apr 2026",
              category: "Show Jumping", prize: "$15,000",
              rider: "Khalid Al-Mansouri", horse: "Thunder",
              status: "completed", statusColor: "#722ed1", statusLabel: "🏁 🥇 1st Place",
            },
          ].map((c) => (
            <Col key={c.id} xs={24} sm={12} lg={8}>
              <div style={{
                background: "#141414",
                border: `1px solid ${c.status === "competing" ? "#1677ff40" : "#222"}`,
                borderRadius: 16, padding: 22,
                boxShadow: c.status === "competing" ? "0 0 24px rgba(22,119,255,0.2)" : "none",
                transition: "all 0.25s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1677ff40")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = c.status === "competing" ? "#1677ff40" : "#222")}
              >
                {/* Status */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                    background: `${c.statusColor}20`, color: c.statusColor,
                    border: `1px solid ${c.statusColor}40`,
                  }}>{c.statusLabel}</span>
                  <span style={{ color: "#555", fontSize: 12 }}>{c.category}</span>
                </div>

                {/* Name */}
                <Text style={{ color: "#fff", fontWeight: 700, fontSize: 15, display: "block", marginBottom: 10, lineHeight: 1.4 }}>
                  {c.name}
                </Text>

                {/* Location & Date */}
                <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                  <Text style={{ color: "#555", fontSize: 12 }}>📍 {c.location}</Text>
                  <Text style={{ color: "#555", fontSize: 12 }}>📅 {c.date}</Text>
                </div>

                {/* Rider & Horse */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
                  background: "#1a1a1a", borderRadius: 10, padding: "12px 14px", marginBottom: 12,
                }}>
                  <div>
                    <Text style={{ color: "#555", fontSize: 10, display: "block" }}>RIDER</Text>
                    <Text style={{ color: "#ddd", fontSize: 13, fontWeight: 600 }}>👤 {c.rider}</Text>
                  </div>
                  <div>
                    <Text style={{ color: "#555", fontSize: 10, display: "block" }}>HORSE</Text>
                    <Text style={{ color: "#ddd", fontSize: 13, fontWeight: 600 }}>🐴 {c.horse}</Text>
                  </div>
                </div>

                {/* Prize */}
                <Text style={{ color: "#52c41a", fontWeight: 700, fontSize: 14 }}>💰 {c.prize}</Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <div style={{
        textAlign: "center", padding: "30px 40px",
        borderTop: "1px solid #1a1a1a", background: "#0a0a0a",
      }}>
        <Space size={24} style={{ marginBottom: 12 }}>
          <a href="/showcase" style={{ color: "#555", fontSize: 13 }}>Our Horses</a>
          <a href="/public-championships" style={{ color: "#555", fontSize: 13 }}>Championships</a>
        </Space>
        <br />
        <Text style={{ color: "#333", fontSize: 13 }}>
          © 2026 Blue Atlantic Equestrian Club · All Rights Reserved
        </Text>
      </div>

      {/* ── Horse Detail Modal ───────────────────────────────────────────────── */}
      <Modal
        open={!!selectedHorse}
        onCancel={() => setSelectedHorse(null)}
        footer={null}
        width={760}
        styles={{ body: { padding: 0, background: "#111", borderRadius: 16 } }}
        style={{ top: 40 }}
      >
        {selectedHorse && (
          <div style={{ background: "#111", borderRadius: 16, overflow: "hidden" }}>

            {/* Cover Image */}
            <div style={{ position: "relative", height: 280 }}>
              <img
                src={selectedHorse.imageUrl}
                alt={selectedHorse.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, #111 0%, transparent 60%)",
              }} />
              <div style={{ position: "absolute", bottom: 20, left: 24, right: 24 }}>
                <Title style={{ color: "#fff", margin: 0, fontSize: 32 }}>{selectedHorse.name}</Title>
                <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>
                  {selectedHorse.breed} · {selectedHorse.gender} · {selectedHorse.age} years old
                </Text>
              </div>
              <div style={{ position: "absolute", top: 16, right: 16 }}>
                <Badge
                  color={STATUS_CONFIG[selectedHorse.status].color}
                  text={
                    <Text style={{ color: STATUS_CONFIG[selectedHorse.status].color, fontWeight: 600 }}>
                      {STATUS_CONFIG[selectedHorse.status].label}
                    </Text>
                  }
                />
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "24px 28px" }}>
              <Tabs
                defaultActiveKey="profile"
                style={{ color: "#aaa" }}
                tabBarStyle={{ borderBottom: "1px solid #222" }}
              >
                {/* ── Profile Tab ── */}
                <TabPane tab="Profile" key="profile">
                  {/* Bio */}
                  <Paragraph style={{ color: "#aaa", lineHeight: 1.8, marginBottom: 20 }}>
                    {selectedHorse.bio}
                  </Paragraph>

                  {/* Details */}
                  <Row gutter={16} style={{ marginBottom: 20 }}>
                    {[
                      { label: "Origin", value: selectedHorse.origin },
                      { label: "Color", value: selectedHorse.color },
                      { label: "Owner", value: selectedHorse.owner },
                      { label: "Trainer", value: selectedHorse.trainer },
                    ].map((d) => (
                      <Col key={d.label} span={12} style={{ marginBottom: 12 }}>
                        <Text style={{ color: "#555", fontSize: 12, display: "block" }}>{d.label}</Text>
                        <Text style={{ color: "#ddd", fontSize: 14, fontWeight: 600 }}>{d.value}</Text>
                      </Col>
                    ))}
                  </Row>

                  {/* Stats */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 12, padding: "16px 0",
                    borderTop: "1px solid #222", borderBottom: "1px solid #222",
                    marginBottom: 20,
                  }}>
                    {[
                      { value: selectedHorse.stats.races, label: "Total Races", color: "#1677ff" },
                      { value: selectedHorse.stats.wins, label: "Wins", color: "#FFD700" },
                      { value: selectedHorse.stats.podiums, label: "Podiums", color: "#52c41a" },
                      { value: `${selectedHorse.stats.rating}%`, label: "Rating", color: "#ff4d4f" },
                    ].map((s) => (
                      <div key={s.label} style={{ textAlign: "center" }}>
                        <Text style={{ color: s.color, fontSize: 24, fontWeight: 800, display: "block" }}>{s.value}</Text>
                        <Text style={{ color: "#555", fontSize: 12 }}>{s.label}</Text>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <Space wrap>
                    {selectedHorse.tags.map((tag) => (
                      <Tag key={tag} style={{
                        background: "rgba(22,119,255,0.1)",
                        border: "1px solid rgba(22,119,255,0.2)",
                        color: "#1677ff", borderRadius: 6,
                      }}>{tag}</Tag>
                    ))}
                  </Space>
                </TabPane>

                {/* ── Achievements Tab ── */}
                <TabPane tab={`🏆 Achievements (${selectedHorse.achievements.length})`} key="achievements">
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {selectedHorse.achievements.map((ach, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 16,
                        padding: "14px 16px", borderRadius: 10,
                        background: "#1a1a1a",
                        border: `1px solid ${ach.medal === "🥇" ? "#FFD70030" : ach.medal === "🥈" ? "#C0C0C030" : "#CD7F3230"}`,
                      }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 10,
                          background: `${MEDAL_COLOR[ach.medal]}20`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 24, flexShrink: 0,
                        }}>
                          {ach.medal}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text style={{ color: "#fff", fontWeight: 600, fontSize: 14, display: "block" }}>
                            {ach.title}
                          </Text>
                          <Text style={{ color: "#555", fontSize: 12 }}>{ach.place}</Text>
                        </div>
                        <div style={{
                          padding: "4px 10px", borderRadius: 20,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid #2a2a2a",
                        }}>
                          <CalendarOutlined style={{ color: "#555", marginRight: 4 }} />
                          <Text style={{ color: "#555", fontSize: 12 }}>{ach.year}</Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabPane>

                {/* ── Gallery Tab ── */}
                <TabPane tab="📸 Gallery" key="gallery">
                  <Row gutter={[12, 12]}>
                    {selectedHorse.galleryImages.map((img, i) => (
                      <Col key={i} span={8}>
                        <Image
                          src={img}
                          alt={`${selectedHorse.name} ${i + 1}`}
                          style={{ borderRadius: 10, objectFit: "cover", height: 150, width: "100%" }}
                          loading="lazy"
                        />
                      </Col>
                    ))}
                    {selectedHorse.galleryImages.length === 0 && (
                      <Col span={24}>
                        <Text style={{ color: "#555" }}>No gallery images yet.</Text>
                      </Col>
                    )}
                  </Row>
                </TabPane>
              </Tabs>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
