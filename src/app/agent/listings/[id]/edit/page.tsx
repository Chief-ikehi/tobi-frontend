import { Metadata } from "next";
import { EditPropertyListing } from "@/components/Agent/EditPropertyListing";

export const metadata: Metadata = {
  title: "Edit Property - TOBI",
  description: "Edit your property listing details",
};

type ParamsType = {
  params: Promise<{ id: string }>;
};

export default async function EditPropertyListingPage({ params }: ParamsType) {
  const { id } = await params;
  return <EditPropertyListing id={id} />;
}