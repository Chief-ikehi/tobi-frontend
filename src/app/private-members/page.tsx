// app/private-members/page.tsx
import Details from "@/components/PrivateDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Membership - TOBI",
  description: "Join our exclusive membership program for special benefits and privileges",
  icons: "/images/tobi-favicon.png"
};


export default function PrivateMembers() {
  return <Details />
}