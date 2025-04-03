// app/agent/page.tsx
import GiftPage from '@/components/Dashboard/GiftPage'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User's Gift Page - TOBI",

  // other metadata
  description: "This is the User's Gift page for TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function UserGiftPage() {
  return <GiftPage />
}