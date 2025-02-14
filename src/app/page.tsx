"use client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";

export default function Home() {
  return (
      <div className = "bg-white">
      <Navbar />
      <Hero />
      <FeaturedProperties />
      </div>
  );
}
