import { Metadata } from "next";
import { InvestmentDashboard } from "@/components/Investments/InvestmentDashboard";

export const metadata: Metadata = {
  title: "Investment Dashboard - TOBI",
  description: "Track your real estate investments, ROI, and property portfolio",
};

export default function InvestmentDashboardPage() {
  return <InvestmentDashboard />;
} 