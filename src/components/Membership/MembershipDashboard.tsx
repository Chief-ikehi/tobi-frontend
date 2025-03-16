"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import {
  CreditCard,
  Gift,
  Home,
  Star,
  Calendar,
  Clock,
  TrendingUp,
  MessageSquare,
  Shield,
} from "lucide-react";

interface Membership {
  type: "SILVER" | "GOLD" | "PLATINUM";
  startDate: string;
  endDate?: string;
  credits?: number;
  exclusiveProperties: number;
  specialRates: number;
  investmentProperties?: number;
  roi?: number;
}

const MembershipDashboard = () => {
  const { data: session } = useSession();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembershipDetails = async () => {
      if (session?.user) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/membership/details`);
          if (response.ok) {
            const data = await response.json();
            setMembership(data);
          }
        } catch (error) {
          console.error("Error fetching membership details:", error);
          toast.error("Failed to load membership details");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchMembershipDetails();
  }, [session]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="space-y-8">
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-[200px] animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-black dark:text-white">
            No Active Membership
          </h1>
          <p className="mb-8 text-body-color">
            You don't have an active membership. Join our private membership program to
            unlock exclusive benefits.
          </p>
          <Link
            href="/membership"
            className="inline-flex items-center rounded-lg bg-primary px-8 py-4 text-white transition-all hover:bg-primary/90"
          >
            View Membership Plans
          </Link>
        </div>
      </div>
    );
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "SILVER":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "GOLD":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "PLATINUM":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto px-4 py-32">
      {/* Header */}
      <div className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Membership Dashboard
          </h1>
          <span
            className={`inline-flex rounded-full px-4 py-1 text-sm font-medium ${getBadgeColor(
              membership.type
            )}`}
          >
            {membership.type} MEMBER
          </span>
        </div>
        <div className="grid gap-4 rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-1 text-sm font-medium text-body-color">Member Since</h3>
            <p className="text-base font-medium text-black dark:text-white">
              {format(new Date(membership.startDate), "MMM d, yyyy")}
            </p>
          </div>
          {membership.endDate && (
            <div>
              <h3 className="mb-1 text-sm font-medium text-body-color">Valid Until</h3>
              <p className="text-base font-medium text-black dark:text-white">
                {format(new Date(membership.endDate), "MMM d, yyyy")}
              </p>
            </div>
          )}
          {membership.credits !== undefined && (
            <div>
              <h3 className="mb-1 text-sm font-medium text-body-color">
                Available Credits
              </h3>
              <p className="text-base font-medium text-black dark:text-white">
                ₦{membership.credits.toLocaleString()}
              </p>
            </div>
          )}
          <div>
            <h3 className="mb-1 text-sm font-medium text-body-color">
              Special Rate Savings
            </h3>
            <p className="text-base font-medium text-black dark:text-white">
              {membership.specialRates}% off
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Exclusive Properties */}
        <div className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Home className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Exclusive Properties
            </h2>
          </div>
          <p className="mb-4 text-body-color">
            Access to {membership.exclusiveProperties} exclusive properties not available to
            regular users.
          </p>
          <Link
            href="/properties?exclusive=true"
            className="text-primary hover:underline"
          >
            View Exclusive Properties →
          </Link>
        </div>

        {/* Special Rates */}
        <div className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <CreditCard className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Special Rates
            </h2>
          </div>
          <p className="mb-4 text-body-color">
            Enjoy {membership.specialRates}% off on all property bookings and special
            member-only deals.
          </p>
          <Link href="/properties" className="text-primary hover:underline">
            Browse Properties →
          </Link>
        </div>

        {/* Priority Support */}
        <div className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Priority Support
            </h2>
          </div>
          <p className="mb-4 text-body-color">
            Get priority access to our customer support team and faster response times.
          </p>
          <Link href="/support" className="text-primary hover:underline">
            Contact Support →
          </Link>
        </div>

        {membership.type !== "SILVER" && (
          <>
            {/* Investment Properties */}
            <div className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-black dark:text-white">
                  Investment Properties
                </h2>
              </div>
              <p className="mb-4 text-body-color">
                Access to {membership.investmentProperties} premium investment
                opportunities with projected ROI of {membership.roi}%.
              </p>
              <Link
                href="/properties?type=INVESTMENT"
                className="text-primary hover:underline"
              >
                View Investment Properties →
              </Link>
            </div>

            {/* Property Management */}
            <div className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-black dark:text-white">
                  Property Management
                </h2>
              </div>
              <p className="mb-4 text-body-color">
                Professional property management services included with your membership.
              </p>
              <Link
                href="/dashboard/properties"
                className="text-primary hover:underline"
              >
                Manage Properties →
              </Link>
            </div>

            {/* Investment Reports */}
            <div className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Calendar className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold text-black dark:text-white">
                  Investment Reports
                </h2>
              </div>
              <p className="mb-4 text-body-color">
                {membership.type === "PLATINUM"
                  ? "Monthly detailed reports on your investment performance."
                  : "Quarterly reports on your investment performance."}
              </p>
              <Link
                href="/dashboard/reports"
                className="text-primary hover:underline"
              >
                View Reports →
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Membership Actions */}
      <div className="mt-12 flex flex-wrap items-center gap-4">
        {membership.type === "SILVER" && (
          <Link
            href="/properties?type=INVESTMENT"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-white transition-all hover:bg-primary/90"
          >
            Upgrade to Gold →
          </Link>
        )}
        <Link
          href="/membership/history"
          className="inline-flex items-center rounded-lg border border-stroke px-6 py-3 text-body-color transition-all hover:border-primary hover:text-primary dark:border-strokedark"
        >
          View Membership History
        </Link>
      </div>
    </div>
  );
};

export default MembershipDashboard; 