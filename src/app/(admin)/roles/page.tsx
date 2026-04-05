"use client";

import { useState } from "react";
import {
  Card, Row, Col, Typography, Tag, Button, Switch, Space, Modal,
  Form, Input, ColorPicker, Popconfirm, Badge, Divider, Tooltip, Alert,
} from "antd";
import {
  PlusOutlined, DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined, CrownOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addRole, updateRole, deleteRole, togglePermission,
} from "@/store/slices/rolesSlice";
import { PERMISSION_GROUPS, Permission, Role } from "@/types/permissions";
import { toast } from "react-toastify";
import PermissionGuard from "@/components/guards/PermissionGuard";
import { PERMISSIONS } from "@/types/permissions";

const { Title, Text } = Typography;

export default function RolesPage() {
  const dispatch = useAppDispatch();
  const roles = useAppSelector((s) => s.roles.roles);

  const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleColor, setRoleColor] = useState("#1677ff");
  const [form] = Form.useForm();

  const openAdd = () => {
    setEditingRole(null);
    setRoleColor("#1677ff");
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (role: Role) => {
    setEditingRole(role);
    setRoleColor(role.color);
    form.setFieldsValue({ name: role.name, nameAr: role.nameAr });
    setModalOpen(true);
  };

  const handleSubmit = (values: { name: string; nameAr: string }) => {
    if (editingRole) {
      dispatch(updateRole({ id: editingRole.id, changes: { ...values, color: roleColor } }));
      if (selectedRole.id === editingRole.id) {
        setSelectedRole({ ...selectedRole, ...values, color: roleColor });
      }
      toast.success("تم تحديث الدور");
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        name: values.name,
        nameAr: values.nameAr,
        color: roleColor,
        permissions: [],
      };
      dispatch(addRole(newRole));
      toast.success("تم إنشاء الدور");
    }
    setModalOpen(false);
  };

  const handleDelete = (role: Role) => {
    dispatch(deleteRole(role.id));
    if (selectedRole.id === role.id) setSelectedRole(roles[0]);
    toast.success("تم حذف الدور");
  };

  const handleToggle = (roleId: string, permission: Permission) => {
    dispatch(togglePermission({ roleId, permission }));
    // Update local selected role display
    setSelectedRole((prev) => {
      const has = prev.permissions.includes(permission);
      return {
        ...prev,
        permissions: has
          ? prev.permissions.filter((p) => p !== permission)
          : [...prev.permissions, permission],
      };
    });
  };

  // Sync selected role with redux state
  const currentRole = roles.find((r) => r.id === selectedRole?.id) ?? roles[0];

  return (
    <PermissionGuard permission={PERMISSIONS.MANAGE_ROLES}>
      <div>
        {/* Header */}
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>إدارة الصلاحيات</Title>
            <Text style={{ color: "#8c8c8c" }}>أنشئ أدواراً وخصص صلاحيات لكل دور — مثل نظام Discord</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ borderRadius: 8 }}>
            إنشاء دور جديد
          </Button>
        </div>

        <Alert
          message="كيف يعمل النظام؟"
          description="اختر دوراً من اليسار، ثم فعّل أو أوقف الصلاحيات من اليمين. كل مستخدم يحمل دوراً واحداً تحدد ما يمكنه فعله في النظام."
          type="info"
          showIcon
          style={{ marginBottom: 16, borderRadius: 10 }}
        />

        <Row gutter={16}>
          {/* ── Left: Roles List ── */}
          <Col xs={24} md={7}>
            <Card
              title={<Text strong>الأدوار ({roles.length})</Text>}
              style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              bodyStyle={{ padding: 8 }}
            >
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                    background: currentRole.id === role.id ? "#f0f7ff" : "transparent",
                    border: currentRole.id === role.id ? "1px solid #1677ff30" : "1px solid transparent",
                    marginBottom: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.2s",
                  }}
                >
                  <Space>
                    <div
                      style={{
                        width: 12, height: 12, borderRadius: "50%",
                        background: role.color, flexShrink: 0,
                      }}
                    />
                    <div>
                      <Text strong style={{ fontSize: 14 }}>{role.nameAr}</Text>
                      <br />
                      <Text style={{ fontSize: 11, color: "#8c8c8c" }}>
                        {role.permissions.length} صلاحية
                      </Text>
                    </div>
                  </Space>
                  <Space>
                    {role.isDefault && (
                      <Tooltip title="دور افتراضي">
                        <CrownOutlined style={{ color: "#faad14" }} />
                      </Tooltip>
                    )}
                    <Button
                      size="small" type="text" icon={<EditOutlined />}
                      onClick={(e) => { e.stopPropagation(); openEdit(role); }}
                    />
                    {!role.isDefault && (
                      <Popconfirm
                        title="حذف هذا الدور؟"
                        onConfirm={(e) => { e?.stopPropagation(); handleDelete(role); }}
                      >
                        <Button
                          size="small" type="text" danger icon={<DeleteOutlined />}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>
                    )}
                  </Space>
                </div>
              ))}
            </Card>
          </Col>

          {/* ── Right: Permissions ── */}
          <Col xs={24} md={17}>
            <Card
              title={
                <Space>
                  <div
                    style={{
                      width: 14, height: 14, borderRadius: "50%",
                      background: currentRole.color,
                    }}
                  />
                  <Text strong>صلاحيات دور: {currentRole.nameAr}</Text>
                  <Tag color={currentRole.color}>{currentRole.permissions.length} صلاحية مفعّلة</Tag>
                </Space>
              }
              style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            >
              {PERMISSION_GROUPS.map((group) => (
                <div key={group.group} style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: group.color }} />
                    <Text strong style={{ fontSize: 15, color: group.color }}>{group.group}</Text>
                  </div>

                  <div style={{ display: "grid", gap: 8 }}>
                    {group.items.map((item) => {
                      const isEnabled = currentRole.permissions.includes(item.key as Permission);
                      return (
                        <div
                          key={item.key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 14px",
                            borderRadius: 8,
                            background: isEnabled ? `${group.color}10` : "#fafafa",
                            border: `1px solid ${isEnabled ? group.color + "30" : "#f0f0f0"}`,
                            transition: "all 0.2s",
                          }}
                        >
                          <Space>
                            {isEnabled
                              ? <UnlockOutlined style={{ color: group.color }} />
                              : <LockOutlined style={{ color: "#bfbfbf" }} />
                            }
                            <div>
                              <Text strong style={{ fontSize: 13 }}>{item.label}</Text>
                              <br />
                              <Text style={{ fontSize: 11, color: "#8c8c8c" }}>{item.description}</Text>
                            </div>
                          </Space>
                          <Switch
                            checked={isEnabled}
                            onChange={() => handleToggle(currentRole.id, item.key as Permission)}
                            style={{ background: isEnabled ? group.color : undefined }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <Divider style={{ margin: "16px 0 0" }} />
                </div>
              ))}
            </Card>
          </Col>
        </Row>

        {/* Add/Edit Modal */}
        <Modal
          title={editingRole ? "تعديل الدور" : "إنشاء دور جديد"}
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={() => form.submit()}
          okText={editingRole ? "حفظ" : "إنشاء"}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
            <Form.Item name="nameAr" label="اسم الدور بالعربي" rules={[{ required: true }]}>
              <Input placeholder="مثال: مشرف الخيل" />
            </Form.Item>
            <Form.Item name="name" label="اسم الدور بالإنجليزي" rules={[{ required: true }]}>
              <Input placeholder="مثال: Horse Supervisor" />
            </Form.Item>
            <Form.Item label="لون الدور">
              <Space wrap>
                {["#ff4d4f", "#fa8c16", "#faad14", "#52c41a", "#13c2c2", "#1677ff", "#722ed1", "#eb2f96"].map((c) => (
                  <div
                    key={c}
                    onClick={() => setRoleColor(c)}
                    style={{
                      width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer",
                      border: roleColor === c ? "3px solid #1a1a2e" : "3px solid transparent",
                      transition: "border 0.2s",
                    }}
                  />
                ))}
              </Space>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: roleColor }} />
                <Text style={{ color: "#8c8c8c" }}>اللون المختار</Text>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PermissionGuard>
  );
}
