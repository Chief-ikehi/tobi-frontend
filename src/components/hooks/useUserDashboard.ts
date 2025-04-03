import { useEffect, useState } from "react";
import axios from "@/lib/axios";

type DashboardData = {
  user: {
    role: string;
  };
  wallet_balance: number;
  membership: {
    tier: string | null;
  } | null;
};

export const useUserDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/auth/dashboard/");
        setData(res.data);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, loading };
};