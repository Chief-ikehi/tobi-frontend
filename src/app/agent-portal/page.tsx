// app/agent-portal/page.tsx
import AgentHero from "@/components/AgentHero";
import Details from "@/components/AgentDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
      title: "Agent's Portal Page - TOBI",

  // other metadata
  description: "This is the Agent's Portal page for TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function AgentPortal() {
  return (
    <main>
    <AgentHero />
    <Details />
    </main>
  );
}