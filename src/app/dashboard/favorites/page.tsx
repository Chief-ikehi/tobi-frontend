import { Metadata } from "next";
import FavoritePage from "@/components/Dashboard/FavoritePage";

export const metadata: Metadata = {
  title: "User's Favorite Page - TOBI",

  // other metadata
  description: "This is the User's Favorite page for TOBI",
  icons: "/images/tobi-favicon.png"
};

export default function Home() {
  return <FavoritePage />
}
