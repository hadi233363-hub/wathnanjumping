// ─── Common ────────────────────────────────────────────────────────────────────

export type Status = "active" | "inactive" | "pending" | "approved" | "rejected";

// ─── Horse ─────────────────────────────────────────────────────────────────────

export type HorseGender = "male" | "female";
export type HorseStatus = "active" | "training" | "resting" | "injured" | "inactive";

export interface Horse {
  id: string;
  name: string;
  gender: HorseGender;
  status: HorseStatus;
  breed: string;
  age: number;
  owner: string;
  createdAt: string;
}

// ─── User ──────────────────────────────────────────────────────────────────────

export interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

// ─── Booking ───────────────────────────────────────────────────────────────────

export type BookingStatus = "confirmed" | "pending" | "canceled";
export type WellnessType = "physio" | "workout" | "both";
export type ServiceLocation = "on-site" | "off-site";

export interface Booking {
  id: string;
  horseName: string;
  expertName: string;
  status: BookingStatus;
  wellnessType: WellnessType;
  location: ServiceLocation;
  date: string;
  createdAt: string;
}

// ─── Report ────────────────────────────────────────────────────────────────────

export type ReportStatus = "approved" | "pending" | "rejected";

export interface Report {
  id: string;
  title: string;
  type: string;
  expertName: string;
  horseName: string;
  sessionId: string;
  date: string;
  status: ReportStatus;
  tag: string;
}

// ─── Inventory ─────────────────────────────────────────────────────────────────

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  stockStatus: StockStatus;
  lastUpdated: string;
}

// ─── Finance ───────────────────────────────────────────────────────────────────

export type ExpenseStatus = "approved" | "pending" | "rejected";
export type ServiceCategory =
  | "Feed"
  | "Veterinary"
  | "Farrier"
  | "Supplements"
  | "Transport"
  | "Equipment"
  | "Competition";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ServiceCategory;
  status: ExpenseStatus;
  submittedBy: string;
  date: string;
}
