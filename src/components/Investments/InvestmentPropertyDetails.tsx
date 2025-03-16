"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Home,
  Wallet,
  MapPin,
  Calendar,
  Building,
  CheckCircle,
} from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentProperty } from "@/types/property";
import InvestmentPurchaseModal from "./InvestmentPurchaseModal";

interface InvestmentPropertyDetailsProps {
  propertyId: string;
}

const InvestmentPropertyDetails = ({ propertyId }: InvestmentPropertyDetailsProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [property, setProperty] = useState<InvestmentProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPurchaseType, setSelectedPurchaseType] = useState<"outright" | "installment">("outright");
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/properties/investment/${propertyId}`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch property");
        }

        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const calculateMonthlyPayment = () => {
    if (!property) return 0;
    const downPayment = property.installmentPrice * 0.6; // 60% down payment
    const balance = property.installmentPrice - downPayment;
    const months = 24; // 2 years
    return balance / months;
  };

  const handlePurchase = async () => {
    if (!session) {
      toast.error("Please sign in to proceed with the purchase");
      router.push("/auth/signin");
      return;
    }

    setShowPurchaseModal(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-64 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-[400px] rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="space-y-4">
              <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="rounded-lg bg-white p-8 text-center shadow-solid-8 dark:bg-blacksection">
          <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
            Property Not Found
          </h2>
          <p className="mb-8 text-body-color">
            We couldn't find the property you're looking for. It may have been removed or
            the URL might be incorrect.
          </p>
          <Link
            href="/investments"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Investment Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-32">
      {/* Back Button */}
      <Link
        href="/investments"
        className="mb-8 inline-flex items-center gap-2 text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Investment Properties
      </Link>

      {/* Property Title */}
      <h1 className="mb-8 text-4xl font-bold text-black dark:text-white">
        {property.title}
      </h1>

      {/* Property Images */}
      <div className="mb-12 grid gap-4 md:grid-cols-2">
        <div className="relative h-[400px] overflow-hidden rounded-lg">
          <Image
            src={property.images[0]}
            alt={property.title}
            className="object-cover"
            fill
          />
        </div>
        <div className="grid gap-4">
          {property.images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative h-[190px] overflow-hidden rounded-lg">
              <Image src={image} alt={property.title} className="object-cover" fill />
            </div>
          ))}
        </div>
      </div>

      {/* Property Details Grid */}
      <div className="mb-12 grid gap-8 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection">
            <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
              Property Details
            </h2>
            
            {/* Location */}
            <div className="mb-6 flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-black dark:text-white">Location</h3>
                <p className="text-body-color">{property.location}</p>
              </div>
            </div>

            {/* Property Type */}
            <div className="mb-6 flex items-start gap-3">
              <Building className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-black dark:text-white">Property Type</h3>
                <p className="text-body-color">{property.type}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-body-color">{property.description}</p>

            {/* Key Metrics */}
            <div className="mt-8 grid gap-6 border-t border-stroke pt-8 dark:border-strokedark md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-body-color">
                  <TrendingUp className="h-4 w-4" />
                  <span>Expected ROI</span>
                </div>
                <p className="text-2xl font-semibold text-primary">{property.roi}%</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-body-color">
                  <Users className="h-4 w-4" />
                  <span>Current Occupancy</span>
                </div>
                <p className="text-2xl font-semibold text-black dark:text-white">
                  {property.occupancyRate}%
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-body-color">
                  <Wallet className="h-4 w-4" />
                  <span>Monthly Income</span>
                </div>
                <p className="text-2xl font-semibold text-black dark:text-white">
                  {formatCurrency(property.monthlyIncome)}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-body-color">
                  <Home className="h-4 w-4" />
                  <span>Management Fee</span>
                </div>
                <p className="text-2xl font-semibold text-black dark:text-white">
                  {property.managementFee}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Options */}
        <div>
          <div className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection">
            <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
              Purchase Options
            </h2>

            <Tabs
              value={selectedPurchaseType}
              onValueChange={(value) =>
                setSelectedPurchaseType(value as "outright" | "installment")
              }
            >
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="outright">Outright</TabsTrigger>
                <TabsTrigger value="installment">Installment</TabsTrigger>
              </TabsList>

              <TabsContent value="outright">
                <div className="space-y-6">
                  <div>
                    <p className="mb-2 text-sm text-body-color">Purchase Price</p>
                    <p className="text-3xl font-bold text-black dark:text-white">
                      {formatCurrency(property.outrighPrice)}
                    </p>
                  </div>

                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm text-body-color">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Immediate full ownership
                    </li>
                    <li className="flex items-center gap-2 text-sm text-body-color">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Platinum membership included
                    </li>
                    <li className="flex items-center gap-2 text-sm text-body-color">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Optional T.O.B.I management
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="installment">
                <div className="space-y-6">
                  <div>
                    <p className="mb-2 text-sm text-body-color">Total Price</p>
                    <p className="text-3xl font-bold text-black dark:text-white">
                      {formatCurrency(property.installmentPrice)}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-body-color">
                        Down Payment:{" "}
                        <span className="font-semibold text-black dark:text-white">
                          {formatCurrency(property.installmentPrice * 0.6)}
                        </span>
                      </p>
                      <p className="text-sm text-body-color">
                        Monthly Payment:{" "}
                        <span className="font-semibold text-black dark:text-white">
                          {formatCurrency(calculateMonthlyPayment())}
                        </span>
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm text-body-color">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      60% down payment
                    </li>
                    <li className="flex items-center gap-2 text-sm text-body-color">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      24 months installment plan
                    </li>
                    <li className="flex items-center gap-2 text-sm text-body-color">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Gold membership included
                    </li>
                    <li className="flex items-center gap-2 text-sm text-body-color">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      T.O.B.I manages as short-let
                    </li>
                    <li className="flex items-center gap-2 text-sm text-body-color">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      ₦5M credit for short-let stays
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handlePurchase}
              className="mt-8 w-full"
              size="lg"
              variant="default"
            >
              Proceed with Purchase
            </Button>
          </div>
        </div>
      </div>

      {property && (
        <InvestmentPurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          property={property}
          purchaseType={selectedPurchaseType}
        />
      )}
    </div>
  );
};

export default InvestmentPropertyDetails; 