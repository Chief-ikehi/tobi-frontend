"use client";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ToasterContext from "./context/ToastContext";
import { ApolloProvider } from '@/components/providers/ApolloProvider';
import { NotificationProvider } from '@/context/NotificationContext';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <SessionProvider>
          <ApolloProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
            >
              <NotificationProvider>
                <div className="pt-20">
                  <Header />
                  <ToasterContext />
                  {children}
                  <Footer />
                  <ScrollToTop />
                </div>
                <Toaster />
              </NotificationProvider>
            </ThemeProvider>
          </ApolloProvider>
        </SessionProvider>
      </body>
    </html>
  );
}