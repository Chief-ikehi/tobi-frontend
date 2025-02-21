import { Metadata } from "next";
import Navbar from "@/components/Navbar";
//import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";

export const metadata: Metadata = {
  title: "TOBI | The One Bedroom Institute",

  // other metadata
  description: "Find and book one-bedroom apartments easily"
};

export default function Home() {
  return (
      <main>
      <Hero />
      <FeaturedProperties />
      </main>
  );
}
