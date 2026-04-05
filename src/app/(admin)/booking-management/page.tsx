"use client";

import { useState } from "react";
import { Card, Table, Tag, Button, Input, Select, Space, Typography, Modal, Form } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Booking, BookingStatus } from "@/types";
import { toast } from "react-toastify";

const { Text, Title } = Typography;
const { Option } = Select;

const STATUS_COLOR: Record<BookingStatus, string> = {
  confirmed: "green",
  pending: "orange",
  canceled: "red",
};

const initialBookings: Booking[] = [
  { id: "1", horseName: "Storm", expertName: "Dr. Khalid", status: "confirmed", wellnessType: "physio", location: "on-site", date: "2026-04-05", createdAt: "2026-04-01" },
  { id: "2", horseName: "Luna", expertName: "Sara Hassan", status: "pending", wellnessType: "workout", location: "off-site", date: "2026-04-06", createdAt: "2026-04-02" },
  { id: "3", horseName: "Thunder", expertName: "Dr. Amira", status: "confirmed", wellnessType: "both", location: "on-site", date: "2026-04-07", createdAt: "2026-04-03" },
  { id: "4", horseName: "Bella", expertName: "Mohammed Ali", status: "canceled", wellnessType: "physio", location: "on-site", date: "2026-04-08", createdAt: "2026-04-04" },
  { id: "5", horseName: "Shadow", expertName: "Dr. Khalid", status: "confirmed", wellnessType: "workout", location: "off-site", date: "2026-04-09", createdAt: "2026-04-05" },
];

export default function BookingManagementPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [form] = Form.useForm();

  const filtered = bookings.filter((b) => {
    const match = b.horseName.toLowerCase().includes(search.toLowerCase()) ||
      b.expertName.toLowerCase().includes(search.toLowerCase());
    return match && (!statusFilter || b.status === statusFilter);
  });

  const openAdd = () => { setEditingBooking(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (b: Booking) => { setEditingBooking(b); form.setFieldsValue(b); setModalOpen(true); };
  const handleDelete = (id: string) => { setBookings((p) => p.filter((b) => b.id !== id)); toast.success("Booking removed"); };

  const handleSubmit = (values: Partial<Booking>) => {
    if (editingBooking) {
      setBookings((p) => p.map((b) => (b.id === editingBooking.id ? { ...b, ...values } : b)));
      toast.success("Booking updated");
    } else {
      setBookings((p) => [{ id: String(Date.now()), createdAt: new Date().toISOString().split("T")[0], ...values } as Booking, ...p]);
      toast.success("Booking added");
    }
    setModalOpen(false);
  };

  const columns = [
    { title: "Horse", dataIndex: "horseName", key: "horseName", render: (v: string) => <Text strong>🐴 {v}</Text> },
    { title: "Expert", dataIndex: "expertName", key: "expertName" },
    { title: "Wellness Type", dataIndex: "wellnessType", key: "wellnessType", render: (v: string) => <Tag color="purple">{v}</Tag> },
    { title: "Location", dataIndex: "location", key: "location", render: (v: string) => <Tag>{v}</Tag> },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (v: BookingStatus) => <Tag color={STATUS_COLOR[v]}>{v.toUpperCase()}</Tag>,
    },
    {
      title: "Actions", key: "actions",
      render: (_: unknown, r: Booking) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Booking Management</Title>
          <Text style={{ color: "#8c8c8c" }}>Manage all sessions and bookings</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 8 }}>Quick Add</Button>
      </div>

      <Card style={{ marginBottom: 16, borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Space wrap>
          <Input prefix={<SearchOutlined />} placeholder="Search by horse or expert" value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ width: 280, borderRadius: 8 }} />
          <Select placeholder="Filter by status" allowClear value={statusFilter} onChange={setStatusFilter} style={{ width: 180 }}>
            <Option value="confirmed">Confirmed</Option>
            <Option value="pending">Pending</Option>
            <Option value="canceled">Canceled</Option>
          </Select>
        </Space>
      </Card>

      <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Table dataSource={filtered} columns={columns} rowKey="id" />
      </Card>

      <Modal title={editingBooking ? "Edit Booking" : "New Booking"} open={modalOpen}
        onCancel={() => setModalOpen(false)} onOk={() => form.submit()} okText={editingBooking ? "Update" : "Add"}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Form.Item name="horseName" label="Horse Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="expertName" label="Expert Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="wellnessType" label="Wellness Type" rules={[{ required: true }]}>
            <Select><Option value="physio">Physio</Option><Option value="workout">Workout</Option><Option value="both">Both</Option></Select>
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Select><Option value="on-site">On-site</Option><Option value="off-site">Off-site</Option></Select>
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}><Input type="date" /></Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select><Option value="confirmed">Confirmed</Option><Option value="pending">Pending</Option><Option value="canceled">Canceled</Option></Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
