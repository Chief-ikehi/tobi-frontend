// app/dashboard/page.tsx
"use client";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Property } from "@/lib/services/propertyService";

interface Booking {
  id: string;
  propertyId: string;
  property: Property;
  checkInDate: string;
  checkOutDate: string;
  status: "upcoming" | "completed" | "cancelled";
  totalAmount: number;
}

// Add type definition at the top
type TabType = 'bookings' | 'favorites' | 'profile';

const UserDashboard = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // TODO: Replace with actual API calls
        // const bookingsData = await getUserBookings();
        // const favoritesData = await getUserFavorites();
        setBookings([
          {
            id: "1",
            propertyId: "1", 
            property: {
              id: "1",
              title: "Luxury Apartment",
              description: "Beautiful apartment in the heart of the city",
              images: ["https://i.postimg.cc/gkztrPcZ/room10.png"],
              features: {
                bedrooms: 3,
                bathrooms: 2,
                area: 1500,
                furnished: true
              },
              rating: 4.5,
              reviews: 100,
              host: {
                id: "1",
                name: "John Doe",
                avatar: "https://i.postimg.cc/placeholder-host.png",
                rating: 4.5
              },
              price: { amount: 150000, currency: "NGN" },
              location: { address: "123 Main St", city: "Lagos", state: "Ikoyi", country: "Nigeria", coordinates: { lat: 6.5244, lng: 3.3792 } },
              amenities: ["Wi-Fi", "Pool", "Gym"],
              status: "available",
              availability: {
                startDate: "",
                endDate: ""
              },
              createdAt: "",
              updatedAt: ""
            },
            checkInDate: "2024-02-15",
            checkOutDate: "2024-02-20",
            status: "upcoming",
            totalAmount: 750000
          }
        ]);
        setFavorites([]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Bookings</h2>
        <Link 
          href="/properties/search"
          className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
        >
          Browse Properties
        </Link>
      </div>
      
      {bookings.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No bookings found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking.id}
              className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-blacksection"
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-48 h-48">
                  <Image
                    src={booking.property.images[0]}
                    alt={booking.property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {booking.property.title}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {booking.property.location.city}, {booking.property.location.state}
                      </p>
                    </div>
                    <span className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${booking.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : ''}
                      ${booking.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium">Check-in</p>
                      <p>{new Date(booking.checkInDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Check-out</p>
                      <p>{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Total Amount</p>
                      <p>₦{booking.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <Link
                      href={`/bookings/${booking.id}`}
                      className="text-primary hover:text-primary/80"
                    >
                      View Details
                    </Link>
                    {booking.status === 'upcoming' && (
                      <button className="text-red-600 hover:text-red-800">
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Favorites</h2>
      {favorites.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No favorites yet</p>
          <Link 
            href="/properties/search"
            className="text-primary hover:text-primary/80 mt-2 inline-block"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <div 
              key={property.id}
              className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-blacksection"
            >
              {/* Property card content */}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Your Profile</h2>
      <div className="bg-white rounded-lg shadow-md p-6 dark:bg-blacksection">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={session?.user?.image || "https://ui-avatars.com/api/?name=" + session?.user?.name}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{session?.user?.name}</h3>
            <p className="text-gray-500">{session?.user?.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors">
            Edit Profile
          </button>
          <button className="w-full border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition-colors dark:border-gray-600 dark:hover:bg-gray-800">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your bookings, favorites, and profile
          </p>
        </div>

        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-8">
            {(["bookings", "favorites", "profile"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-medium transition-colors relative ${
                  activeTab === tab
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <main>
          {activeTab === "bookings" && renderBookings()}
          {activeTab === "favorites" && renderFavorites()}
          {activeTab === "profile" && renderProfile()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;