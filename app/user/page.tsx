import type { Metadata } from "next";
import { UserDashboard } from "@/components/user-dashboard";

export const metadata: Metadata = {
  title: "My Page | StudyPilot AI",
  description: "User workspace with orders and history"
};

export default function UserPage() {
  return <UserDashboard />;
}
