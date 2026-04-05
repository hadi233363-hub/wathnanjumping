"use client";

import { useState } from "react";
import { Card, Table, Tag, Button, Input, Select, Space, Typography, Modal, Form, InputNumber } from "antd";
import { PlusOutlined, SearchOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const { Text, Title } = Typography;
const { Option } = Select;

interface Reimbursement {
  id: string;
  employee: string;
  description: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  category: string;
}

const initialData: Reimbursement[] = [
  { id: "1", employee: "Sara Hassan", description: "Vet supplies purchased off-site", amount: 320, status: "pending", submittedDate: "2026-04-04", category: "Veterinary" },
  { id: "2", employee: "Mohammed Talib", description: "Farrier tools replacement", amount: 180, status: "approved", submittedDate: "2026-04-02", category: "Equipment" },
  { id: "3", employee: "Khalid Al-Mansouri", description: "Training equipment", amount: 450, status: "pending", submittedDate: "2026-04-01", category: "Equipment" },
  { id: "4", employee: "Fatima Noor", description: "Competition registration fee", amount: 600, status: "rejected", submittedDate: "2026-03-28", category: "Competition" },
];

const STATUS_COLOR: Record<string, string> = { pending: "orange", approved: "green", rejected: "red" };

export default function ReimbursementPage() {
  const [items, setItems] = useState<Reimbursement[]>(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = items.filter((i) =>
    (i.employee.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || i.status === statusFilter)
  );

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    setItems((p) => p.map((i) => (i.id === id ? { ...i, status } : i)));
    toast.success(`Reimbursement ${status}`);
  };

  const handleSubmit = (values: Partial<Reimbursement>) => {
    setItems((p) => [{ id: String(Date.now()), submittedDate: new Date().toISOString().split("T")[0], status: "pending", ...values } as Reimbursement, ...p]);
    toast.success("Reimbursement submitted");
    setModalOpen(false);
  };

  const columns = [
    { title: "Employee", dataIndex: "employee", key: "employee", render: (v: string) => <Text strong>{v}</Text> },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Category", dataIndex: "category", key: "category", render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: "Amount", dataIndex: "amount", key: "amount", render: (v: number) => <Text strong>${v}</Text> },
    { title: "Submitted", dataIndex: "submittedDate", key: "submittedDate" },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (v: string) => <Tag color={STATUS_COLOR[v]}>{v.toUpperCase()}</Tag>,
    },
    {
      title: "Actions", key: "actions",
      render: (_: unknown, r: Reimbursement) => r.status === "pending" ? (
        <Space>
          <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => updateStatus(r.id, "approved")}>Approve</Button>
          <Button size="small" danger icon={<CloseOutlined />} onClick={() => updateStatus(r.id, "rejected")}>Reject</Button>
        </Space>
      ) : null,
    },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Reimbursement</Title>
          <Text style={{ color: "#8c8c8c" }}>Manage employee expense reimbursements</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true); }} style={{ borderRadius: 8 }}>Submit Request</Button>
      </div>

      <Card style={{ marginBottom: 16, borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Space wrap>
          <Input prefix={<SearchOutlined />} placeholder="Search" value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ width: 240, borderRadius: 8 }} />
          <Select placeholder="Status" allowClear value={statusFilter} onChange={setStatusFilter} style={{ width: 160 }}>
            <Option value="pending">Pending</Option>
            <Option value="approved">Approved</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
        </Space>
      </Card>

      <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Table dataSource={filtered} columns={columns} rowKey="id" />
      </Card>

      <Modal title="Submit Reimbursement" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} okText="Submit">
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Form.Item name="employee" label="Employee Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="amount" label="Amount ($)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              {["Feed", "Veterinary", "Farrier", "Equipment", "Competition", "Transport"].map(c => <Option key={c} value={c}>{c}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
