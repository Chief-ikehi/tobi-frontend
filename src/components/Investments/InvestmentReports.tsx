"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Download,
  ChevronDown,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvestmentCharts } from "./InvestmentCharts";

interface MonthlyReport {
  month: string;
  income: number;
  occupancyRate: number;
  expenses: number;
  netIncome: number;
}

interface PropertyReport {
  id: string;
  title: string;
  monthlyReports: MonthlyReport[];
  yearToDateIncome: number;
  yearToDateExpenses: number;
  yearToDateOccupancy: number;
  projectedAnnualROI: number;
}

interface ReportsData {
  totalYearToDateIncome: number;
  totalYearToDateExpenses: number;
  averageOccupancyRate: number;
  portfolioROI: number;
  propertyReports: PropertyReport[];
}

export function InvestmentReports() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportsData | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/investments/reports?year=${selectedYear}&month=${selectedMonth}`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reports data");
        }

        const reportsData = await response.json();
        setData(reportsData);
      } catch (error) {
        console.error("Error fetching reports data:", error);
        toast.error("Failed to load reports data");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchReportsData();
    }
  }, [session, selectedYear, selectedMonth]);

  const handleDownloadReport = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/investments/reports/download?year=${selectedYear}&month=${selectedMonth}`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `investment-report-${selectedYear}-${selectedMonth}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  };

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
            Please sign in to view your investment reports
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
            No Reports Available
          </h2>
          <p className="mb-8 text-body-color">
            Start investing to generate performance reports
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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-bold text-black dark:text-white">
          Investment Reports
        </h1>

        <div className="flex items-center gap-4">
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <SelectItem
                  key={month}
                  value={(index + 1).toString().padStart(2, "0")}
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="mb-12 grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalYearToDateIncome)}
            </div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalYearToDateExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.averageOccupancyRate}%</div>
            <p className="text-xs text-muted-foreground">Portfolio average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.portfolioROI}%</div>
            <p className="text-xs text-muted-foreground">Annual return</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="mb-12">
        <InvestmentCharts propertyReports={data.propertyReports} />
      </div>

      {/* Property Reports */}
      <div className="space-y-6">
        {data.propertyReports.map((property) => (
          <Card key={property.id}>
            <CardHeader>
              <CardTitle>{property.title}</CardTitle>
              <CardDescription>
                YTD Income: {formatCurrency(property.yearToDateIncome)} • YTD
                Expenses: {formatCurrency(property.yearToDateExpenses)} • Occupancy:{" "}
                {property.yearToDateOccupancy}% • Projected ROI:{" "}
                {property.projectedAnnualROI}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {property.monthlyReports.map((report) => (
                  <div
                    key={report.month}
                    className="grid grid-cols-5 gap-4 rounded-lg border border-stroke p-4 dark:border-strokedark"
                  >
                    <div>
                      <p className="text-sm text-body-color">Month</p>
                      <p className="font-semibold text-black dark:text-white">
                        {report.month}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-body-color">Income</p>
                      <p className="font-semibold text-black dark:text-white">
                        {formatCurrency(report.income)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-body-color">Expenses</p>
                      <p className="font-semibold text-black dark:text-white">
                        {formatCurrency(report.expenses)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-body-color">Net Income</p>
                      <p className="font-semibold text-black dark:text-white">
                        {formatCurrency(report.netIncome)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-body-color">Occupancy</p>
                      <p className="font-semibold text-black dark:text-white">
                        {report.occupancyRate}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 