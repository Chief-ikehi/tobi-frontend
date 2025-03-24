"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch {
        toast.error("Failed to load user data.");
        router.push("/auth/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return <div className="py-40 text-center text-lg">Loading your dashboard...</div>;
  if (!user) return <div className="py-40 text-center text-lg text-red-500">User not found.</div>;

  return (
    <section className="container py-20">
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>

      {/* Profile Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <Link href="/dashboard/profile" className="text-primary hover:underline">
            Go to Profile
          </Link>
        </div>

        {/* Conditional Rendering based on Role */}
        {user.role === "CUSTOMER" && (
          <>
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
              <Link href="/dashboard/customer/bookings" className="text-primary hover:underline">
                View your bookings
              </Link>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Your Favorites</h2>
              <Link href="/dashboard/customer/favorites" className="text-primary hover:underline">
                View your favorite properties
              </Link>
            </div>
          </>
        )}

        {user.role === "AGENT" && (
          <>
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
              <Link href="/dashboard/agent/list-property" className="text-primary hover:underline">
                List a new property
              </Link>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Your Commission</h2>
              <Link href="/dashboard/agent/commission" className="text-primary hover:underline">
                View your commissions
              </Link>
            </div>
          </>
        )}

        {user.role === "INVESTOR" && (
          <>
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Investments</h2>
              <Link href="/dashboard/investors/investments" className="text-primary hover:underline">
                View your investments
              </Link>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Your ROI</h2>
              <Link href="/dashboard/investors/roi" className="text-primary hover:underline">
                View your ROI
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Dashboard;