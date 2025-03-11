"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";

const MemberDashboard = () => {
  const { data: session } = useSession();
  const [carService, setCarService] = useState({
    vehicleType: "",
    date: "",
    time: "",
  });

  const quickAccessTiles = [
    {
      title: "New Properties",
      icon: "/images/icons/house.svg",
      count: 5,
      link: "/properties/new",
    },
    {
      title: "Upcoming Bookings",
      icon: "/images/icons/calendar.svg",
      count: 2,
      link: "/bookings",
    },
    {
      title: "Concierge Services",
      icon: "/images/icons/concierge.svg",
      count: 3,
      link: "/concierge",
    },
  ];

  const insiderUpdates = [
    {
      type: "newsletter",
      title: "Market Insights Q1 2024",
      date: "2024-01-15",
    },
    {
      type: "property",
      title: "New Luxury Apartment in Ikoyi",
      date: "2024-01-14",
      action: "Book Now",
    },
  ];

  const bookings = [
    {
      id: 1,
      property: "Luxury Suite - Victoria Island",
      checkIn: "2024-02-01",
      checkOut: "2024-02-07",
      status: "confirmed",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {session?.user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-gray-600">Here's what's new for you</p>
      </div>

      {/* Quick Access Tiles */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {quickAccessTiles.map((tile, index) => (
          <motion.div
            key={tile.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="rounded-lg bg-white p-6 shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <Image
                src={tile.icon}
                alt={tile.title}
                width={32}
                height={32}
              />
              <span className="text-2xl font-bold text-primary">
                {tile.count}
              </span>
            </div>
            <h3 className="text-lg font-semibold">{tile.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* Insider Updates */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Insider Updates</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {insiderUpdates.map((update, index) => (
            <motion.div
              key={update.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-lg bg-white p-6 shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  {update.type}
                </span>
                <span className="text-sm text-gray-500">{update.date}</span>
              </div>
              <h3 className="mb-4 text-lg font-semibold">{update.title}</h3>
              {update.action && (
                <button className="rounded-full bg-primary px-4 py-2 text-sm text-white">
                  {update.action}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Management */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Your Bookings</h2>
        <div className="overflow-x-auto rounded-lg bg-white shadow-md">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Check-out
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4">{booking.property}</td>
                  <td className="px-6 py-4">{booking.checkIn}</td>
                  <td className="px-6 py-4">{booking.checkOut}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:text-primary/80">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Concierge Support */}
      <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chat Interface */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-bold">Concierge Support</h2>
          <div className="mb-4 h-64 overflow-y-auto rounded-lg bg-gray-50 p-4">
            {/* Chat messages would go here */}
            <p className="text-center text-gray-500">
              Start a conversation with your concierge
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 rounded-full border border-gray-200 px-4 py-2"
            />
            <button className="rounded-full bg-primary px-6 py-2 text-white">
              Send
            </button>
          </div>
        </div>

        {/* Car Service Booking */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-bold">Car Service</h2>
          <form className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Vehicle Type
              </label>
              <select
                value={carService.vehicleType}
                onChange={(e) =>
                  setCarService({ ...carService, vehicleType: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 p-2"
              >
                <option value="">Select a vehicle</option>
                <option value="sedan">Luxury Sedan</option>
                <option value="suv">Premium SUV</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Date</label>
              <input
                type="date"
                value={carService.date}
                onChange={(e) =>
                  setCarService({ ...carService, date: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 p-2"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Time</label>
              <input
                type="time"
                value={carService.time}
                onChange={(e) =>
                  setCarService({ ...carService, time: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-primary px-6 py-2 text-white"
            >
              Book Car Service
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard; 