"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

const UserProfile = () => {
  const [user, setUser] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newData, setNewData] = useState({ full_name: "", email: "", phone: "" });
  const [newPassword, setNewPassword] = useState({ old: "", new: "", confirm: "" });
  const [role, setRole] = useState<string>("CUSTOMER");
  const [membership, setMembership] = useState<any>(null); // for Investors
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
        setRole(data.role);
        if (data.role === "INVESTOR") {
          // Fetch membership details for Investors
          const membershipRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/membership/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const membershipData = await membershipRes.json();
          setMembership(membershipData);
        }
        setNewData({ full_name: data.full_name, email: data.email, phone: data.phone });
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/update/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      if (res.ok) {
        toast.success("Profile updated successfully.");
        setUser({ ...user, ...newData });
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.new !== newPassword.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/password/change/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          old_password: newPassword.old,
          new_password: newPassword.new,
        }),
      });
      if (res.ok) {
        toast.success("Password updated successfully.");
      } else {
        toast.error("Failed to update password.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const handleRoleSwitch = async (newRole: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/role/update/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setRole(newRole);
        toast.success(`Role updated to ${newRole}.`);
      } else {
        toast.error("Failed to update role.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  if (loading) return <div className="py-40 text-center text-lg">Loading profile...</div>;

  return (
    <section className="container py-20 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="grid gap-6 bg-white dark:bg-dark-2 border p-6 rounded-md">
        {/* Full Name */}
        <div>
          <p className="text-xs text-gray-500">Full Name</p>
          {isEditing ? (
            <input
              type="text"
              value={newData.full_name}
              onChange={(e) => setNewData({ ...newData, full_name: e.target.value })}
              className="border rounded px-4 py-2"
              required
            />
          ) : (
            <p className="font-semibold">{user.full_name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <p className="text-xs text-gray-500">Email</p>
          {isEditing ? (
            <input
              type="email"
              value={newData.email}
              onChange={(e) => setNewData({ ...newData, email: e.target.value })}
              className="border rounded px-4 py-2"
              required
            />
          ) : (
            <p>{user.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <p className="text-xs text-gray-500">Phone</p>
          {isEditing ? (
            <input
              type="text"
              value={newData.phone}
              onChange={(e) => setNewData({ ...newData, phone: e.target.value })}
              className="border rounded px-4 py-2"
              required
            />
          ) : (
            <p>{user.phone || "Not provided"}</p>
          )}
        </div>

        {/* User Role */}
        <div>
          <p className="text-xs text-gray-500">Role</p>
          <p className="capitalize">{role.toLowerCase()}</p>
        </div>

        {/* Display membership details for Investors */}
        {user.role === "INVESTOR" && membership && (
          <div>
            <p className="text-xs text-gray-500">Membership Tier</p>
            <p className="font-semibold">{membership.tier}</p>
            <p className="text-xs text-gray-500">Expires On</p>
            <p className="font-semibold">{new Date(membership.expires_on).toLocaleDateString()}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 mt-4">
          {isEditing ? (
            <button
              onClick={handleEditProfile}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/80"
            >
              Edit Profile
            </button>
          )}

          <button
            onClick={() => handleRoleSwitch(role === "CUSTOMER" ? "AGENT" : "CUSTOMER")}
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
          >
            Switch Role to {role === "CUSTOMER" ? "AGENT" : "CUSTOMER"}
          </button>
        </div>

        {/* Change Password */}
        <div className="mt-8 p-6 rounded bg-gray-100 dark:bg-dark-2">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword}>
            <div className="grid gap-4">
              <input
                type="password"
                placeholder="Old Password"
                value={newPassword.old}
                onChange={(e) => setNewPassword({ ...newPassword, old: e.target.value })}
                className="border rounded px-4 py-2"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword.new}
                onChange={(e) => setNewPassword({ ...newPassword, new: e.target.value })}
                className="border rounded px-4 py-2"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={newPassword.confirm}
                onChange={(e) => setNewPassword({ ...newPassword, confirm: e.target.value })}
                className="border rounded px-4 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 mt-4 rounded hover:bg-gray-900"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;