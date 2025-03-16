"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

interface ChartData {
  name: string;
  income: number;
  expenses: number;
  occupancyRate: number;
}

interface InvestmentChartsProps {
  propertyReports: {
    id: string;
    title: string;
    monthlyReports: {
      month: string;
      income: number;
      expenses: number;
      occupancyRate: number;
      netIncome: number;
    }[];
  }[];
}

export function InvestmentCharts({ propertyReports }: InvestmentChartsProps) {
  // Transform data for portfolio performance chart
  const portfolioData = propertyReports.reduce<ChartData[]>((acc, property) => {
    property.monthlyReports.forEach((report) => {
      const existingMonth = acc.find((item) => item.name === report.month);
      if (existingMonth) {
        existingMonth.income += report.income;
        existingMonth.expenses += report.expenses;
        existingMonth.occupancyRate =
          (existingMonth.occupancyRate + report.occupancyRate) / 2;
      } else {
        acc.push({
          name: report.month,
          income: report.income,
          expenses: report.expenses,
          occupancyRate: report.occupancyRate,
        });
      }
    });
    return acc;
  }, []);

  // Sort data chronologically
  portfolioData.sort((a, b) => {
    const months = [
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
    ];
    return months.indexOf(a.name) - months.indexOf(b.name);
  });

  return (
    <div className="space-y-6">
      {/* Portfolio Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={portfolioData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) =>
                    formatCurrency(value).replace("₦", "")
                  }
                />
                <YAxis yAxisId="right" orientation="right" unit="%" />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "occupancyRate"
                      ? `${value}%`
                      : formatCurrency(value),
                    name
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()
                      .replace(/^./, (str) => str.toUpperCase()),
                  ]}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  fill="#10B98133"
                  strokeWidth={2}
                  name="Income"
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="expenses"
                  stroke="#EF4444"
                  fill="#EF444433"
                  strokeWidth={2}
                  name="Expenses"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="occupancyRate"
                  stroke="#6366F1"
                  fill="#6366F133"
                  strokeWidth={2}
                  name="Occupancy Rate"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Individual Property Performance */}
      {propertyReports.map((property) => (
        <Card key={property.id}>
          <CardHeader>
            <CardTitle>{property.title} - Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={property.monthlyReports}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      formatCurrency(value).replace("₦", "")
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value)]}
                  />
                  <Legend />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expenses"
                    name="Expenses"
                    fill="#EF4444"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="netIncome"
                    name="Net Income"
                    fill="#6366F1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 