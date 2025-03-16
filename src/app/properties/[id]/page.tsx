import { Metadata } from "next";
import PropertyDetails from "@/components/Properties/PropertyDetails";

export const metadata: Metadata = {
  title: "Property Details - TOBI",
  description: "View detailed information about this property",
};

type ParamsType = {
  params: Promise<{ id: string }>;
};

export default async function PropertyDetailsPage({ params }: ParamsType) {
  const { id } = await params;
  return <PropertyDetails propertyId={id} />;
} 