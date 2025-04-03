// app/dashboard/page.tsx
import MembershipPage from '@/components/Dashboard/MembershipPage'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User's Membership Page - TOBI",

  // other metadata
  description: "User's Membership Page on TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function DashboardPage() {
  return <MembershipPage />
}