// app/private-members/page.tsx
import PrivateHero from "@/components/PrivateHero";
import Details from "@/components/PrivateDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
      title: "Private Member's Page - TOBI",

  // other metadata
  description: "This is the Private Member's page for TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function PrivateMembers() {
  return (
    <main>
    <PrivateHero />
    <Details />
    </main>
  );
}