"use client";

import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";
import { TrendingUp, Users, Home, Wallet } from "lucide-react";

interface InvestmentProperty {
  id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  type: string;
  roi: number;
  managementFee: number;
  monthlyIncome: number;
  occupancyRate: number;
  propertyValue: number;
  installmentPrice: number;
  outrighPrice: number;
}

interface InvestmentPropertyCardProps {
  property: InvestmentProperty;
}

const InvestmentPropertyCard = ({ property }: InvestmentPropertyCardProps) => {
  const calculateMonthlyPayment = () => {
    const downPayment = property.installmentPrice * 0.6; // 60% down payment
    const balance = property.installmentPrice - downPayment;
    const months = 24; // 2 years
    const monthlyPayment = balance / months;
    return monthlyPayment;
  };

  return (
    <Link
      href={`/investments/${property.id}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-solid-8 transition-all hover:shadow-solid-12 dark:bg-blacksection"
    >
      {/* Property Image */}
      <div className="relative h-[240px] w-full overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          className="object-cover transition-transform group-hover:scale-105"
          fill
        />
        <div className="absolute left-4 top-4">
          <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-black backdrop-blur-sm dark:bg-black/90 dark:text-white">
            {property.type}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        <h3 className="mb-2 text-xl font-semibold text-black dark:text-white">
          {property.title}
        </h3>
        <p className="mb-4 text-body-color">{property.location}</p>

        {/* Key Metrics */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-body-color">
              <TrendingUp className="h-4 w-4" />
              <span>ROI</span>
            </div>
            <p className="text-lg font-semibold text-primary">{property.roi}%</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-body-color">
              <Users className="h-4 w-4" />
              <span>Occupancy</span>
            </div>
            <p className="text-lg font-semibold text-black dark:text-white">
              {property.occupancyRate}%
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-body-color">
              <Wallet className="h-4 w-4" />
              <span>Monthly Income</span>
            </div>
            <p className="text-lg font-semibold text-black dark:text-white">
              {formatCurrency(property.monthlyIncome)}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-body-color">
              <Home className="h-4 w-4" />
              <span>Management Fee</span>
            </div>
            <p className="text-lg font-semibold text-black dark:text-white">
              {property.managementFee}%
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-3 border-t border-stroke pt-6 dark:border-strokedark">
          <div className="flex items-center justify-between">
            <span className="text-body-color">Outright Price</span>
            <span className="text-lg font-semibold text-black dark:text-white">
              {formatCurrency(property.outrighPrice)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body-color">Installment Price</span>
            <div className="text-right">
              <p className="text-lg font-semibold text-black dark:text-white">
                {formatCurrency(property.installmentPrice)}
              </p>
              <p className="text-sm text-body-color">
                {formatCurrency(calculateMonthlyPayment())}/month
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default InvestmentPropertyCard; 