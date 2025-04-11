// app/investor-portal/page.tsx
import Hero from "@/components/InvestorHero";
import Details from "@/components/InvestorDetails"
import InvestorPortalLanding from "@/components/InvestorPortalLanding";
import { Metadata } from "next";

export const metadata: Metadata = {
      title: "Investor's Portal Page - TOBI",

  // other metadata
  description: "This is the Investor's Portal page for TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function InvestorPortal() {
  return (
    <main>
    <InvestorPortalLanding />
    </main>
  );
}