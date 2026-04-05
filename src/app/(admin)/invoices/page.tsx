"use client";

import { useState } from "react";
import {
  Card, Table, Tag, Button, Input, Select, Space, Typography,
  Modal, Form, Upload, Badge, Divider, Alert,
} from "antd";
import {
  PlusOutlined, SearchOutlined, CheckCircleOutlined,
  UploadOutlined, PaperClipOutlined, EyeOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import PermissionGuard from "@/components/guards/PermissionGuard";
import { PERMISSIONS } from "@/types/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import StatsCard from "@/components/shared/StatsCard";
import { DollarOutlined, ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Invoice {
  id: string;
  submittedBy: string;
  role: string;
  description: string;
  amount: number;
  attachmentName?: string;
  status: "pending" | "reviewed" | "paid";
  paymentNote?: string;
  submittedDate: string;
  paidDate?: string;
}

const initialInvoices: Invoice[] = [
  {
    id: "INV-001",
    submittedBy: "محمد الفارسي",
    role: "فارس",
    description: "رسوم تدريب الخيل — مارس 2026",
    amount: 1200,
    attachmentName: "invoice-march.pdf",
    status: "paid",
    paymentNote: "تم التحويل بنكي",
    submittedDate: "2026-04-01",
    paidDate: "2026-04-03",
  },
  {
    id: "INV-002",
    submittedBy: "سارة الراشدي",
    role: "فارسة",
    description: "رسوم اشتراك شهر أبريل",
    amount: 800,
    attachmentName: "sara-april.jpg",
    status: "reviewed",
    submittedDate: "2026-04-04",
  },
  {
    id: "INV-003",
    submittedBy: "خالد النعيمي",
    role: "فارس",
    description: "معدات خيالة — سرج وإكسسوارات",
    amount: 3500,
    attachmentName: "receipt-khaled.pdf",
    status: "pending",
    submittedDate: "2026-04-05",
  },
];

const STATUS_MAP = {
  pending: { color: "orange", label: "قيد المراجعة" },
  reviewed: { color: "blue", label: "تمت المراجعة" },
  paid: { color: "green", label: "✅ اكتمل الدفع" },
};

export default function InvoicesPage() {
  const { can } = usePermissions();
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [submitModal, setSubmitModal] = useState(false);
  const [payModal, setPayModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [form] = Form.useForm();
  const [payForm] = Form.useForm();

  const filtered = invoices.filter((i) => {
    const match = i.submittedBy.includes(search) || i.description.includes(search) || i.id.includes(search);
    return match && (!statusFilter || i.status === statusFilter);
  });

  const handleSubmitInvoice = (values: { description: string; amount: number; submittedBy: string }) => {
    const newInv: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
      submittedBy: values.submittedBy,
      role: "فارس",
      description: values.description,
      amount: Number(values.amount),
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
    };
    setInvoices((p) => [newInv, ...p]);
    toast.success("تم إرسال الفاتورة بنجاح — ستتم مراجعتها من قِبل المحاسب");
    setSubmitModal(false);
    form.resetFields();
  };

  const handleMarkPaid = (values: { paymentNote: string }) => {
    if (!selectedInvoice) return;
    setInvoices((p) =>
      p.map((i) =>
        i.id === selectedInvoice.id
          ? { ...i, status: "paid", paymentNote: values.paymentNote, paidDate: new Date().toISOString().split("T")[0] }
          : i
      )
    );
    toast.success("✅ تم تأكيد اكتمال الدفع");
    setPayModal(false);
    payForm.resetFields();
  };

  const handleMarkReviewed = (id: string) => {
    setInvoices((p) => p.map((i) => (i.id === id ? { ...i, status: "reviewed" } : i)));
    toast.success("تم تأكيد المراجعة");
  };

  const total = invoices.reduce((s, i) => s + i.amount, 0);
  const paid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter((i) => i.status === "pending").length;

  const columns = [
    {
      title: "رقم الفاتورة",
      dataIndex: "id",
      key: "id",
      render: (v: string) => <Text strong style={{ fontFamily: "monospace" }}>{v}</Text>,
    },
    { title: "مقدّم الطلب", dataIndex: "submittedBy", key: "submittedBy", render: (v: string) => <Text strong>{v}</Text> },
    { title: "الدور", dataIndex: "role", key: "role", render: (v: string) => <Tag color="blue">{v}</Tag> },
    {
      title: "الوصف", dataIndex: "description", key: "description",
      render: (v: string) => <Text style={{ color: "#595959" }}>{v}</Text>,
    },
    {
      title: "المبلغ",
      dataIndex: "amount",
      key: "amount",
      render: (v: number) => <Text strong style={{ color: "#1677ff" }}>{v.toLocaleString()} ر.س</Text>,
    },
    {
      title: "المرفق",
      dataIndex: "attachmentName",
      key: "attachmentName",
      render: (v?: string) =>
        v ? (
          <Space>
            <PaperClipOutlined style={{ color: "#1677ff" }} />
            <Text style={{ fontSize: 12, color: "#1677ff" }}>{v}</Text>
          </Space>
        ) : <Text style={{ color: "#bfbfbf" }}>لا يوجد</Text>,
    },
    { title: "تاريخ التقديم", dataIndex: "submittedDate", key: "submittedDate" },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      render: (v: keyof typeof STATUS_MAP, record: Invoice) => (
        <div>
          <Badge color={STATUS_MAP[v].color} text={STATUS_MAP[v].label} />
          {v === "paid" && record.paidDate && (
            <div>
              <Text style={{ fontSize: 11, color: "#52c41a" }}>تم الدفع: {record.paidDate}</Text>
            </div>
          )}
          {v === "paid" && record.paymentNote && (
            <Text style={{ fontSize: 11, color: "#8c8c8c" }}>{record.paymentNote}</Text>
          )}
        </div>
      ),
    },
    {
      title: "الإجراءات",
      key: "actions",
      render: (_: unknown, record: Invoice) => (
        <Space>
          {/* Accountant: can review and mark as paid */}
          {can(PERMISSIONS.MANAGE_INVOICES) && record.status === "pending" && (
            <Button size="small" onClick={() => handleMarkReviewed(record.id)}>
              تأكيد المراجعة
            </Button>
          )}
          {can(PERMISSIONS.MANAGE_INVOICES) && record.status === "reviewed" && (
            <Button
              size="small" type="primary" icon={<CheckCircleOutlined />}
              onClick={() => { setSelectedInvoice(record); setPayModal(true); }}
            >
              إتمام الدفع
            </Button>
          )}
          {record.status === "paid" && (
            <Tag icon={<CheckCircleOutlined />} color="success">مدفوعة</Tag>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PermissionGuard permission={PERMISSIONS.VIEW_INVOICES}>
      <div>
        {/* Header */}
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>الفواتير</Title>
            <Text style={{ color: "#8c8c8c" }}>خاص بأعضاء المؤسسة — غير مرئي للزوار</Text>
          </div>
          {/* Only riders can submit invoices */}
          {can(PERMISSIONS.SUBMIT_INVOICE) && (
            <Button
              type="primary" icon={<PlusOutlined />}
              onClick={() => { form.resetFields(); setSubmitModal(true); }}
              style={{ borderRadius: 8 }}
            >
              إرفاق فاتورة
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 16 }}>
          <StatsCard title="إجمالي الفواتير" value={`${total.toLocaleString()} ر.س`} icon={<DollarOutlined />} color="#1677ff" />
          <StatsCard title="تم الدفع" value={`${paid.toLocaleString()} ر.س`} icon={<CheckCircleOutlined />} color="#52c41a" />
          <StatsCard title="قيد المراجعة" value={pending} icon={<ClockCircleOutlined />} color="#faad14" />
          <StatsCard title="إجمالي الفواتير" value={invoices.length} icon={<FileTextOutlined />} color="#722ed1" />
        </div>

        {/* Filters */}
        <Card style={{ marginBottom: 16, borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <Space wrap>
            <Input prefix={<SearchOutlined />} placeholder="ابحث بالاسم أو الوصف أو الرقم" value={search}
              onChange={(e) => setSearch(e.target.value)} style={{ width: 280, borderRadius: 8 }} />
            <Select placeholder="الحالة" allowClear value={statusFilter} onChange={setStatusFilter} style={{ width: 180 }}>
              <Option value="pending">قيد المراجعة</Option>
              <Option value="reviewed">تمت المراجعة</Option>
              <Option value="paid">اكتمل الدفع</Option>
            </Select>
          </Space>
        </Card>

        {/* Table */}
        <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <Table dataSource={filtered} columns={columns} rowKey="id" scroll={{ x: true }}
            rowClassName={(r) => r.status === "paid" ? "paid-row" : ""}
          />
        </Card>

        {/* Submit Invoice Modal (Riders) */}
        <Modal
          title="إرفاق فاتورة جديدة"
          open={submitModal}
          onCancel={() => setSubmitModal(false)}
          onOk={() => form.submit()}
          okText="إرسال للمحاسبة"
          width={520}
        >
          <Alert
            message="ملاحظة: الفاتورة ستكون خاصة ولن يراها إلا أعضاء المحاسبة"
            type="info" showIcon style={{ marginBottom: 16, borderRadius: 8 }}
          />
          <Form form={form} layout="vertical" onFinish={handleSubmitInvoice}>
            <Form.Item name="submittedBy" label="اسمك" rules={[{ required: true }]}>
              <Input placeholder="اسمك الكامل" />
            </Form.Item>
            <Form.Item name="description" label="وصف الفاتورة" rules={[{ required: true }]}>
              <TextArea rows={3} placeholder="اشرح سبب الفاتورة بالتفصيل..." />
            </Form.Item>
            <Form.Item name="amount" label="المبلغ (ر.س)" rules={[{ required: true }]}>
              <Input type="number" min={0} placeholder="مثال: 1200" />
            </Form.Item>
            <Form.Item label="إرفاق الفاتورة (صورة أو PDF)">
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>اختر الملف</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>

        {/* Mark as Paid Modal (Accountants) */}
        <Modal
          title={`إتمام الدفع — ${selectedInvoice?.id}`}
          open={payModal}
          onCancel={() => setPayModal(false)}
          onOk={() => payForm.submit()}
          okText="✅ تأكيد اكتمال الدفع"
          okButtonProps={{ style: { background: "#52c41a", border: "none" } }}
        >
          {selectedInvoice && (
            <div style={{ marginBottom: 16, padding: 12, background: "#f6ffed", borderRadius: 8, border: "1px solid #b7eb8f" }}>
              <Text strong>{selectedInvoice.submittedBy}</Text>
              <br />
              <Text>{selectedInvoice.description}</Text>
              <br />
              <Text strong style={{ color: "#1677ff", fontSize: 16 }}>
                {selectedInvoice.amount.toLocaleString()} ر.س
              </Text>
            </div>
          )}
          <Form form={payForm} layout="vertical" onFinish={handleMarkPaid}>
            <Form.Item name="paymentNote" label="ملاحظة الدفع" rules={[{ required: true }]}>
              <TextArea rows={2} placeholder="مثال: تم التحويل البنكي — رقم العملية: 123456" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PermissionGuard>
  );
}
