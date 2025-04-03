// app/agent/page.tsx
import VerifyAgentPage from '@/components/Agent/VerifyAgentPage'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent's Verification Page - TOBI",

  // other metadata
  description: "This is the Agent's Verification page for TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function DashboardPage() {
  return <VerifyAgentPage />
}