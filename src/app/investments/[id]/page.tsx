import { Metadata } from "next";
import InvestmentPropertyDetails from "@/components/Investments/InvestmentPropertyDetails";

export const metadata: Metadata = {
  title: "Investment Property Details - TOBI",
  description: "View detailed information about this investment property",
};

type ParamsType = {
  params: Promise<{ id: string }>;
};

export default async function InvestmentPropertyPage({ params }: ParamsType) {
  const { id } = await params;
  return <InvestmentPropertyDetails propertyId={id} />;
} 