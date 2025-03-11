"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";  // Use this from next/navigation for route change detection
import LoadingSpinner from "@/components/LoadingSpinner";

const GlobalLoading = () => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();  // Get the current pathname

  // Track pathname changes
  useEffect(() => {
    // Start loading on pathname change
    setLoading(true);

    // Simulate delay and stop loading once the component has mounted
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust delay if necessary to match transition speed

    // Cleanup timeout
    return () => clearTimeout(timer);
  }, [pathname]);  // Trigger when pathname changes

  return loading ? <LoadingSpinner /> : null;
};

export default GlobalLoading;
