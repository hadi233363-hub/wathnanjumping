"use client";

import { useState } from "react";
import { Card, Table, Tag, Button, Input, Select, Space, Typography, Modal, Form, Badge } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { InventoryItem, StockStatus } from "@/types";
import { toast } from "react-toastify";

const { Text, Title } = Typography;
const { Option } = Select;

const STOCK_COLOR: Record<StockStatus, string> = {
  in_stock: "green",
  low_stock: "orange",
  out_of_stock: "red",
};

const initialItems: InventoryItem[] = [
  { id: "1", name: "Hay Bales", category: "Feed", quantity: 240, unit: "bale", stockStatus: "in_stock", lastUpdated: "2026-04-04" },
  { id: "2", name: "Horse Feed Mix", category: "Feed", quantity: 15, unit: "kg", stockStatus: "low_stock", lastUpdated: "2026-04-03" },
  { id: "3", name: "Antibiotics (Pen-G)", category: "Veterinary", quantity: 0, unit: "vial", stockStatus: "out_of_stock", lastUpdated: "2026-04-01" },
  { id: "4", name: "Hoof Pick", category: "Equipment", quantity: 12, unit: "pc", stockStatus: "in_stock", lastUpdated: "2026-03-28" },
  { id: "5", name: "Joint Supplement", category: "Supplements", quantity: 8, unit: "bottle", stockStatus: "low_stock", lastUpdated: "2026-04-02" },
  { id: "6", name: "Saddle Pad", category: "Equipment", quantity: 20, unit: "pc", stockStatus: "in_stock", lastUpdated: "2026-03-25" },
];

const categories = ["Feed", "Veterinary", "Farrier", "Supplements", "Transport", "Equipment"];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [stockFilter, setStockFilter] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [form] = Form.useForm();

  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || i.category === categoryFilter;
    const matchStock = !stockFilter || i.stockStatus === stockFilter;
    return matchSearch && matchCat && matchStock;
  });

  const openAdd = () => { setEditingItem(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (item: InventoryItem) => { setEditingItem(item); form.setFieldsValue(item); setModalOpen(true); };
  const handleDelete = (id: string) => { setItems((p) => p.filter((i) => i.id !== id)); toast.success("Item removed"); };

  const handleSubmit = (values: Partial<InventoryItem>) => {
    if (editingItem) {
      setItems((p) => p.map((i) => (i.id === editingItem.id ? { ...i, ...values } : i)));
      toast.success("Item updated");
    } else {
      setItems((p) => [{ id: String(Date.now()), lastUpdated: new Date().toISOString().split("T")[0], ...values } as InventoryItem, ...p]);
      toast.success("Item added");
    }
    setModalOpen(false);
  };

  const columns = [
    { title: "Item Name", dataIndex: "name", key: "name", render: (v: string) => <Text strong>{v}</Text> },
    { title: "Category", dataIndex: "category", key: "category", render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: "Quantity", key: "qty", render: (_: unknown, r: InventoryItem) => `${r.quantity} ${r.unit}` },
    {
      title: "Stock Status", dataIndex: "stockStatus", key: "stockStatus",
      render: (v: StockStatus) => <Badge color={STOCK_COLOR[v]} text={v.replace(/_/g, " ")} />,
    },
    { title: "Last Updated", dataIndex: "lastUpdated", key: "lastUpdated" },
    {
      title: "Actions", key: "actions",
      render: (_: unknown, r: InventoryItem) => (
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
          <Title level={4} style={{ margin: 0 }}>Inventory</Title>
          <Text style={{ color: "#8c8c8c" }}>Track stock levels and supplies</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 8 }}>Add Item</Button>
      </div>

      <Card style={{ marginBottom: 16, borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Space wrap>
          <Input prefix={<SearchOutlined />} placeholder="Search item" value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ width: 220, borderRadius: 8 }} />
          <Select placeholder="Category" allowClear value={categoryFilter} onChange={setCategoryFilter} style={{ width: 160 }}>
            {categories.map((c) => <Option key={c} value={c}>{c}</Option>)}
          </Select>
          <Select placeholder="Stock Status" allowClear value={stockFilter} onChange={setStockFilter} style={{ width: 160 }}>
            <Option value="in_stock">In Stock</Option>
            <Option value="low_stock">Low Stock</Option>
            <Option value="out_of_stock">Out of Stock</Option>
          </Select>
        </Space>
      </Card>

      <Card style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <Table dataSource={filtered} columns={columns} rowKey="id" />
      </Card>

      <Modal title={editingItem ? "Edit Item" : "Add New Item"} open={modalOpen}
        onCancel={() => setModalOpen(false)} onOk={() => form.submit()} okText={editingItem ? "Update" : "Add"}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Item Name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>{categories.map((c) => <Option key={c} value={c}>{c}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}><Input type="number" min={0} /></Form.Item>
          <Form.Item name="unit" label="Unit (e.g. kg, bale, pc)" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="stockStatus" label="Stock Status" rules={[{ required: true }]}>
            <Select>
              <Option value="in_stock">In Stock</Option>
              <Option value="low_stock">Low Stock</Option>
              <Option value="out_of_stock">Out of Stock</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
