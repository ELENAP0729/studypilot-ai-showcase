import { demoAccounts } from "@/lib/auth/demo-accounts";

export type DemoOrder = {
  id: string;
  ownerEmail: string;
  item: string;
  category: string;
  status: "Paid" | "Processing" | "Delivered" | "Refund requested";
  date: string;
  total: number;
};

export type DemoHistory = {
  id: string;
  ownerEmail: string;
  type: "Analysis" | "Product" | "Roadmap" | "Admin";
  title: string;
  summary: string;
  date: string;
  score?: number;
};

export const demoUsers = [
  {
    id: demoAccounts.student.id,
    name: demoAccounts.student.name,
    email: demoAccounts.student.email,
    role: demoAccounts.student.role,
    status: "Active",
    lastSeen: "Today 10:42",
    orders: 3,
    analyses: 4
  },
  {
    id: "user-002",
    name: "Jordan Lee",
    email: "jordan.lee@example.com",
    role: "student",
    status: "Active",
    lastSeen: "Yesterday 18:12",
    orders: 2,
    analyses: 6
  },
  {
    id: "user-003",
    name: "Priya Shah",
    email: "priya.shah@example.com",
    role: "student",
    status: "Review",
    lastSeen: "Mon 09:05",
    orders: 1,
    analyses: 2
  },
  {
    id: demoAccounts.admin.id,
    name: demoAccounts.admin.name,
    email: demoAccounts.admin.email,
    role: demoAccounts.admin.role,
    status: "Admin",
    lastSeen: "Online now",
    orders: 0,
    analyses: 0
  }
];

export const demoOrders: DemoOrder[] = [
  {
    id: "ORD-1007",
    ownerEmail: demoAccounts.student.email,
    item: "AI Mentor Agent",
    category: "AI Tools",
    status: "Delivered",
    date: "2026-06-12",
    total: 59
  },
  {
    id: "ORD-1008",
    ownerEmail: demoAccounts.student.email,
    item: "Focus Flow Planner",
    category: "Productivity",
    status: "Paid",
    date: "2026-06-14",
    total: 29
  },
  {
    id: "ORD-1009",
    ownerEmail: demoAccounts.student.email,
    item: "Supabase Schema Studio",
    category: "Developer Kit",
    status: "Processing",
    date: "2026-06-16",
    total: 39
  },
  {
    id: "ORD-1010",
    ownerEmail: "jordan.lee@example.com",
    item: "Assignment Brief Parser",
    category: "AI Tools",
    status: "Delivered",
    date: "2026-06-13",
    total: 49
  },
  {
    id: "ORD-1011",
    ownerEmail: "jordan.lee@example.com",
    item: "Pilot Analytics Board",
    category: "Analytics",
    status: "Paid",
    date: "2026-06-15",
    total: 45
  },
  {
    id: "ORD-1012",
    ownerEmail: "priya.shah@example.com",
    item: "Demo Polish Pack",
    category: "Presentation",
    status: "Refund requested",
    date: "2026-06-17",
    total: 19
  }
];

export const demoHistory: DemoHistory[] = [
  {
    id: "HIS-201",
    ownerEmail: demoAccounts.student.email,
    type: "Analysis",
    title: "AI habit tracker project analysis",
    summary: "Risk score moved from 72 to 58 after scope was reduced to one core flow.",
    date: "2026-06-17",
    score: 58
  },
  {
    id: "HIS-202",
    ownerEmail: demoAccounts.student.email,
    type: "Roadmap",
    title: "Four-week prototype roadmap generated",
    summary: "Created milestones for auth, database schema, AI feedback API and demo polish.",
    date: "2026-06-15"
  },
  {
    id: "HIS-203",
    ownerEmail: demoAccounts.student.email,
    type: "Product",
    title: "Saved AI Mentor Agent",
    summary: "Added to saved products from the product showcase page.",
    date: "2026-06-14"
  },
  {
    id: "HIS-204",
    ownerEmail: "jordan.lee@example.com",
    type: "Analysis",
    title: "Finance dashboard risk analysis",
    summary: "Deadline pressure was high, but technical readiness was strong.",
    date: "2026-06-16",
    score: 63
  },
  {
    id: "HIS-205",
    ownerEmail: "priya.shah@example.com",
    type: "Analysis",
    title: "Research assistant project analysis",
    summary: "Scope creep detected from too many AI tools and unclear evaluation criteria.",
    date: "2026-06-16",
    score: 79
  },
  {
    id: "HIS-206",
    ownerEmail: demoAccounts.admin.email,
    type: "Admin",
    title: "Catalog updated",
    summary: "Admin changed product visibility and refreshed the demo product list.",
    date: "2026-06-18"
  }
];

export const demoCatalogItems = [
  { id: "CAT-01", name: "AI Mentor Agent", category: "AI Tools", price: 59, status: "Published" },
  { id: "CAT-02", name: "Focus Flow Planner", category: "Productivity", price: 29, status: "Published" },
  { id: "CAT-03", name: "Supabase Schema Studio", category: "Developer Kit", price: 39, status: "Draft" }
];
