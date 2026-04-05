import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role, Permission, DEFAULT_ROLES } from "@/types/permissions";

interface RolesState {
  roles: Role[];
}

const initialState: RolesState = {
  roles: DEFAULT_ROLES,
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    addRole(state, action: PayloadAction<Role>) {
      state.roles.push(action.payload);
    },

    updateRole(state, action: PayloadAction<{ id: string; changes: Partial<Role> }>) {
      const role = state.roles.find((r) => r.id === action.payload.id);
      if (role) Object.assign(role, action.payload.changes);
    },

    deleteRole(state, action: PayloadAction<string>) {
      state.roles = state.roles.filter(
        (r) => r.id !== action.payload || r.isDefault
      );
    },

    togglePermission(
      state,
      action: PayloadAction<{ roleId: string; permission: Permission }>
    ) {
      const role = state.roles.find((r) => r.id === action.payload.roleId);
      if (!role) return;
      const idx = role.permissions.indexOf(action.payload.permission);
      if (idx === -1) {
        role.permissions.push(action.payload.permission);
      } else {
        role.permissions.splice(idx, 1);
      }
    },

    setAllPermissions(
      state,
      action: PayloadAction<{ roleId: string; permissions: Permission[] }>
    ) {
      const role = state.roles.find((r) => r.id === action.payload.roleId);
      if (role) role.permissions = action.payload.permissions;
    },
  },
});

export const { addRole, updateRole, deleteRole, togglePermission, setAllPermissions } =
  rolesSlice.actions;
export default rolesSlice.reducer;
