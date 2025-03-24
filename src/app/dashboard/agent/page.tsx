"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";

interface Property {
  id: string;
  title: string;
  type: string;
  is_approved: boolean;
  created_at: string;
  agent_id: string;
}

interface AgentProfile {
  full_name: string;
  email: string;
  phone: string;
  is_verified_agent: boolean;
  id: string;  // Add ID to the profile to match with agent_id in Property
}

const AgentDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch profile and properties at the same time
        const [profileRes, propertiesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/`, { headers }),
        ]);

        const profileData = await profileRes.json();
        const propertyData = await propertiesRes.json();

        // Set the profile and filter properties by agent_id
        setProfile(profileData);
        setProperties(
          propertyData.filter((p: Property) => p.agent_id === profileData.id) // filter by agent_id
        );
      } catch (err) {
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const approvedCount = properties.filter((p) => p.is_approved).length;
  const pendingCount = properties.length - approvedCount;

  if (loading) {
    return <div className="py-40 text-center">Loading agent dashboard...</div>;
  }

  return (
    <section className="container py-20">
      <h1 className="text-3xl font-bold mb-6">Agent Dashboard</h1>

      {/* Profile Summary */}
      {profile && (
        <div className="mb-6 p-5 rounded-md bg-gray-100 dark:bg-dark-2 border">
          <h2 className="text-lg font-semibold mb-1">Welcome, {profile.full_name}</h2>
          <p className="text-sm">Email: {profile.email}</p>
          <p className="text-sm mb-1">Phone: {profile.phone}</p>
          <p className="text-sm">
            Verification Status:{" "}
            <span className={profile.is_verified_agent ? "text-green-600" : "text-red-500"}>
              {profile.is_verified_agent ? "Verified" : "Not Verified"}
            </span>
          </p>
          {!profile.is_verified_agent && (
            <div className="mt-4">
              <Link
                href="/dashboard/agent/verify"
                className="inline-block rounded bg-primary text-white px-4 py-2 text-sm hover:bg-primary/80"
              >
                Complete Verification
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Property Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-dark-2 border rounded">
          <p className="text-xs text-gray-500 mb-1">Total Properties</p>
          <p className="text-lg font-semibold">{properties.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-dark-2 border rounded">
          <p className="text-xs text-gray-500 mb-1">Approved Listings</p>
          <p className="text-lg font-semibold text-green-600">{approvedCount}</p>
        </div>
        <div className="p-4 bg-white dark:bg-dark-2 border rounded">
          <p className="text-xs text-gray-500 mb-1">Pending Approval</p>
          <p className="text-lg font-semibold text-yellow-600">{pendingCount}</p>
        </div>
      </div>

      {/* Commission (mocked for now) */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Your Commission</h2>
        <div className="p-4 bg-white dark:bg-dark-2 border rounded w-full max-w-md">
          <p className="text-sm text-gray-500 mb-1">Total Earned</p>
          <p className="text-xl font-bold text-green-700">{formatCurrency(250000)}</p>
        </div>
      </div>

      {/* Property Listings Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Properties</h2>
        {properties.length === 0 ? (
          <p className="text-body-color">You haven’t listed any properties yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {properties.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border p-4 bg-white dark:bg-blacksection shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-semibold">{p.title}</h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      p.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.is_approved ? "Approved" : "Pending"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Type: {p.type} | Created: {new Date(p.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/dashboard/agent/list-property"
            className="inline-block rounded bg-black text-white px-4 py-2 text-sm hover:bg-gray-900"
          >
            + List New Property
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AgentDashboard;