"use client";

import { Result, Button } from "antd";
import { useRouter } from "next/navigation";
import { Permission } from "@/types/permissions";
import { usePermissions } from "@/hooks/usePermissions";

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PermissionGuard({
  permission,
  children,
  fallback,
}: PermissionGuardProps) {
  const { can } = usePermissions();
  const router = useRouter();

  if (!can(permission)) {
    if (fallback) return <>{fallback}</>;
    return (
      <Result
        status="403"
        title="غير مصرح"
        subTitle="ليس لديك صلاحية للوصول إلى هذه الصفحة. تواصل مع المدير لتغيير صلاحياتك."
        extra={
          <Button type="primary" onClick={() => router.push("/")}>
            العودة للرئيسية
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
}
