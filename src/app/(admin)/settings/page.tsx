"use client";

import { Card, Form, Input, Switch, Button, Typography, Divider, Select, Space } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const { Title, Text } = Typography;
const { Option } = Select;

export default function SettingsPage() {
  const [form] = Form.useForm();

  const handleSave = (values: unknown) => {
    console.log("Settings saved:", values);
    toast.success("Settings saved successfully");
  };

  return (
    <div>
      <div className="page-header">
        <Title level={4} style={{ margin: 0 }}>Settings</Title>
        <Text style={{ color: "#8c8c8c" }}>Configure platform settings</Text>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSave}
        initialValues={{ platformName: "Blue Atlantic", timezone: "Asia/Riyadh", language: "en", notifications: true, maintenanceMode: false }}>

        <Card title="General Settings" style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 16 }}>
          <Form.Item name="platformName" label="Platform Name"><Input style={{ maxWidth: 400 }} /></Form.Item>
          <Form.Item name="timezone" label="Timezone">
            <Select style={{ maxWidth: 400 }}>
              <Option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</Option>
              <Option value="Asia/Dubai">Asia/Dubai (GMT+4)</Option>
              <Option value="UTC">UTC</Option>
            </Select>
          </Form.Item>
          <Form.Item name="language" label="Language">
            <Select style={{ maxWidth: 400 }}>
              <Option value="en">English</Option>
              <Option value="ar">العربية</Option>
            </Select>
          </Form.Item>
        </Card>

        <Card title="Notifications" style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 16 }}>
          <Form.Item name="notifications" label="Enable Notifications" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="emailAlerts" label="Email Alerts" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>

        <Card title="System" style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 16 }}>
          <Form.Item name="maintenanceMode" label="Maintenance Mode" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="apiUrl" label="Backend API URL">
            <Input placeholder="https://api.example.com/v1" style={{ maxWidth: 480 }} />
          </Form.Item>
        </Card>

        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" style={{ borderRadius: 8 }}>
          Save Settings
        </Button>
      </Form>
    </div>
  );
}
