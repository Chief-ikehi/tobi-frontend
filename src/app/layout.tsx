import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import ToasterContext from "./context/ToastContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <div className = "pt-20">
          <Header />
            </div>
          <ToasterContext />
          {children}
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}