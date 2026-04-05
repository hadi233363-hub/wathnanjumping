"use client";

import { useState } from "react";
import { Card, Table, Tag, Button, Input, Select, Space, Typography, Modal, Form, InputNumber } from "antd";
import { PlusOutlined, SearchOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { Expense, ExpenseStatus, ServiceCategory } from "@/types";
import StatsCard from "@/components/shared/StatsCard";
import { DollarOutlined, ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const { Text, Title } = Typography;
const { Option } = Select;

const STATUS_COLOR: Record<ExpenseStatus, string> = { approved: "green", pending: "orange", rejected: "red" };
const categories: ServiceCategory[] = ["Feed", "Veterinary", "Farrier", "Supplements", "Transport", "Equipment", "Competition"];

const initialExpenses: Expense[] = [
  { id: "1", description: "Monthly hay supply", amount: 2400, category: "Feed", status: "approved", submittedBy: "Ahmed", date: "2026-04-01" },
  { id: "2", description: "Vet checkup — Storm", amount: 850, category: "Veterinary", status: "pending", submittedBy: "Sara", date: "2026-04-03" },
  { id: "3", description: "Horseshoe replacement — 4 horses", amount: 1200, category: "Farrier", status: "approved", submittedBy: "Khalid", date: "2026-03-28" },
  { id: "4", description: "Joint supplement order", amount: 320, category: "Supplements", status: "pending", submittedBy: "Fatima", date: "2026-04-04" },
  { id: "5", description: "Transport to competition", amount: 700, category: "Transport", status: "rejected", submittedBy: "Mohammed", date: "2026-03-30" },
];

export default function FinancePage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = expenses.filter((e) => {
    const match = e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.submittedBy.toLowerCase().includes(search.toLowerCase());
    return match && (!statusFilter || e.status === statusFilter) && (!categoryFilter || e.category === categoryFilter);
  });

  const updateStatus = (id: string, status: ExpenseStatus) => {
    setExpenses((p) => p.map((e) => (e.id === id ? { ...e, status } : e)));
    toast.success(`Expense ${status}`);
  };

  const handleDelete = (id: string) => { setExpenses((p) => p.filter((e) => e.id !== id)); toast.success("Expense deleted"); };

  const handleSubmit = (values: Partial<Expense>) => {
    setExpenses((p) => [{ id: String(Date.now()), date: new Date().toISOString().split("T")[0], status: "pending", ...values } as Expense, ...p]);
    toast.success("Expense submitted");
    setModalOpen(false);
  };

  const total = expenses.reduce((s, e) => s + (e.status !== "rejected" ? e.amount : 0), 0);
  const pending = expenses.filter(e => e.status === "pending").length;
  const approved = expenses.filter(e => e.status === "approved").length;

  const columns = [
    { title: "Description", dataIndex: "description", key: "description", render: (v: string) => <Text strong>{v}</Text> },
    { title: "Category", dataIndex: "category", key: "category", render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: "Amount", dataIndex: "amount", key: "amount", render: (v: number) => <Text strong>${v.toLocaleString()}</Text> },
    { title: "Submitted By", dataIndex: "submittedBy", key: "submittedBy" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (v: ExpenseStatus) => <Tag color={STATUS_COLOR[v]}>{v.toUpperCase()}</Tag>,
    },
    {
      title: "Actions", key: "actions",
      render: (_: unknown, r: Expense) => (
        <Space>
          {r.status === "pending" && (
            <>
              <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => updateStatus(r.id, "approved")}>Approve</Button>
              <Button size="small" danger icon={<CloseOutlined />} onClick={() => updateStatus(r.id, "rejected")}>Reject</Button>
            </>
          )}
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Finance</Title>
          <Text style={{ color: "#8c8c8c" }}>Track and manage all expenses</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true); }} style={{ borderRadius: 8 }}>Add Expense</Button>
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <StatsCard title="Total Expenses" value={`$${total.toLocaleString()}`} icon={<DollarOutlined />} color="#1677ff" />
        <StatsCard title="Pending Approval" value={pending} icon={<ClockCircleOutlined />} color="#faad14" />
        <StatsCard title="Approved" value={approved} icon={<CheckCircleOutlined />} color="#52c41a" />
      </div>

      <Card style={{ marginBottom: 16, borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Space wrap>
          <Input prefix={<SearchOutlined />} placeholder="Search expenses" value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ width: 240, borderRadius: 8 }} />
          <Select placeholder="Status" allowClear value={statusFilter} onChange={setStatusFilter} style={{ width: 160 }}>
            <Option value="approved">Approved</Option>
            <Option value="pending">Pending</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <Select placeholder="Category" allowClear value={categoryFilter} onChange={setCategoryFilter} style={{ width: 160 }}>
            {categories.map((c) => <Option key={c} value={c}>{c}</Option>)}
          </Select>
        </Space>
      </Card>

      <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Table dataSource={filtered} columns={columns} rowKey="id" scroll={{ x: true }} />
      </Card>

      <Modal title="Submit Expense" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={() => form.submit()} okText="Submit">
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="amount" label="Amount ($)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>{categories.map((c) => <Option key={c} value={c}>{c}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="submittedBy" label="Submitted By" rules={[{ required: true }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
