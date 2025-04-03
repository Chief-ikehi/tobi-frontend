// app/agent/properties/page.tsx
import MyListings from '@/components/Agent/MyListings'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent's Listing Page - TOBI",

  // other metadata
  description: "This is the Agent's Listing page for TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function MyListingsPage() {
  return <MyListings />
}