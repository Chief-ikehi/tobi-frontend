import { Metadata } from "next";
import { AgentVerification } from "@/components/Agent/AgentVerification";

export const metadata: Metadata = {
  title: "Agent Verification - TOBI",
  description: "Complete your agent verification to start listing properties",
};

export default function AgentVerificationPage() {
  return <AgentVerification />;
} 