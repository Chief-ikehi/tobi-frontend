import { Metadata } from "next";
import { InvestmentWallet } from "@/components/Investments/InvestmentWallet";

export const metadata: Metadata = {
  title: "Investment Wallet - TOBI",
  description: "Manage your investment payments, income, and transaction history",
};

export default function InvestmentWalletPage() {
  return <InvestmentWallet />;
} 