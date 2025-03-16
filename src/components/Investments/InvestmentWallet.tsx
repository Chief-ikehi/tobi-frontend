"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
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

interface Transaction {
  id: string;
  type: "INSTALLMENT_PAYMENT" | "RENTAL_INCOME" | "WITHDRAWAL" | "REFUND";
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  propertyTitle?: string;
  description: string;
  createdAt: string;
  reference: string;
}

interface WalletData {
  balance: number;
  pendingBalance: number;
  totalIncome: number;
  totalExpenses: number;
  transactions: Transaction[];
}

export function InvestmentWallet() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<WalletData | null>(null);
  const [transactionType, setTransactionType] = useState("all");

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/investments/wallet`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch wallet data");
        }

        const walletData = await response.json();
        setData(walletData);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
        toast.error("Failed to load wallet data");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchWalletData();
    }
  }, [session]);

  const handleWithdraw = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/investments/wallet/withdraw`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to initiate withdrawal");
      }

      const { message } = await response.json();
      toast.success(message);
    } catch (error) {
      console.error("Error initiating withdrawal:", error);
      toast.error("Failed to initiate withdrawal");
    }
  };

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "FAILED":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "INSTALLMENT_PAYMENT":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case "RENTAL_INCOME":
        return <ArrowDownRight className="h-5 w-5 text-green-500" />;
      case "WITHDRAWAL":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case "REFUND":
        return <ArrowDownRight className="h-5 w-5 text-green-500" />;
      default:
        return <Wallet className="h-5 w-5 text-gray-500" />;
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
            Please sign in to view your investment wallet
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
            No Wallet Data
          </h2>
          <p className="mb-8 text-body-color">
            Start investing to activate your investment wallet
          </p>
          <Link href="/investments">
            <Button>Browse Investment Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredTransactions = transactionType === "all" 
    ? data.transactions 
    : data.transactions.filter((t) => t.type === transactionType);

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-black dark:text-white">
          Investment Wallet
        </h1>
        <Button onClick={handleWithdraw}>Withdraw Funds</Button>
      </div>

      {/* Overview Cards */}
      <div className="mb-12 grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.balance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending: {formatCurrency(data.pendingBalance)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Position</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.totalIncome - data.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <Select
              value={transactionType}
              onValueChange={setTransactionType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="INSTALLMENT_PAYMENT">
                  Installment Payments
                </SelectItem>
                <SelectItem value="RENTAL_INCOME">Rental Income</SelectItem>
                <SelectItem value="WITHDRAWAL">Withdrawals</SelectItem>
                <SelectItem value="REFUND">Refunds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between rounded-lg border border-stroke p-4 dark:border-strokedark"
              >
                <div className="flex items-center gap-4">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-semibold text-black dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-body-color">
                      {transaction.propertyTitle
                        ? `Property: ${transaction.propertyTitle}`
                        : null}
                    </p>
                    <p className="text-sm text-body-color">
                      Ref: {transaction.reference}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        ["RENTAL_INCOME", "REFUND"].includes(transaction.type)
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {["RENTAL_INCOME", "REFUND"].includes(transaction.type)
                        ? "+"
                        : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-body-color">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusIcon(transaction.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 