import { Metadata } from "next";
import InvestorDashboard from "@/components/Investor/InvestorDashboard";

export const metadata: Metadata = {
  title: "Investor Portal - TOBI",
  description: "Track your investments, ROI, and payouts",
  icons: "/images/tobi-favicon.png"
};

export default function InvestorDashboardPage() {
  return <InvestorDashboard />;
}