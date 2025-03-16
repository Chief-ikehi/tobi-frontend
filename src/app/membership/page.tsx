import { Metadata } from "next";
import MembershipPlans from "@/components/Membership/MembershipPlans";

export const metadata: Metadata = {
  title: "Private Membership - TOBI",
  description: "Join our exclusive membership program for special benefits and privileges",
};

export default function MembershipPage() {
  return <MembershipPlans />;
} 