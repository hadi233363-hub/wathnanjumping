"use client";

import { useAppSelector } from "@/store/hooks";
import { Permission } from "@/types/permissions";

export function usePermissions() {
  const user = useAppSelector((s) => s.auth.user);
  const roles = useAppSelector((s) => s.roles.roles);

  // Get the user's role object
  const userRole = roles.find((r) => r.id === user?.role?.toLowerCase() || r.name === user?.role);

  // All permissions for this user
  const userPermissions: Permission[] = userRole?.permissions ?? [];

  // Check single permission
  const can = (permission: Permission): boolean => {
    // Admin always has all permissions
    if (userRole?.id === "admin") return true;
    return userPermissions.includes(permission);
  };

  // Check if user has ANY of the given permissions
  const canAny = (...permissions: Permission[]): boolean => {
    if (userRole?.id === "admin") return true;
    return permissions.some((p) => userPermissions.includes(p));
  };

  // Check if user has ALL of the given permissions
  const canAll = (...permissions: Permission[]): boolean => {
    if (userRole?.id === "admin") return true;
    return permissions.every((p) => userPermissions.includes(p));
  };

  return { can, canAny, canAll, userRole, userPermissions };
}
