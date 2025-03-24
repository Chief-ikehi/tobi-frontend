// /dashboard/gifts/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/format";

interface Gift {
  id: string;
  property: {
    id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
  };
  message: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  sender_name: string;
  created_at: string;
}

const GiftingInbox = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gifts/inbox/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setGifts(data);
      } catch {
        toast.error("Failed to load gifts inbox");
      } finally {
        setLoading(false);
      }
    };
    fetchGifts();
  }, []);

  const respondToGift = async (giftId: string, accept: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gifts/${giftId}/${accept ? "accept" : "decline"}/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success(`Gift ${accept ? "accepted" : "declined"}`);
        setGifts((prev) =>
          prev.map((g) =>
            g.id === giftId ? { ...g, status: accept ? "ACCEPTED" : "DECLINED" } : g
          )
        );
      } else {
        toast.error("Failed to update gift status");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return <div className="py-40 text-center text-lg">Loading your gifts...</div>;
  }

  return (
    <section className="container py-20">
      <h1 className="text-3xl font-bold mb-6">Gifted Properties</h1>

      {gifts.length === 0 ? (
        <p className="text-gray-500">No gifts yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className="rounded-lg border p-4 bg-white dark:bg-blacksection shadow-sm"
            >
              <div className="flex gap-4 items-start">
                <div className="relative h-28 w-40 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src={gift.property.images[0]}
                    alt={gift.property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold mb-1">{gift.property.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">{gift.property.location}</p>
                  <p className="text-sm text-body-color mb-1">
                    Price: {formatCurrency(gift.property.price)}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Message:</strong> {gift.message || "(No message)"}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    From: {gift.sender_name} on {new Date(gift.created_at).toLocaleDateString()}
                  </p>

                  {gift.status === "PENDING" ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => respondToGift(gift.id, true)}
                        className="px-4 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => respondToGift(gift.id, false)}
                        className="px-4 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className={`inline-block px-3 py-1 text-xs rounded-full ${gift.status === "ACCEPTED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {gift.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default GiftingInbox;
