// app/agent/page.tsx
import EditPage from '@/components/Agent/EditPage'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent's Property Edit Page - TOBI",

  // other metadata
  description: "This is the Agent's Property Edit Page for TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function DashboardPage() {
  return <EditPage />
}