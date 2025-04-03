"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const AgentHero: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Ensure theme is loaded from localStorage before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent SSR flicker by waiting for hydration

  // Determine the background image based on the theme
  const getHeroBackground = () => {
    if (mounted) {
      if (theme === "dark") {
        return "url('/images/hero/agent-hero-dark.png')";
      } else if (theme === "light") {
        return "url('/images/hero/agent-hero-light.png')";
      } else {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "url('/images/hero/agent-hero-dark.png')"
          : "url('/images/hero/agent-hero-light.png')";
      }
    }
    return "url('/images/hero/agent-hero-light.png')"; // Default fallback
  };

  const handleJoinClick = () => {
    router.push("/agent"); // Redirect to signup page
  };

  return (
    <section
      className={`relative flex justify-center items-center text-center text-white h-[600px] md:h-[600px] mb-12 px-4 py-8 md:px-32 md:py-12 bg-cover bg-center bg-no-repeat transition-all duration-1000`}
      style={{
        backgroundImage: getHeroBackground(), // Set background image based on theme
        color: theme === "dark" ? "white" : "black", // Adjust text color for better contrast
      }}
    >
      {/* Overlay */}
      <div
        className={`absolute transition-all duration-200 ${
          theme === "dark" ? "bg-black" : "bg-white"
        }`}
      />

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 duration-500 dark:text-white">
        Simplify Property Management
        </h1>
        <p className="text-xl md:text-2xl font-small mb-8 duration-500 dark:text-white">
        Manage your property listings, track your performance, and engage with potential customers directly from your dashboard.
        </p>

        {/* Join Button */}
        <button
          onClick={handleJoinClick}
          className="w-full md:w-[200px] h-12 px-3 rounded-lg text-base bg-black text-white hover:bg-blue-700 duration-300 ease-in-out dark:hover:bg-black dark:bg-btndark"
        >
        List a Property
        </button>
      </div>
    </section>
  );
};

export default AgentHero;
