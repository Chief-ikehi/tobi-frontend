import { Metadata } from "next";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";

export const metadata: Metadata = {
  title: "TOBI | The One Bedroom Institute",

  // other metadata
  description: "Find and book one-bedroom apartments easily",
  icons: "/images/tobi-favicon.png"
};

export default function Home() {
  return (
      <main>
        <Hero />
        <FeaturedProperties />
      </main>
  );
}
