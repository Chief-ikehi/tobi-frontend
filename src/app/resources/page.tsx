import Resources from "@/components/Resources";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources - TOBI",
  description: "Educational resources, how-to videos, newsletters, and guides for TOBI users",
  icons: "/images/tobi-favicon.png"
};

export default function ResourcesPage() {
  return <Resources />;
}
