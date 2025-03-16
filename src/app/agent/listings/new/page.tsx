import { Metadata } from "next";
import { NewPropertyListing } from "@/components/Agent/NewPropertyListing";

export const metadata: Metadata = {
  title: "Add New Property - TOBI",
  description: "Create a new property listing for short-let or investment",
};

export default function NewPropertyListingPage() {
  return <NewPropertyListing />;
} 