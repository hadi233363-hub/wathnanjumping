"use client";

import { Card, Table, Tag, Typography, Space, Badge } from "antd";
import { HeartOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import StatsCard from "@/components/shared/StatsCard";

const { Text, Title } = Typography;

const sessions = [
  { id: "1", horse: "Storm", expert: "Dr. Khalid", type: "Physio", duration: "45 min", date: "2026-04-05", outcome: "Improved", notes: "Range of motion significantly improved." },
  { id: "2", horse: "Luna", expert: "Sara Hassan", type: "Workout", duration: "60 min", date: "2026-04-03", outcome: "Ongoing", notes: "Recovery in progress, light exercise." },
  { id: "3", horse: "Thunder", expert: "Dr. Amira", type: "Both", duration: "90 min", date: "2026-04-01", outcome: "Completed", notes: "Full session completed successfully." },
  { id: "4", horse: "Bella", expert: "Mohammed Ali", type: "Physio", duration: "30 min", date: "2026-03-29", outcome: "Improved", notes: "Minor stiffness resolved." },
  { id: "5", horse: "Shadow", expert: "Dr. Khalid", type: "Workout", duration: "50 min", date: "2026-03-27", outcome: "Completed", notes: "Peak performance training." },
];

const OUTCOME_COLOR: Record<string, string> = { Improved: "green", Ongoing: "orange", Completed: "blue" };

const columns = [
  { title: "Horse", dataIndex: "horse", key: "horse", render: (v: string) => <Text strong>🐴 {v}</Text> },
  { title: "Expert", dataIndex: "expert", key: "expert" },
  { title: "Type", dataIndex: "type", key: "type", render: (v: string) => <Tag color="purple">{v}</Tag> },
  { title: "Duration", dataIndex: "duration", key: "duration" },
  { title: "Date", dataIndex: "date", key: "date" },
  {
    title: "Outcome", dataIndex: "outcome", key: "outcome",
    render: (v: string) => <Badge color={OUTCOME_COLOR[v] || "default"} text={v} />,
  },
  { title: "Notes", dataIndex: "notes", key: "notes", render: (v: string) => <Text style={{ color: "#8c8c8c", fontSize: 12 }}>{v}</Text> },
];

export default function WellnessPage() {
  const improved = sessions.filter(s => s.outcome === "Improved").length;
  const ongoing = sessions.filter(s => s.outcome === "Ongoing").length;

  return (
    <div>
      <div className="page-header">
        <Title level={4} style={{ margin: 0 }}>Wellness Module</Title>
        <Text style={{ color: "#8c8c8c" }}>Track horse wellness and physiotherapy sessions</Text>
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <StatsCard title="Total Sessions" value={sessions.length} icon={<HeartOutlined />} color="#13c2c2" />
        <StatsCard title="Improved" value={improved} icon={<CheckCircleOutlined />} color="#52c41a" />
        <StatsCard title="Ongoing" value={ongoing} icon={<ClockCircleOutlined />} color="#faad14" />
      </div>

      <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Table dataSource={sessions} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
}
