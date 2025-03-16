import { Metadata } from "next";
import { InvestmentReports } from "@/components/Investments/InvestmentReports";

export const metadata: Metadata = {
  title: "Investment Reports - TOBI",
  description: "View detailed reports and analytics for your real estate investments",
};

export default function InvestmentReportsPage() {
  return <InvestmentReports />;
} 