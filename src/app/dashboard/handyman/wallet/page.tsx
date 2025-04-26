// app/dashboard/bookings/page.tsx
import WalletPage from '@/components/Dashboard/WalletPage'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User's Wallet Page - TOBI",

  // other metadata
  description: "Your Wallet Page on TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function DashboardPage() {
  return <WalletPage />
}