import { Metadata } from "next";
import ServiceDetail from "@/components/Services/ServiceDetail";

export const metadata: Metadata = {
  title: "Service Details - TOBI",
  description: "View detailed information about this handyman service",
  icons: "/images/tobi-favicon.png"
};

type ParamsType = {
  params: Promise<{ id: string }>;
};

export default async function ServiceDetailPage({ params }: ParamsType) {
  const { id } = await params;
  return <ServiceDetail handymanId={id} />;
}