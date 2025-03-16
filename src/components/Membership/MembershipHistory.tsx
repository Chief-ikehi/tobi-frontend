"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface MembershipTransaction {
  id: string;
  type: "SUBSCRIPTION" | "UPGRADE" | "AUTOMATIC" | "RENEWAL";
  membershipType: "SILVER" | "GOLD" | "PLATINUM";
  amount: number;
  transactionRef: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
  createdAt: string;
}

const MembershipHistory = () => {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<MembershipTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembershipHistory = async () => {
      if (session?.user) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/membership/history`);
          if (response.ok) {
            const data = await response.json();
            setTransactions(data);
          }
        } catch (error) {
          console.error("Error fetching membership history:", error);
          toast.error("Failed to load membership history");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchMembershipHistory();
  }, [session]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="space-y-8">
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "FAILED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "SUBSCRIPTION":
        return "New Subscription";
      case "UPGRADE":
        return "Membership Upgrade";
      case "AUTOMATIC":
        return "Investment Benefit";
      case "RENEWAL":
        return "Subscription Renewal";
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto px-4 py-32">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/membership/dashboard"
          className="mb-6 inline-flex items-center text-body-color hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Membership History
        </h1>
        <p className="mt-2 text-body-color">
          View your membership transactions and status changes
        </p>
      </div>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-solid-8 dark:bg-blacksection">
          <p className="text-body-color">No membership transactions found.</p>
        </div>
      ) : (
        <div className="rounded-lg bg-white shadow-solid-8 dark:bg-blacksection">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stroke dark:border-strokedark">
                  <th className="p-6 text-left text-sm font-medium text-body-color">
                    Date
                  </th>
                  <th className="p-6 text-left text-sm font-medium text-body-color">
                    Type
                  </th>
                  <th className="p-6 text-left text-sm font-medium text-body-color">
                    Membership
                  </th>
                  <th className="p-6 text-left text-sm font-medium text-body-color">
                    Amount
                  </th>
                  <th className="p-6 text-left text-sm font-medium text-body-color">
                    Status
                  </th>
                  <th className="p-6 text-left text-sm font-medium text-body-color">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-stroke last:border-none hover:bg-gray-50 dark:border-strokedark dark:hover:bg-gray-900"
                  >
                    <td className="p-6">
                      <time
                        dateTime={transaction.createdAt}
                        className="text-sm text-black dark:text-white"
                      >
                        {format(new Date(transaction.createdAt), "MMM d, yyyy")}
                      </time>
                    </td>
                    <td className="p-6">
                      <span className="text-sm text-black dark:text-white">
                        {getTypeLabel(transaction.type)}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="text-sm font-medium text-black dark:text-white">
                        {transaction.membershipType}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="text-sm text-black dark:text-white">
                        ₦{transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-6">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="font-mono text-xs text-body-color">
                        {transaction.transactionRef}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipHistory; 