import { Metadata } from "next";
import MembershipHistory from "@/components/Membership/MembershipHistory";

export const metadata: Metadata = {
  title: "Membership History - TOBI",
  description: "View your membership history and past transactions",
};

export default function MembershipHistoryPage() {
  return <MembershipHistory />;
} 