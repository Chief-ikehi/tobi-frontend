// app/agent-portal/page.tsx
import AgentPortalLanding from "@/components/AgentPortalLanding";
import { Metadata } from "next";

export const metadata: Metadata = {
      title: "Agent's Portal Home Page - TOBI",

  // other metadata
  description: "This is the Agent's Portal Home page for TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function AgentPortal() {
  return <AgentPortalLanding />
}