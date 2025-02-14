import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "TOBI | The One Bedroom Institute",
  description: "Find and book one-bedroom apartments easily",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
      <div className="pt-20 bg-white">
          {children} {/* This renders your child components */}

      <Footer />
      </div>
      </body>
    </html>
  );
}
