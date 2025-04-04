import Properties from "@/components/Properties";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties - TOBI",
  description: "Browse our collection of properties for short-let and investment",
  icons: "/images/tobi-favicon.png"
};

export default function PropertiesPage() {
  return <Properties />;
} 