"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Wallet, ArrowDownLeft, ArrowUpRight, CreditCard, Building2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddMoneyDialog } from "@/components/wallet/add-money-dialog";
import { WithdrawDialog } from "@/components/wallet/withdraw-dialog";
import { AddPaymentMethodDialog } from "@/components/wallet/add-payment-method-dialog";
import { AddBankAccountDialog } from "@/components/wallet/add-bank-account-dialog";

// Mock data for transactions
const mockTransactions = [
  {
    id: "1",
    type: "credit",
    amount: 500.00,
    description: "Payment received for booking #1234",
    date: "2024-03-15T10:30:00Z",
    status: "completed",
  },
  {
    id: "2",
    type: "debit",
    amount: 250.00,
    description: "Withdrawal to bank account",
    date: "2024-03-14T15:45:00Z",
    status: "completed",
  },
];

// Mock data for payment methods
const mockPaymentMethods = [
  {
    id: "1",
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiryMonth: "12",
    expiryYear: "25",
    isDefault: true,
  },
  {
    id: "2",
    type: "bank",
    accountNumber: "****5678",
    bankName: "Bank of America",
    isDefault: false,
  },
];

export default function WalletPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("transactions");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wallet</h1>
          <p className="text-muted-foreground">Manage your funds and transactions</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(1250.00)}</div>
            <div className="flex space-x-2 mt-4">
              <AddMoneyDialog paymentMethods={mockPaymentMethods as any} />
              <WithdrawDialog />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gift Credits</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(50.00)}</div>
            <p className="text-xs text-muted-foreground mt-1">Expires in 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search transactions..."
              className="max-w-sm"
            />
          </div>
          <div className="grid gap-4">
            {mockTransactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === "credit" 
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {transaction.type === "credit" ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          transaction.type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}>
                          {transaction.type === "credit" ? "+" : "-"}
                          {formatAmount(transaction.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="payment-methods" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <AddPaymentMethodDialog />
              <AddBankAccountDialog />
            </div>
          </div>
          <div className="grid gap-4">
            {mockPaymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-secondary">
                        {method.type === "card" ? (
                          <CreditCard className="h-4 w-4" />
                        ) : (
                          <Building2 className="h-4 w-4" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {method.type === "card" 
                            ? `${method.brand} ending in ${method.last4}`
                            : `${method.bankName} - ${method.accountNumber}`}
                        </p>
                        {method.type === "card" && (
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && (
                        <span className="text-xs bg-secondary px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 