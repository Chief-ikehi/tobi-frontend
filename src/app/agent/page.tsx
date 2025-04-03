// app/agent/page.tsx
import Dashboard from '@/components/Agent/Dashboard'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent's Dashboard Page - TOBI",

  // other metadata
  description: "This is the Agent's Dashboard page for TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function AgentDashboardPage() {
  return <Dashboard />
}