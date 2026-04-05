"use client";

import { Card, Row, Col, Typography, Tag, Button, Upload, Empty, Space } from "antd";
import { UploadOutlined, PictureOutlined, FileTextOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Text, Title } = Typography;

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  size: string;
  uploadedBy: string;
  date: string;
  url?: string;
}

const initialMedia: MediaItem[] = [
  { id: "1", name: "storm-profile.jpg", type: "image", size: "2.4 MB", uploadedBy: "Ahmed", date: "2026-04-04" },
  { id: "2", name: "training-session.mp4", type: "video", size: "48 MB", uploadedBy: "Sara", date: "2026-04-03" },
  { id: "3", name: "vet-report-luna.pdf", type: "document", size: "1.1 MB", uploadedBy: "Dr. Khalid", date: "2026-04-01" },
  { id: "4", name: "bella-photo.jpg", type: "image", size: "3.2 MB", uploadedBy: "Fatima", date: "2026-03-29" },
  { id: "5", name: "thunder-workout.mp4", type: "video", size: "32 MB", uploadedBy: "Sara", date: "2026-03-27" },
  { id: "6", name: "inventory-report.pdf", type: "document", size: "0.8 MB", uploadedBy: "Ahmed", date: "2026-03-25" },
];

const TYPE_ICON: Record<string, React.ReactNode> = {
  image: <PictureOutlined style={{ fontSize: 36, color: "#1677ff" }} />,
  video: <VideoCameraOutlined style={{ fontSize: 36, color: "#722ed1" }} />,
  document: <FileTextOutlined style={{ fontSize: 36, color: "#fa8c16" }} />,
};

const TYPE_COLOR: Record<string, string> = { image: "blue", video: "purple", document: "orange" };

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);

  const handleDelete = (id: string) => setMedia((p) => p.filter((m) => m.id !== id));

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Media Library</Title>
          <Text style={{ color: "#8c8c8c" }}>Manage images, videos, and documents</Text>
        </div>
        <Upload beforeUpload={() => false} showUploadList={false}>
          <Button type="primary" icon={<UploadOutlined />} style={{ borderRadius: 8 }}>Upload File</Button>
        </Upload>
      </div>

      {media.length === 0 ? (
        <Card style={{ borderRadius: 12, border: "none", textAlign: "center", padding: 40 }}>
          <Empty description="No media files uploaded yet" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {media.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                style={{ borderRadius: 12, border: "1px solid #f0f0f0", textAlign: "center" }}
                actions={[
                  <Button key="del" type="link" danger onClick={() => handleDelete(item.id)} size="small">Remove</Button>,
                ]}
              >
                <div style={{ marginBottom: 12 }}>{TYPE_ICON[item.type]}</div>
                <Text strong style={{ fontSize: 13, display: "block" }} ellipsis={{ tooltip: item.name }}>
                  {item.name}
                </Text>
                <Space style={{ marginTop: 8 }}>
                  <Tag color={TYPE_COLOR[item.type]}>{item.type}</Tag>
                  <Text style={{ fontSize: 11, color: "#8c8c8c" }}>{item.size}</Text>
                </Space>
                <br />
                <Text style={{ fontSize: 11, color: "#8c8c8c" }}>{item.date}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
