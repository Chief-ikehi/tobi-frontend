import PropertyForm from '@/components/Agent/PropertyForm'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent's Property Listing's Page - TOBI",

  // other metadata
  description: "This is the Agent's Property Listing's Page for TOBI",
  icons: "/images/tobi-favicon.png"
};


export default function CreatePropertyPage() {
  return (
    <section className="py-10 container">
      <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
      <PropertyForm mode="create" />
    </section>
  )
}