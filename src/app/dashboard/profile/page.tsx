// app/dashboard/page.tsx
import ProfileSettings from '@/components/Dashboard/ProfileSettings'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User's Profile Settings Page - TOBI",

  // other metadata
  description: "Your Profile Settings Page on TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function DashboardPage() {
  return <ProfileSettings />
}