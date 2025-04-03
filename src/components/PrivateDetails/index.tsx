"use client";

import { Check } from "lucide-react";

interface MembershipPlan {
  id: string;
  name: "SILVER" | "GOLD" | "PLATINUM";
  price: number;
  duration: string;
  features: string[];
  description: string;
  isPopular?: boolean;
}

const membershipPlans: MembershipPlan[] = [
  {
    id: "silver",
    name: "SILVER",
    price: 50000,
    duration: "Monthly",
    description: "Perfect for regular property seekers",
    features: [
      "Access to exclusive properties",
      "Special booking rates",
      "Priority customer support",
      "Monthly newsletter",
      "Early access to new listings",
    ],
  },
  {
    id: "gold",
    name: "GOLD",
    price: 0,
    duration: "With Investment",
    description: "Automatic with property investment (60% installment)",
    features: [
      "All Silver benefits",
      "5M credit for short-let stays",
      "Investment ROI tracking",
      "Quarterly investment reports",
      "Dedicated investment advisor",
      "Property management services",
    ],
    isPopular: true,
  },
  {
    id: "platinum",
    name: "PLATINUM",
    price: 0,
    duration: "With Investment",
    description: "Automatic with outright property purchase",
    features: [
      "All Gold benefits",
      "10M credit for short-let stays",
      "Priority ROI payments",
      "Monthly investment reports",
      "VIP customer support",
      "Free property management",
      "Exclusive investment opportunities",
    ],
  },
];

const MembershipPlans = () => {
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-black dark:text-white">
          Private Membership
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-body-color">
          Join our exclusive membership program to unlock premium benefits, special rates,
          and access to exclusive properties.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {membershipPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-lg bg-white p-8 shadow-solid-8 transition-all hover:shadow-solid-12 dark:bg-blacksection ${
              plan.isPopular
                ? "border-2 border-primary"
                : "border border-stroke dark:border-strokedark"
            }`}
          >
            {plan.isPopular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
                Most Popular
              </span>
            )}

            <div className="mb-8">
              <h3 className="mb-4 text-2xl font-bold text-black dark:text-white">
                {plan.name}
              </h3>
              <p className="mb-6 text-body-color">{plan.description}</p>
              <div className="mb-6 flex items-end">
                <span className="text-3xl font-bold text-black dark:text-white">
                  {plan.price === 0 ? "FREE" : `₦${plan.price.toLocaleString()}`}
                </span>
                {plan.price > 0 && (
                  <span className="ml-1 text-body-color">/{plan.duration.toLowerCase()}</span>
                )}
              </div>
            </div>

            <div className="mb-8 space-y-4">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-primary" />
                  <span className="text-body-color">{feature}</span>
                </div>
              ))}
            </div>

            <button
              className={`w-full rounded-lg px-6 py-3 text-center text-base font-medium transition-all ${
                plan.isPopular
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "border border-stroke text-body-color hover:border-primary hover:text-primary dark:border-strokedark"
              }`}
            >
              {plan.name === "GOLD" || plan.name === "PLATINUM"
                ? "Invest to Access"
                : "Subscribe Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipPlans;