"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Calendar, Loader2, MapPin } from "lucide-react";

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Temporary mock data
const mockBookings = [
  {
    id: "1",
    propertyTitle: "Luxury Apartment in Downtown",
    location: "123 Main St, Downtown",
    image: "https://placehold.co/600x400",
    checkIn: "2024-03-20",
    checkOut: "2024-03-25",
    status: "UPCOMING",
    totalPrice: 1250,
    guests: 2,
  },
  {
    id: "2",
    propertyTitle: "Beachfront Villa",
    location: "789 Beach Road",
    image: "https://placehold.co/600x400",
    checkIn: "2024-02-15",
    checkOut: "2024-02-20",
    status: "COMPLETED",
    totalPrice: 2000,
    guests: 4,
  },
];

export default function BookingsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState(mockBookings);

  const cancelBooking = async (id: string) => {
    try {
      setIsLoading(true);
      // TODO: Implement booking cancellation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setBookings(bookings.map(booking => 
        booking.id === id 
          ? { ...booking, status: "CANCELLED" }
          : booking
      ));
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Bookings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your property bookings and reservations.
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4">
          <Input
            placeholder="Search bookings..."
            className="max-w-sm"
          />
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="space-y-4">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Calendar className="h-10 w-10 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">No bookings yet</p>
                <p className="text-sm text-muted-foreground">
                  When you book a property, it will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="grid gap-6 p-6 sm:grid-cols-[200px_1fr]">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    {/* Replace with next/image when implementing */}
                    <img
                      src={booking.image}
                      alt={booking.propertyTitle}
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{booking.propertyTitle}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {booking.location}
                          </div>
                        </div>
                        <Badge
                          className={getStatusColor(booking.status)}
                          variant="secondary"
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <p className="text-sm font-medium">Check-in</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(booking.checkIn)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Check-out</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(booking.checkOut)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Guests</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">
                          ${booking.totalPrice.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {" "}
                          total
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">View Details</Button>
                        {booking.status === "UPCOMING" && (
                          <Button
                            variant="destructive"
                            onClick={() => cancelBooking(booking.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="upcoming">
          {/* Filter and show only upcoming bookings */}
        </TabsContent>

        <TabsContent value="completed">
          {/* Filter and show only completed bookings */}
        </TabsContent>

        <TabsContent value="cancelled">
          {/* Filter and show only cancelled bookings */}
        </TabsContent>
      </Tabs>
    </div>
  );
} 