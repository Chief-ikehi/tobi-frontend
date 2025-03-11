// components/FavoriteButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";  // If you use a library like react-toastify for notifications

interface FavoriteItem {
  id: string;
  propertyId: string;
  userId: string;
}

interface FavoriteButtonProps {
  propertyId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ propertyId }) => {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (session) {
      // Fetch favorites and check if this property is already a favorite
      const fetchFavorites = async () => {
        try {
          const response = await fetch("/api/favorites");
          const data = await response.json();
          setIsFavorite(data.some((item: FavoriteItem) => item.propertyId === propertyId));
        } catch (err) {
          console.error("Error fetching favorites:", err);
        }
      };
      fetchFavorites();
    }
  }, [session, propertyId]);

  const handleFavoriteClick = async () => {
    if (!session) {
      toast.error("You need to be logged in to add favorites", {
        position: "top-center", // Position of the toast
        duration: 4000,
        style: {
        zIndex: 99999,
        }
      });
      return;
    }

    try {
      const method = isFavorite ? "DELETE" : "POST";
      const response = await fetch("/api/favorites", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ propertyId }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
      } else {
        toast.error("Something went wrong", {
        position: "top-center", // Position of the toast
        duration: 4000,
        style: {
        zIndex: 99999,
        }
      });
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
      toast.error("Error updating favorite", {
        position: "top-center", // Position of the toast
        duration: 4000,
        style: {
        zIndex: 99999,
        }
      });
    }
  };

  return (
    <button
      onClick={handleFavoriteClick}
      className={`p-2 rounded-full ${isFavorite ? "bg-red-500" : "bg-gray-500"}`}
    >
      {isFavorite ? "❤️" : "🤍"}  {/* Change the heart icon color */}
    </button>
  );
};
export default FavoriteButton;

