import { Metadata } from "next";
import { AgentDashboard } from "@/components/Agent/AgentDashboard";

export const metadata: Metadata = {
  title: "Agent Dashboard - TOBI",
  description: "Manage your property listings, track commissions, and view analytics",
};

export default function AgentDashboardPage() {
  return <AgentDashboard />;
} 