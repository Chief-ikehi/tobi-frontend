"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface Location {
  value: string;
  label: string;
}

interface Guest {
  value: string;
  label: string;
}

const Hero: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme is loaded from localStorage before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent SSR flicker by waiting for hydration

  const locations: Location[] = [
    { value: "", label: "Select Location" },
    { value: "ikoyi", label: "Ikoyi" },
    { value: "victoria-island", label: "Victoria Island" }
  ];

  const guests: Guest[] = [
    { value: "1", label: "1 Guest" },
    { value: "2", label: "2 Guests" },
    { value: "3", label: "3 Guests" },
    { value: "4", label: "4+ Guests" }
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your search functionality here
  };

  // Determine the background image based on the theme
  const getHeroBackground = () => {
    if (theme === "dark") {
      return "url('/images/hero/hero-dark.png')";
    } else if (theme === "light") {
      return "url('/images/hero/hero-light.png')";
    } else {
      // Default to system's preferred theme (dark/light based on user system)
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? "url('/images/hero/hero-dark.png')"
        : "url('/images/hero/hero-light.png')";
    }
  };

  return (
    <section
      className={`relative flex justify-center items-center text-center text-white h-[600px] md:h-[600px] mb-12 px-4 py-8 md:px-32 md:py-12 bg-cover bg-center bg-no-repeat transition-all duration-1000`}
      style={{
        backgroundImage: getHeroBackground(),  // Set background image based on theme
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
          Find Your Perfect Stay
        </h1>
        <p className="text-xl md:text-2xl font-medium mb-8 duration-500 dark:text-white">
          Discover luxury accommodations tailored to your needs.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center items-center">
          {/* Location Dropdown */}
          <select
            className="w-full md:w-[200px] h-12 px-3 rounded-lg text-base text-gray-900 shadow-sm transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-black bg-white"
          >
            {locations.map((location) => (
              <option key={location.value} value={location.value}>
                {location.label}
              </option>
            ))}
          </select>

          {/* Guests Dropdown */}
          <select
            className="w-full md:w-[200px] h-12 px-3 rounded-lg text-base text-gray-900 shadow-sm transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-black bg-white"
          >
            {guests.map((guest) => (
              <option key={guest.value} value={guest.value}>
                {guest.label}
              </option>
            ))}
          </select>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-[200px] h-12 px-3 rounded-lg text-base bg-black text-white hover:bg-blue-700 duration-300 ease-in-out dark:hover:bg-black dark:bg-btndark"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
