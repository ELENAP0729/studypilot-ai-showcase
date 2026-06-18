export type DemoRole = "student" | "admin";

export type DemoAccount = {
  id: string;
  role: DemoRole;
  name: string;
  email: string;
  password: string;
  avatar: string;
  title: string;
};

export const demoAccounts: Record<DemoRole, DemoAccount> = {
  student: {
    id: "user-001",
    role: "student",
    name: "Elena",
    email: "student@studypilot.ai",
    password: "student123",
    avatar: "EL",
    title: "Student workspace account"
  },
  admin: {
    id: "admin-001",
    role: "admin",
    name: "Alex Admin",
    email: "admin@studypilot.ai",
    password: "admin123",
    avatar: "AA",
    title: "Admin operator account"
  }
};

export const demoCredentials = [demoAccounts.student, demoAccounts.admin];
