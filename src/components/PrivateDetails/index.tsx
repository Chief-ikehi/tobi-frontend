"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const Details = () => {

  const benefits = [
    {
      title: "Early Access",
      icon: "/images/icons/calendar-check.svg",
      description: "Get priority access to newly listed properties before public release"
    },
    {
      title: "Concierge Support",
      icon: "/images/icons/headset.svg",
      description: "24/7 personalized concierge support for all your needs"
    },
    {
      title: "Guaranteed Bookings",
      icon: "/images/icons/clock-check.svg",
      description: "Secure your desired property within 30 minutes of selection"
    }
  ];

  const membershipTiers = [
    {
      name: "Basic",
      price: "₦50,000/month",
      features: [
        "Early access to new properties",
        "Basic concierge support",
        "30-minute booking guarantee"
      ]
    },
    {
      name: "Premium",
      price: "₦100,000/month",
      features: [
        "All Basic features",
        "24/7 premium concierge support",
        "Complimentary airport transfers",
        "Priority booking system"
      ]
    },
    {
      name: "Elite",
      price: "₦200,000/month",
      features: [
        "All Premium features",
        "Dedicated personal concierge",
        "Unlimited car service",
        "VIP property access",
        "Exclusive member events"
      ]
    }
  ];

  return (
    <>
      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Exclusive Member Benefits
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="rounded-lg bg-white p-6 text-center shadow-lg"
              >
                <div className="mb-4 flex justify-center">
                  <Image
                    src={benefit.icon}
                    alt={benefit.title}
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="mb-4 text-xl font-semibold">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            What Our Members Say
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Add testimonial cards here */}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Membership Tiers
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {membershipTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="rounded-lg bg-white p-6 shadow-lg"
              >
                <h3 className="mb-4 text-2xl font-bold">{tier.name}</h3>
                <p className="mb-6 text-3xl font-semibold text-primary">
                  {tier.price}
                </p>
                <ul className="mb-6 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full rounded-full bg-primary px-6 py-3 text-white transition-all hover:bg-primary/90">
                  Select {tier.name}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Details;