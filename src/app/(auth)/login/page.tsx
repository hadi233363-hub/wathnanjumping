"use client";

import { Form, Input, Button, Card, Typography, Divider, Tag, Space } from "antd";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/slices/authSlice";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const DEMO_ACCOUNTS = [
  { email: "admin@demo.com",      role: "مدير",   color: "#ff4d4f" },
  { email: "trainer@demo.com",    role: "مدرب",   color: "#52c41a" },
  { email: "rider@demo.com",      role: "فارس",   color: "#1677ff" },
  { email: "accountant@demo.com", role: "محاسب",  color: "#722ed1" },
  { email: "member@demo.com",     role: "عضو",    color: "#13c2c2" },
  { email: "visitor@demo.com",    role: "زائر",   color: "#8c8c8c" },
];

export default function LoginPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((s) => s.auth);

  const handleSubmit = async (values: { email: string; password: string }) => {
    const result = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(result)) {
      toast.success("مرحباً بك!");
      router.push("/");
    } else {
      toast.error((result.payload as string) || "بيانات الدخول غير صحيحة");
    }
  };

  const fillDemo = (email: string) => {
    form.setFieldsValue({ email, password: "demo123" });
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f5f6fa 0%, #e8f0fe 100%)",
      padding: 24,
    }}>
      <Card style={{
        width: "100%", maxWidth: 460,
        borderRadius: 20, border: "none",
        boxShadow: "0 8px 40px rgba(22,119,255,0.12)",
      }} bodyStyle={{ padding: "36px 36px 28px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #1677ff, #0050d0)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 24, marginBottom: 12,
          }}>B</div>
          <Title level={3} style={{ margin: 0 }}>Blue Atlantic</Title>
          <Text style={{ color: "#8c8c8c" }}>تسجيل الدخول للوحة الإدارة</Text>
        </div>

        <Divider style={{ margin: "0 0 20px" }} />

        {/* Demo Accounts */}
        <div style={{ marginBottom: 20, padding: 12, background: "#f6ffed", borderRadius: 10, border: "1px solid #b7eb8f" }}>
          <Text strong style={{ fontSize: 12, display: "block", marginBottom: 8, color: "#52c41a" }}>
            🧪 حسابات تجريبية — كلمة المرور: demo123
          </Text>
          <Space wrap size={4}>
            {DEMO_ACCOUNTS.map((acc) => (
              <Tag
                key={acc.email}
                color={acc.color}
                style={{ cursor: "pointer", borderRadius: 6 }}
                onClick={() => fillDemo(acc.email)}
              >
                {acc.role}
              </Tag>
            ))}
          </Space>
        </div>

        {/* Form */}
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item name="email" label="البريد الإلكتروني"
            rules={[{ required: true, message: "أدخل البريد الإلكتروني" }, { type: "email" }]}>
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="admin@demo.com" size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item name="password" label="كلمة المرور"
            rules={[{ required: true, message: "أدخل كلمة المرور" }]}>
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="demo123" size="large"
              style={{ borderRadius: 10 }}
              iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary" htmlType="submit" size="large"
              loading={isLoading} block
              style={{
                borderRadius: 10, height: 48, fontSize: 16, fontWeight: 700,
                background: "linear-gradient(135deg, #1677ff, #0050d0)", border: "none",
              }}
            >
              دخول
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
