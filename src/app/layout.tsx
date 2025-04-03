"use client";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ToasterContext from "./context/ToastContext";
import { AuthProvider } from "@/contexts/auth-context";
import NotificationBell from "@/components/Notification/NotificationBell";
import { useEffect } from "react";
import { Analytics } from '@vercel/analytics/react'; // Add this import

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/67eda36f792fcb190c342680/1ins96rtp";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
  }, []);


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="pt-20">
              <Header />
              <ToasterContext />
              {children}
              <Footer />
              {/*<ScrollToTop />*/}
            </div>
            <Toaster />
            <NotificationBell />
            <Analytics /> {/* Add the Analytics component here */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
