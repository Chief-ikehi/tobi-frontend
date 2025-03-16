import { Metadata } from "next";
import InvestmentPropertyDetails from "@/components/Investments/InvestmentPropertyDetails";

export const metadata: Metadata = {
  title: "Property Details - TOBI",
  description: "View and manage your investment property details",
};

type ParamsType = {
  params: Promise<{ id: string }>;
};

export default async function InvestmentPropertyDetailsPage({ params }: ParamsType) {
  const { id } = await params;
  return <InvestmentPropertyDetails propertyId={id} />;
} 