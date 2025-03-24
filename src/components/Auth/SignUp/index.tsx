"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "@/lib/axios"; // your axios instance

const Signup = () => {
  const router = useRouter();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "CUSTOMER",
  });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!data.firstName || !data.lastName) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!data.email.includes("@")) {
      toast.error("Enter a valid email");
      return false;
    }
    if (data.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      // 1. Register
      await axios.post("/auth/register/", {
        full_name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: data.userType,
      });

      // 2. Login
      const loginRes = await axios.post("/auth/login/", {
        email: data.email,
        password: data.password,
      });

      const { access, refresh } = loginRes.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // 3. Get user profile
      const profileRes = await axios.get("/auth/user/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const user = profileRes.data;
      localStorage.setItem("user_name", user.full_name || "User");
      localStorage.setItem("user_email", user.email);
      localStorage.setItem("user_image", user.image || "");

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error("Registration failed. Check input and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pb-12.5 lg:pb-25 lg:pt-20 xl:pb-30 xl:pt-20">
      <div className="mx-auto max-w-c-1016 px-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="rounded-lg bg-white px-7.5 pt-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15"
        >
          <h2 className="mb-15 text-center text-3xl font-semibold text-black dark:text-white">
            Create an Account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:gap-14">
              <input
                type="text"
                placeholder="First name"
                value={data.firstName}
                onChange={(e) => setData({ ...data, firstName: e.target.value })}
                required
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black lg:w-1/2"
              />
              <input
                type="text"
                placeholder="Last name"
                value={data.lastName}
                onChange={(e) => setData({ ...data, lastName: e.target.value })}
                required
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black lg:w-1/2"
              />
            </div>

            <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:gap-14">
              <input
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black lg:w-1/2"
              />
              <select
                value={data.userType}
                onChange={(e) => setData({ ...data, userType: e.target.value })}
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black lg:w-1/2"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="AGENT">Agent</option>
                <option value="INVESTOR">Investor</option>
              </select>
            </div>

            <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:gap-14">
              <input
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black lg:w-1/2"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={data.confirmPassword}
                onChange={(e) =>
                  setData({ ...data, confirmPassword: e.target.value })
                }
                required
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black lg:w-1/2"
              />
            </div>

            <div className="flex items-center justify-between mt-8">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Create account
                    <svg
                      className="fill-white"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-black dark:text-white mt-5 lg:mt-0">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Signup;