import type { Metadata } from "next";
import { ProductsShowcase } from "@/components/products-showcase";

export const metadata: Metadata = {
  title: "Products | StudyPilot AI",
  description: "Dynamic product showcase page for StudyPilot AI"
};

export default function ProductsPage() {
  return <ProductsShowcase />;
}
