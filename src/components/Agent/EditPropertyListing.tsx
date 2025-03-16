"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { NewPropertyListing } from "./NewPropertyListing";

interface EditPropertyListingProps {
  id: string;
}

export function EditPropertyListing({ id }: EditPropertyListingProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [propertyData, setPropertyData] = useState<any>(null);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/agent/listings/${id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch property data");
        }

        const data = await response.json();
        setPropertyData(data);
      } catch (error) {
        console.error("Error fetching property data:", error);
        toast.error("Failed to load property data");
        router.push("/agent/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchPropertyData();
    }
  }, [id, session, router]);

  if (loading || !propertyData) {
    return (
      <div className="container mx-auto max-w-3xl space-y-6 p-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-md bg-muted" />
          <div className="h-32 animate-pulse rounded-md bg-muted" />
          <div className="h-32 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <NewPropertyListing
      mode="edit"
      initialData={propertyData}
      propertyId={id}
    />
  );
} 