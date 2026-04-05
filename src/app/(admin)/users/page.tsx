"use client";

import { useState } from "react";
import { Card, Table, Tag, Button, Input, Select, Space, Modal, Form, Typography, Avatar } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { UserType } from "@/types";
import { toast } from "react-toastify";

const { Text, Title } = Typography;
const { Option } = Select;

const initialUsers: UserType[] = [
  { id: "1", name: "Ahmed Al-Rashidi", email: "ahmed@blueatl.com", role: "Admin", status: "active", createdAt: "2025-01-10" },
  { id: "2", name: "Sara Hassan", email: "sara@blueatl.com", role: "Veterinarian", status: "active", createdAt: "2025-02-14" },
  { id: "3", name: "Khalid Al-Mansouri", email: "khalid@blueatl.com", role: "Trainer", status: "active", createdAt: "2025-03-01" },
  { id: "4", name: "Fatima Noor", email: "fatima@blueatl.com", role: "Staff", status: "inactive", createdAt: "2025-03-15" },
  { id: "5", name: "Mohammed Talib", email: "mo@blueatl.com", role: "Farrier", status: "active", createdAt: "2025-04-20" },
  { id: "6", name: "Layla Al-Hamdan", email: "layla@blueatl.com", role: "Expert", status: "active", createdAt: "2024-12-01" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [form] = Form.useForm();

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openAdd = () => { setEditingUser(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (user: UserType) => { setEditingUser(user); form.setFieldsValue(user); setModalOpen(true); };
  const handleDelete = (id: string) => { setUsers((p) => p.filter((u) => u.id !== id)); toast.success("User removed"); };

  const handleSubmit = (values: Partial<UserType>) => {
    if (editingUser) {
      setUsers((p) => p.map((u) => (u.id === editingUser.id ? { ...u, ...values } : u)));
      toast.success("User updated");
    } else {
      setUsers((p) => [{ id: String(Date.now()), createdAt: new Date().toISOString().split("T")[0], ...values } as UserType, ...p]);
      toast.success("User added");
    }
    setModalOpen(false);
  };

  const roles = ["Admin", "Veterinarian", "Trainer", "Expert", "Farrier", "Staff"];

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_: unknown, r: UserType) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ background: "#1677ff" }} />
          <div>
            <Text strong>{r.name}</Text>
            <br />
            <Text style={{ fontSize: 12, color: "#8c8c8c" }}>{r.email}</Text>
          </div>
        </Space>
      ),
    },
    { title: "Role", dataIndex: "role", key: "role", render: (v: string) => <Tag color="blue">{v}</Tag> },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (v: string) => <Tag color={v === "active" ? "green" : "default"}>{v}</Tag>,
    },
    { title: "Joined", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "Actions", key: "actions",
      render: (_: unknown, r: UserType) => (
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
          <Title level={4} style={{ margin: 0 }}>User Management</Title>
          <Text style={{ color: "#8c8c8c" }}>Manage all platform users and roles</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 8 }}>
          Add User
        </Button>
      </div>

      <Card style={{ marginBottom: 16, borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Space wrap>
          <Input prefix={<SearchOutlined />} placeholder="Search by name or email" value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ width: 260, borderRadius: 8 }} />
          <Select placeholder="Filter by role" allowClear value={roleFilter} onChange={setRoleFilter} style={{ width: 180 }}>
            {roles.map((r) => <Option key={r} value={r}>{r}</Option>)}
          </Select>
        </Space>
      </Card>

      <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Table dataSource={filtered} columns={columns} rowKey="id" />
      </Card>

      <Modal title={editingUser ? "Edit User" : "Add New User"} open={modalOpen}
        onCancel={() => setModalOpen(false)} onOk={() => form.submit()} okText={editingUser ? "Update" : "Add"}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="Full name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }, { type: "email" }]}>
            <Input placeholder="email@example.com" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              {roles.map((r) => <Option key={r} value={r}>{r}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
