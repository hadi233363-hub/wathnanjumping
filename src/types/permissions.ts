// ─── All Available Permissions ─────────────────────────────────────────────────
export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: "view_dashboard",

  // Horses
  VIEW_HORSES: "view_horses",
  MANAGE_HORSES: "manage_horses",
  ADD_HORSE_REPORTS: "add_horse_reports",
  ADD_HEALTH_CHECKS: "add_health_checks",

  // Bookings
  VIEW_BOOKINGS: "view_bookings",
  MANAGE_BOOKINGS: "manage_bookings",

  // Wellness
  VIEW_WELLNESS: "view_wellness",
  MANAGE_WELLNESS: "manage_wellness",

  // Invoices (members only — NOT visitors)
  VIEW_INVOICES: "view_invoices",
  SUBMIT_INVOICE: "submit_invoice",       // Riders: submit their own invoices
  MANAGE_INVOICES: "manage_invoices",     // Accountants: approve/complete payments

  // Finance
  VIEW_FINANCE: "view_finance",
  MANAGE_FINANCE: "manage_finance",

  // Inventory
  VIEW_INVENTORY: "view_inventory",
  MANAGE_INVENTORY: "manage_inventory",

  // Reports
  VIEW_REPORTS: "view_reports",
  MANAGE_REPORTS: "manage_reports",

  // Media
  VIEW_MEDIA: "view_media",
  MANAGE_MEDIA: "manage_media",

  // Reimbursement
  VIEW_REIMBURSEMENT: "view_reimbursement",
  MANAGE_REIMBURSEMENT: "manage_reimbursement",

  // Users & Roles (Admin only)
  MANAGE_USERS: "manage_users",
  MANAGE_ROLES: "manage_roles",

  // System
  VIEW_AUDIT: "view_audit",
  VIEW_NOTIFICATIONS: "view_notifications",
  MANAGE_SETTINGS: "manage_settings",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ─── Permission Groups (for UI display like Discord) ───────────────────────────
export const PERMISSION_GROUPS = [
  {
    group: "عام",
    color: "#1677ff",
    items: [
      { key: PERMISSIONS.VIEW_DASHBOARD, label: "عرض لوحة التحكم", description: "يمكنه رؤية الصفحة الرئيسية" },
      { key: PERMISSIONS.VIEW_NOTIFICATIONS, label: "عرض الإشعارات", description: "يمكنه رؤية الإشعارات" },
    ],
  },
  {
    group: "الخيول",
    color: "#52c41a",
    items: [
      { key: PERMISSIONS.VIEW_HORSES, label: "عرض الخيول", description: "يمكنه رؤية قائمة الخيول" },
      { key: PERMISSIONS.MANAGE_HORSES, label: "إدارة الخيول", description: "يمكنه إضافة وتعديل وحذف الخيول" },
      { key: PERMISSIONS.ADD_HORSE_REPORTS, label: "إضافة تقارير الخيول", description: "يمكنه إضافة تقارير للخيول" },
      { key: PERMISSIONS.ADD_HEALTH_CHECKS, label: "إضافة فحوصات صحية", description: "يمكنه إضافة فحوصات وعلاج الخيول" },
    ],
  },
  {
    group: "الحجوزات والجلسات",
    color: "#faad14",
    items: [
      { key: PERMISSIONS.VIEW_BOOKINGS, label: "عرض الحجوزات", description: "يمكنه رؤية الحجوزات" },
      { key: PERMISSIONS.MANAGE_BOOKINGS, label: "إدارة الحجوزات", description: "يمكنه إنشاء وتعديل الحجوزات" },
      { key: PERMISSIONS.VIEW_WELLNESS, label: "عرض جلسات العافية", description: "يمكنه رؤية جلسات العافية" },
      { key: PERMISSIONS.MANAGE_WELLNESS, label: "إدارة جلسات العافية", description: "يمكنه إدارة جلسات العافية" },
    ],
  },
  {
    group: "الفواتير (أعضاء المؤسسة فقط)",
    color: "#722ed1",
    items: [
      { key: PERMISSIONS.VIEW_INVOICES, label: "عرض الفواتير", description: "يمكنه رؤية الفواتير — لا يُعطى للزوار" },
      { key: PERMISSIONS.SUBMIT_INVOICE, label: "إرفاق فاتورة", description: "الفرسان: يمكنهم إرفاق فواتيرهم الخاصة" },
      { key: PERMISSIONS.MANAGE_INVOICES, label: "إدارة الفواتير", description: "المحاسب: يمكنه الموافقة وإتمام الدفع" },
    ],
  },
  {
    group: "المالية والمخزون",
    color: "#13c2c2",
    items: [
      { key: PERMISSIONS.VIEW_FINANCE, label: "عرض المالية", description: "يمكنه رؤية المصروفات" },
      { key: PERMISSIONS.MANAGE_FINANCE, label: "إدارة المالية", description: "يمكنه إدارة المصروفات والموافقة عليها" },
      { key: PERMISSIONS.VIEW_INVENTORY, label: "عرض المخزون", description: "يمكنه رؤية المخزون" },
      { key: PERMISSIONS.MANAGE_INVENTORY, label: "إدارة المخزون", description: "يمكنه تعديل المخزون" },
      { key: PERMISSIONS.VIEW_REIMBURSEMENT, label: "عرض التعويضات", description: "يمكنه رؤية طلبات التعويض" },
      { key: PERMISSIONS.MANAGE_REIMBURSEMENT, label: "إدارة التعويضات", description: "يمكنه الموافقة على التعويضات" },
    ],
  },
  {
    group: "التقارير والوسائط",
    color: "#fa8c16",
    items: [
      { key: PERMISSIONS.VIEW_REPORTS, label: "عرض التقارير", description: "يمكنه رؤية التقارير" },
      { key: PERMISSIONS.MANAGE_REPORTS, label: "إدارة التقارير", description: "يمكنه إنشاء وتعديل التقارير" },
      { key: PERMISSIONS.VIEW_MEDIA, label: "عرض مكتبة الوسائط", description: "يمكنه رؤية الملفات" },
      { key: PERMISSIONS.MANAGE_MEDIA, label: "إدارة مكتبة الوسائط", description: "يمكنه رفع وحذف الملفات" },
    ],
  },
  {
    group: "الإدارة (أدمن فقط)",
    color: "#ff4d4f",
    items: [
      { key: PERMISSIONS.MANAGE_USERS, label: "إدارة المستخدمين", description: "يمكنه إضافة وتعديل المستخدمين" },
      { key: PERMISSIONS.MANAGE_ROLES, label: "إدارة الصلاحيات", description: "يمكنه إنشاء وتعديل الأدوار" },
      { key: PERMISSIONS.VIEW_AUDIT, label: "عرض سجل المراقبة", description: "يمكنه رؤية سجل الأنشطة" },
      { key: PERMISSIONS.MANAGE_SETTINGS, label: "إدارة الإعدادات", description: "يمكنه تعديل إعدادات النظام" },
    ],
  },
];

// ─── Predefined Roles ──────────────────────────────────────────────────────────
export interface Role {
  id: string;
  name: string;
  nameAr: string;
  color: string;
  isDefault?: boolean;  // Cannot be deleted
  permissions: Permission[];
}

export const DEFAULT_ROLES: Role[] = [
  {
    id: "admin",
    name: "Admin",
    nameAr: "مدير",
    color: "#ff4d4f",
    isDefault: true,
    permissions: Object.values(PERMISSIONS) as Permission[],
  },
  {
    id: "trainer",
    name: "Trainer",
    nameAr: "مدرب",
    color: "#52c41a",
    isDefault: true,
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_HORSES,
      PERMISSIONS.MANAGE_HORSES,
      PERMISSIONS.ADD_HORSE_REPORTS,
      PERMISSIONS.ADD_HEALTH_CHECKS,
      PERMISSIONS.VIEW_BOOKINGS,
      PERMISSIONS.VIEW_WELLNESS,
      PERMISSIONS.MANAGE_WELLNESS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.ADD_HORSE_REPORTS,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
  },
  {
    id: "rider",
    name: "Rider",
    nameAr: "فارس",
    color: "#1677ff",
    isDefault: true,
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_HORSES,
      PERMISSIONS.VIEW_BOOKINGS,
      PERMISSIONS.VIEW_WELLNESS,
      PERMISSIONS.VIEW_INVOICES,
      PERMISSIONS.SUBMIT_INVOICE,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
  },
  {
    id: "accountant",
    name: "Accountant",
    nameAr: "محاسب",
    color: "#722ed1",
    isDefault: true,
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_INVOICES,
      PERMISSIONS.MANAGE_INVOICES,
      PERMISSIONS.VIEW_FINANCE,
      PERMISSIONS.MANAGE_FINANCE,
      PERMISSIONS.VIEW_REIMBURSEMENT,
      PERMISSIONS.MANAGE_REIMBURSEMENT,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
  },
  {
    id: "member",
    name: "Member",
    nameAr: "عضو",
    color: "#13c2c2",
    isDefault: true,
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_HORSES,
      PERMISSIONS.VIEW_BOOKINGS,
      PERMISSIONS.VIEW_INVOICES,
      PERMISSIONS.VIEW_NOTIFICATIONS,
    ],
  },
  {
    id: "visitor",
    name: "Visitor",
    nameAr: "زائر",
    color: "#8c8c8c",
    isDefault: true,
    permissions: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_HORSES,
      PERMISSIONS.VIEW_BOOKINGS,
      // ❌ NO VIEW_INVOICES — visitors cannot see invoices
    ],
  },
];
