// app/dashboard/page.tsx
import Dashboard from '@/components/Dashboard'
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "User's Dashboard Page - TOBI",

  // other metadata
  description: "Your Personal dashboard on TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function DashboardPage() {
  return <Dashboard />
}