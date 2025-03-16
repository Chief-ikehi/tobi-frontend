import { Metadata } from "next";
import { InvestmentPropertyManagement } from "@/components/Investments/InvestmentPropertyManagement";

export const metadata: Metadata = {
  title: "Property Management - TOBI",
  description: "Manage your investment properties and track their performance",
};

export default function InvestmentPropertyManagementPage() {
  return <InvestmentPropertyManagement />;
} 