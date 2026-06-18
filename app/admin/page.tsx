import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin | StudyPilot AI",
  description: "Admin dashboard with all data and upload management"
};

export default function AdminPage() {
  return <AdminDashboard />;
}
