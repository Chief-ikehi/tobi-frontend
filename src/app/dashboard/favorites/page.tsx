"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Temporary mock data
const mockFavorites = [
  {
    id: "1",
    title: "Luxury Apartment in Downtown",
    type: "SHORT_LET",
    price: 250000,
    location: "123 Main St, Downtown",
    image: "https://placehold.co/600x400",
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: "2",
    title: "Investment Property with High ROI",
    type: "INVESTMENT",
    price: 500000,
    location: "456 Investment Ave",
    image: "https://placehold.co/600x400",
    bedrooms: 4,
    bathrooms: 3,
  },
];

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState(mockFavorites);

  const removeFavorite = async (id: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement remove from favorites
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFavorites(favorites.filter((fav) => fav.id !== id));
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Favorites</h3>
        <p className="text-sm text-muted-foreground">
          Manage your saved properties.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search favorites..."
          className="max-w-sm"
        />
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            <SelectItem value="SHORT_LET">Short Let</SelectItem>
            <SelectItem value="INVESTMENT">Investment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {favorites.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Heart className="h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">No favorites yet</p>
              <p className="text-sm text-muted-foreground">
                Properties you save will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          favorites.map((property) => (
            <Card key={property.id}>
              <CardContent className="grid gap-6 p-6 sm:grid-cols-[250px_1fr]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  {/* Replace with next/image when implementing */}
                  <img
                    src={property.image}
                    alt={property.title}
                    className="object-cover"
                  />
                  <div className="absolute right-2 top-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFavorite(property.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Heart className="h-4 w-4 fill-current" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">{property.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {property.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {property.bedrooms} beds
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm font-medium">
                        {property.bathrooms} baths
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">
                        ${property.price.toLocaleString()}
                      </span>
                      {property.type === "SHORT_LET" && (
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          / night
                        </span>
                      )}
                    </div>
                    <Button>View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 