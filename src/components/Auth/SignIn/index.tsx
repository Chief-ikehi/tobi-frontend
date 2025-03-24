"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "@/lib/axios"; // axios instance with baseURL

const Signin = () => {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Step 1: Login and get tokens
    const res = await axios.post("/auth/login/", {
      email: data.email,
      password: data.password,
    });

    const { access, refresh } = res.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    // Step 2: Use token to fetch user info
    const profileRes = await axios.get("/auth/user/", {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    const user = profileRes.data;

    localStorage.setItem("user_name", user.full_name || "User");
    localStorage.setItem("user_email", user.email);
    localStorage.setItem("user_image", user.image || "");

    toast.success("Logged in successfully!", {
      position: "top-center",
      duration: 4000,
      style: { zIndex: 99999 },
    });

    router.push("/dashboard");
  } catch (error: any) {
    console.error(error);
    toast.error("Invalid credentials", {
      position: "top-center",
      duration: 4000,
      style: { zIndex: 99999 },
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="pb-12.5 lg:pb-25 lg:pt-20 xl:pb-30 xl:pt-20">
      <div className="mx-auto max-w-c-1016 px-2">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="rounded-lg bg-white px-7.5 pt-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15"
        >
          <h2 className="mb-15 text-center text-3xl font-semibold text-black dark:text-white">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:gap-14">
              <input
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black lg:w-1/2"
              />

              <input
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
                className="w-full border-b border-stroke bg-white pb-3.5 dark:border-strokedark dark:bg-black lg:w-1/2"
              />
            </div>

            <div className="flex items-center justify-between">
              <Link href="/auth/forgot-password" className="hover:text-primary">
                Forgot Password?
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white hover:bg-blackho dark:bg-btndark"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Log in
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
            </div>

            <div className="mt-12.5 border-t border-stroke py-5 text-center dark:border-strokedark">
              <p>
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-primary">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Signin;