"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Building,
  Users,
  TrendingUp,
  DollarSign,
  Settings,
  ChevronRight,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "@/utils/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InvestmentProperty {
  id: string;
  title: string;
  location: string;
  purchasePrice: number;
  currentValue: number;
  occupancyRate: number;
  monthlyIncome: number;
  annualROI: number;
  status: "ACTIVE" | "PENDING" | "MAINTENANCE";
  imageUrl: string;
}

export function InvestmentPropertyManagement() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<InvestmentProperty[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/investments/properties/owned`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchProperties();
    }
  }, [session]);

  const getStatusColor = (status: InvestmentProperty["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-500";
      case "PENDING":
        return "text-yellow-500";
      case "MAINTENANCE":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const filteredProperties = filterStatus === "all"
    ? properties
    : properties.filter((p) => p.status === filterStatus);

  const totalValue = properties.reduce((sum, p) => sum + p.currentValue, 0);
  const totalMonthlyIncome = properties.reduce((sum, p) => sum + p.monthlyIncome, 0);
  const averageROI = properties.length
    ? properties.reduce((sum, p) => sum + p.annualROI, 0) / properties.length
    : 0;
  const averageOccupancy = properties.length
    ? properties.reduce((sum, p) => sum + p.occupancyRate, 0) / properties.length
    : 0;

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
            Please sign in to view your investment properties
          </p>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="rounded-lg bg-white p-8 text-center shadow-solid-8 dark:bg-blacksection">
          <h2 className="mb-2 text-2xl font-bold text-black dark:text-white">
            No Properties Found
          </h2>
          <p className="mb-8 text-body-color">
            Start investing in properties to build your portfolio
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
          Property Management
        </h1>
      </div>

      {/* Overview Cards */}
      <div className="mb-12 grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {properties.length} Properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalMonthlyIncome)}
            </div>
            <p className="text-xs text-muted-foreground">Recurring Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(averageROI)}
            </div>
            <p className="text-xs text-muted-foreground">Annual Return</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(averageOccupancy)}
            </div>
            <p className="text-xs text-muted-foreground">Portfolio Average</p>
          </CardContent>
        </Card>
      </div>

      {/* Properties List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Properties</CardTitle>
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProperties.map((property) => (
              <Link
                key={property.id}
                href={`/investments/properties/${property.id}`}
                className="block"
              >
                <div className="flex items-center justify-between rounded-lg border border-stroke p-4 transition-colors hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-black dark:text-white">
                        {property.title}
                      </h3>
                      <p className="text-sm text-body-color">{property.location}</p>
                      <p className={`text-sm ${getStatusColor(property.status)}`}>
                        {property.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="font-semibold text-black dark:text-white">
                        {formatCurrency(property.currentValue)}
                      </p>
                      <p className="text-sm text-green-500">
                        {formatCurrency(property.monthlyIncome)}/month
                      </p>
                      <p className="text-sm text-body-color">
                        ROI: {formatPercentage(property.annualROI)}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-body-color" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 