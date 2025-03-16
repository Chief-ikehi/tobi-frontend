"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Building2,
  DollarSign,
  Eye,
  Calendar,
  Plus,
  Filter,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardStats {
  totalListings: number;
  totalCommission: number;
  totalViews: number;
  totalBookings: number;
}

interface PropertyListing {
  id: string;
  title: string;
  type: "SHORT_LET" | "INVESTMENT";
  status: "PENDING" | "ACTIVE" | "REJECTED" | "SOLD" | "RENTED";
  price: number;
  location: string;
  views: number;
  bookings: number;
  createdAt: string;
}

export function AgentDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    totalCommission: 0,
    totalViews: 0,
    totalBookings: 0,
  });
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, listingsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/agent/stats`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/agent/listings`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }),
        ]);

        if (!statsResponse.ok || !listingsResponse.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const statsData = await statsResponse.json();
        const listingsData = await listingsResponse.json();

        setStats(statsData);
        setListings(listingsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  const filteredListings = listings.filter((listing) => {
    const matchesStatus =
      statusFilter === "all" || listing.status.toLowerCase() === statusFilter;
    const matchesSearch = listing.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en").format(num);
  };

  const handleEditProperty = (id: string) => {
    router.push(`/agent/listings/${id}/edit`);
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agent/listings/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete property");
      }

      setListings((prev) => prev.filter((listing) => listing.id !== id));
      toast.success("Property deleted successfully");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: PropertyListing["status"]) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agent/listings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update property status");
      }

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id ? { ...listing, status: newStatus } : listing
        )
      );
      toast.success("Property status updated successfully");
    } catch (error) {
      console.error("Error updating property status:", error);
      toast.error("Failed to update property status");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-28" />
                <Skeleton className="mt-1 h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.totalListings)}
            </div>
            <p className="text-xs text-muted-foreground">
              Active and pending properties
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Commission
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalCommission)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.totalViews)}
            </div>
            <p className="text-xs text-muted-foreground">
              Views across all listings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(stats.totalBookings)}
            </div>
            <p className="text-xs text-muted-foreground">
              Successful reservations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Property Listings */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Property Listings</h2>
          <Button onClick={() => router.push("/agent/listings/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Property
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredListings.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-semibold">No properties found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Start by adding a new property"}
              </p>
            </div>
          ) : (
            filteredListings.map((listing) => (
              <Card key={listing.id} className="cursor-pointer hover:bg-accent/50">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{listing.title}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          listing.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : listing.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : listing.status === "SOLD"
                            ? "bg-blue-100 text-blue-700"
                            : listing.status === "RENTED"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {listing.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {formatNumber(listing.views)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatNumber(listing.bookings)}
                    </div>
                    <div className="font-medium text-foreground">
                      {formatCurrency(listing.price)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditProperty(listing.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {listing.type === "SHORT_LET" && listing.status === "ACTIVE" && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(listing.id, "RENTED")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Rented
                          </DropdownMenuItem>
                        )}
                        {listing.type === "INVESTMENT" && listing.status === "ACTIVE" && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(listing.id, "SOLD")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Sold
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteProperty(listing.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 