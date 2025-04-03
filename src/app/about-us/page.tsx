// app/dashboard/page.tsx
import AboutUs from '@/components/AboutUs'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us Page - TOBI",

  // other metadata
  description: "This is the About Us Page on TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function DashboardPage() {
  return <AboutUs />
}