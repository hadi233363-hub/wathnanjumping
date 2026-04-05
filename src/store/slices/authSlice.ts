import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/login", credentials);
      return res.data;
    } catch (err: unknown) {
      // ── Demo mode: simulate login if API not available ──────────────────────
      const error = err as { code?: string; response?: { data?: { message?: string } } };
      if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
        const demoUsers: Record<string, User> = {
          "admin@demo.com":       { id: "1", name: "أحمد المدير", email: "admin@demo.com", role: "admin" },
          "trainer@demo.com":     { id: "2", name: "خالد المدرب", email: "trainer@demo.com", role: "trainer" },
          "rider@demo.com":       { id: "3", name: "محمد الفارس", email: "rider@demo.com", role: "rider" },
          "accountant@demo.com":  { id: "4", name: "فاطمة المحاسبة", email: "accountant@demo.com", role: "accountant" },
          "member@demo.com":      { id: "5", name: "سارة العضو", email: "member@demo.com", role: "member" },
          "visitor@demo.com":     { id: "6", name: "زائر", email: "visitor@demo.com", role: "visitor" },
        };
        const demoUser = demoUsers[credentials.email];
        if (demoUser && credentials.password === "demo123") {
          return {
            user: demoUser,
            token: "demo-token",
            refreshToken: "demo-refresh",
          };
        }
      }
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "بيانات الدخول غير صحيحة"
      );
    }
  }
);

// Default demo admin user so the app works without login
const DEMO_ADMIN: User = {
  id: "1",
  name: "أحمد المدير",
  email: "admin@demo.com",
  role: "admin",
};

const getInitialState = (): AuthState => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : DEMO_ADMIN;
    return { user, token: token || "demo-token", refreshToken: refreshToken || "demo-refresh", isLoading: false, error: null };
  }
  return { user: DEMO_ADMIN, token: "demo-token", refreshToken: "demo-refresh", isLoading: false, error: null };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    },
    setCredentials(state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    // Set demo user for testing without backend
    setDemoUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.token = "demo-token";
      state.refreshToken = "demo-refresh";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("refreshToken", action.payload.refreshToken);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setCredentials, setDemoUser } = authSlice.actions;
export default authSlice.reducer;
