// app/agent/page.tsx
import WalletPage from '@/components/Agent/WalletPage'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent's Wallet Page - TOBI",

  // other metadata
  description: "This is the Agent's Wallet page for TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function DashboardPage() {
  return <WalletPage />
}