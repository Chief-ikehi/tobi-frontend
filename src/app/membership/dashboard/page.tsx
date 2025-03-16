import { Metadata } from "next";
import MembershipDashboard from "@/components/Membership/MembershipDashboard";

export const metadata: Metadata = {
  title: "Membership Dashboard - TOBI",
  description: "View your membership status, benefits, and exclusive access",
};

export default function MembershipDashboardPage() {
  return <MembershipDashboard />;
} 