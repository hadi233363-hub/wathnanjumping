import { Card, Typography } from "antd";
import { ReactNode } from "react";

const { Text, Title } = Typography;

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  trend?: { value: number; label: string };
}

export default function StatsCard({
  title,
  value,
  icon,
  color = "#1677ff",
  trend,
}: StatsCardProps) {
  return (
    <Card
      style={{
        borderRadius: 16,
        border: "none",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
      bodyStyle={{ padding: "20px 24px" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Text style={{ fontSize: 13, color: "#8c8c8c", fontWeight: 500 }}>{title}</Text>
          <Title level={3} style={{ margin: "4px 0 0", color: "#1a1a2e" }}>
            {value}
          </Title>
          {trend && (
            <Text style={{ fontSize: 12, color: trend.value >= 0 ? "#52c41a" : "#ff4d4f" }}>
              {trend.value >= 0 ? "▲" : "▼"} {Math.abs(trend.value)}% {trend.label}
            </Text>
          )}
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
