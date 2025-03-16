"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import {
  TrendingUp,
  Wallet,
  Building,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Investment {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyType: string;
  purchaseType: "outright" | "installment";
  purchasePrice: number;
  currentValue: number;
  monthlyIncome: number;
  occupancyRate: number;
  roi: number;
  purchaseDate: string;
}

interface DashboardData {
  totalInvestments: number;
  totalValue: number;
  totalMonthlyIncome: number;
  averageRoi: number;
  investments: Investment[];
}

export function InvestmentDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/investments/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="animate-pulse space-y-8">
          <div className="grid gap-6 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-lg bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
          <div className="h-96 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="rounded-lg bg-white p-8 text-center shadow-solid-8 dark:bg-blacksection">
          <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
            Sign in Required
          </h2>
          <p className="mb-8 text-body-color">
            Please sign in to view your investment dashboard
          </p>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="rounded-lg bg-white p-8 text-center shadow-solid-8 dark:bg-blacksection">
          <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
            No Investments Found
          </h2>
          <p className="mb-8 text-body-color">
            Start your real estate investment journey with T.O.B.I
          </p>
          <Link href="/investments">
            <Button>Browse Investment Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-black dark:text-white">
          Investment Dashboard
        </h1>
        <Link href="/investments">
          <Button>Browse More Properties</Button>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="mb-12 grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalInvestments}</div>
            <p className="text-xs text-muted-foreground">Properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">Current market value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalMonthlyIncome)}
            </div>
            <p className="text-xs text-muted-foreground">From all properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageRoi}%</div>
            <p className="text-xs text-muted-foreground">Across portfolio</p>
          </CardContent>
        </Card>
      </div>

      {/* Investment Properties */}
      <div className="rounded-lg bg-white p-6 shadow-solid-8 dark:bg-blacksection">
        <h2 className="mb-6 text-2xl font-bold text-black dark:text-white">
          Your Properties
        </h2>

        <div className="space-y-6">
          {data.investments.map((investment) => (
            <Link
              key={investment.id}
              href={`/investments/${investment.propertyId}`}
              className="block rounded-lg border border-stroke p-6 transition-all hover:border-primary dark:border-strokedark"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="mb-1 font-semibold text-black dark:text-white">
                    {investment.propertyTitle}
                  </h3>
                  <p className="text-sm text-body-color">
                    {investment.propertyType} • {investment.purchaseType} Purchase
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                  <div>
                    <p className="mb-1 text-sm text-body-color">Current Value</p>
                    <p className="font-semibold text-black dark:text-white">
                      {formatCurrency(investment.currentValue)}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs">
                      {investment.currentValue > investment.purchasePrice ? (
                        <>
                          <ArrowUpRight className="h-3 w-3 text-green-500" />
                          <span className="text-green-500">
                            {(
                              ((investment.currentValue - investment.purchasePrice) /
                                investment.purchasePrice) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3 w-3 text-red-500" />
                          <span className="text-red-500">
                            {(
                              ((investment.purchasePrice - investment.currentValue) /
                                investment.purchasePrice) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-sm text-body-color">Monthly Income</p>
                    <p className="font-semibold text-black dark:text-white">
                      {formatCurrency(investment.monthlyIncome)}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-sm text-body-color">Occupancy Rate</p>
                    <p className="font-semibold text-black dark:text-white">
                      {investment.occupancyRate}%
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-sm text-body-color">ROI</p>
                    <p className="font-semibold text-black dark:text-white">
                      {investment.roi}%
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 