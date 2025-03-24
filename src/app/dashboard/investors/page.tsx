// /dashboard/investors/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/format";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("@/components/Chart"), { ssr: false });

interface Investment {
  id: string;
  property_title: string;
  amount: number;
  date: string;
  roi: number;
  status: "ACTIVE" | "COMPLETED";
}

interface Membership {
  tier: "SILVER" | "GOLD" | "PLATINUM";
  expires_on: string;
}

const InvestorDashboard = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    const fetchInvestorData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [investmentRes, membershipRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/investments/`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/membership/`, { headers }),
        ]);

        const investmentsData = await investmentRes.json();
        const membershipData = await membershipRes.json();

        setInvestments(investmentsData);
        setMembership(membershipData);
      } catch (err) {
        toast.error("Failed to load investor data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorData();
  }, []);

  const totalInvested = investments.reduce((sum, i) => sum + i.amount, 0);
  const totalEarnings = investments.reduce((sum, i) => sum + (i.amount * i.roi) / 100, 0);
  const activeCount = investments.filter((i) => i.status === "ACTIVE").length;
  const completedCount = investments.length - activeCount;

  const roiChartData = investments.map((i) => ({
    name: i.property_title,
    roi: Math.round(i.amount * i.roi * 0.01),
  }));

  if (loading) {
    return <div className="py-40 text-center text-lg">Loading your investments...</div>;
  }

  return (
    <section className="container py-20">
      <h1 className="text-3xl font-bold mb-6">Investor Dashboard</h1>

      {/* Membership Block */}
      {membership && (
        <div className="mb-6 p-5 rounded-md bg-gray-100 dark:bg-dark-2 border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Membership</h2>
              <p className="text-sm">Tier: <strong>{membership.tier}</strong></p>
              <p className="text-sm">Expires: {new Date(membership.expires_on).toLocaleDateString()}</p>
            </div>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${membership.tier === "PLATINUM" ? "bg-yellow-200 text-yellow-800" : membership.tier === "GOLD" ? "bg-orange-200 text-orange-800" : "bg-gray-200 text-gray-800"}`}>
              {membership.tier}
            </span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-dark-2 border rounded">
          <p className="text-xs text-gray-500 mb-1">Total Invested</p>
          <p className="text-lg font-semibold">{formatCurrency(totalInvested)}</p>
        </div>
        <div className="p-4 bg-white dark:bg-dark-2 border rounded">
          <p className="text-xs text-gray-500 mb-1">Total ROI Earned</p>
          <p className="text-lg font-semibold text-green-600">{formatCurrency(totalEarnings)}</p>
        </div>
        <div className="p-4 bg-white dark:bg-dark-2 border rounded">
          <p className="text-xs text-gray-500 mb-1">Active Investments</p>
          <p className="text-lg font-semibold">{activeCount}</p>
        </div>
        <div className="p-4 bg-white dark:bg-dark-2 border rounded">
          <p className="text-xs text-gray-500 mb-1">Completed</p>
          <p className="text-lg font-semibold">{completedCount}</p>
        </div>
      </div>

      {/* ROI Chart */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Earnings by Property</h2>
        <Chart data={roiChartData} />
      </div>

      {/* Investment List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Investments</h2>
        {investments.length === 0 ? (
          <p className="text-body-color">You haven’t made any investments yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {investments.map((inv) => {
              const earnings = Math.round((inv.amount * inv.roi) / 100);
              const monthlyEarnings = Math.floor(earnings / 12);

              return (
                <div
                  key={inv.id}
                  className="rounded-lg border p-5 bg-white dark:bg-blacksection shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{inv.property_title}</h3>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        inv.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-body-color">
                    <div>
                      <p className="text-xs text-gray-500">Invested</p>
                      <p className="font-medium">{formatCurrency(inv.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ROI</p>
                      <p className="font-medium">{inv.roi}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total ROI</p>
                      <p className="font-semibold text-green-600">{formatCurrency(earnings)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Monthly ROI</p>
                      <p>{formatCurrency(monthlyEarnings)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p>{new Date(inv.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default InvestorDashboard;