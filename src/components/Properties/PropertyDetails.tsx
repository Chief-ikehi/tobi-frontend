"use client";

import { Property } from "@/types/property";
import Image from "next/image";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/utils/format";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { addDays, differenceInDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

interface PropertyDetailsProps {
  propertyId: string;
}

const PropertyDetails = ({ propertyId }: PropertyDetailsProps) => {
  const { data: session } = useSession();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [giftProcessing, setGiftProcessing] = useState(false);

  // Booking related state
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [bookingProcessing, setBookingProcessing] = useState(false);

  // Fetch property details
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}`);
        const data = await response.json();
        setProperty(data);
        setSelectedImage(data.images[0]);
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  const handleFavoriteClick = async () => {
    if (!session) {
      toast.error("Please sign in to save favorites");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}/favorite`, {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
    }
  };

  const handleGiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please sign in to gift properties");
      return;
    }

    setGiftProcessing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gifts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          recipientEmail,
          message: giftMessage,
        }),
      });

      if (response.ok) {
        toast.success("Gift sent successfully!");
        setShowGiftModal(false);
        setRecipientEmail("");
        setGiftMessage("");
      } else {
        toast.error("Failed to send gift");
      }
    } catch (error) {
      console.error("Error sending gift:", error);
      toast.error("Failed to send gift");
    } finally {
      setGiftProcessing(false);
    }
  };

  // Calculate total price based on selected dates
  const calculateTotalPrice = () => {
    if (!dateRange?.from || !dateRange?.to || !property) return 0;
    const nights = differenceInDays(dateRange.to, dateRange.from);
    return property.price * nights;
  };

  // Flutterwave configuration
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: Date.now().toString(),
    amount: calculateTotalPrice(),
    currency: "NGN",
    payment_options: "card,banktransfer,ussd",
    customer: {
      email: session?.user?.email ?? "",
      name: session?.user?.name ?? "",
      phone_number: property?.agent?.phone ?? "",
    },
    customizations: {
      title: "TOBI Property Booking",
      description: `Booking for ${property?.title}`,
      logo: "https://your-logo-url.com/logo.png",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error("Please sign in to make a booking");
      return;
    }

    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select your check-in and check-out dates");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setBookingProcessing(true);

    try {
      handleFlutterPayment({
        callback: async (response) => {
          if (response.status === "successful") {
            // Create booking in our backend
            const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                propertyId,
                checkIn: dateRange.from,
                checkOut: dateRange.to,
                guests,
                totalAmount: calculateTotalPrice(),
                transactionRef: response.transaction_id,
                paymentStatus: "PAID",
              }),
            });

            if (bookingResponse.ok) {
              toast.success("Booking confirmed successfully!");
              // Reset form
              setDateRange(undefined);
              setGuests(1);
              setAcceptedTerms(false);
            } else {
              toast.error("Failed to confirm booking");
            }
          } else {
            toast.error("Payment failed");
          }
          closePaymentModal();
        },
        onClose: () => {
          toast.error("Payment cancelled");
        },
      });
    } catch (error) {
      console.error("Error processing booking:", error);
      toast.error("Failed to process booking");
    } finally {
      setBookingProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32">
        <div className="animate-pulse">
          <div className="h-[500px] w-full bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-32">
        <p className="text-center text-lg text-gray-500">Property not found</p>
      </div>
    );
  }

  return (
    <section className="pb-12.5 pt-32.5">
      <div className="container">
        {/* Image Gallery */}
        <div className="grid grid-cols-12 gap-7.5">
          <div className="col-span-12 lg:col-span-8">
            <div className="relative h-[500px] w-full overflow-hidden rounded-lg">
              <Image
                src={selectedImage}
                alt={property.title}
                className="object-cover"
                fill
                priority
              />
              <button
                onClick={handleFavoriteClick}
                className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/70 text-body-color transition-all hover:bg-primary hover:text-white dark:bg-dark-2/70 dark:hover:bg-primary"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <svg
                  className={`h-6 w-6 transition-colors ${isFavorite ? 'text-red-500 fill-current' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isFavorite ? 'fill-current' : ''}
                  />
                </svg>
              </button>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-4">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`relative h-24 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === image
                      ? "border-primary"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="object-cover"
                    fill
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Property Info */}
          <div className="col-span-12 lg:col-span-4">
            <div className="rounded-lg bg-white p-7.5 shadow-solid-8 dark:bg-blacksection">
              <h1 className="mb-4 text-2xl font-semibold text-black dark:text-white">
                {property.title}
              </h1>
              <p className="mb-6 text-lg font-medium text-body-color">
                {property.location}
              </p>
              <div className="mb-7.5 flex items-center justify-between border-b border-stroke pb-7.5 dark:border-strokedark">
                <div>
                  <span className="text-3xl font-semibold text-black dark:text-white">
                    {formatCurrency(property.price)}
                  </span>
                  {property.type === "SHORTLET" && (
                    <span className="text-base text-body-color">/night</span>
                  )}
                </div>
                <button
                  onClick={() => setShowGiftModal(true)}
                  className="inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 text-white hover:bg-primary/90"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 12V22H4V12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 7H2V12H22V7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 22V7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Gift Property
                </button>
              </div>

              {/* Property Features */}
              <div className="mb-7.5 grid grid-cols-3 gap-4 border-b border-stroke pb-7.5 dark:border-strokedark">
                <div className="text-center">
                  <span className="mb-2 block text-2xl font-semibold text-black dark:text-white">
                    {property.bedrooms}
                  </span>
                  <span className="text-base text-body-color">Bedrooms</span>
                </div>
                <div className="text-center">
                  <span className="mb-2 block text-2xl font-semibold text-black dark:text-white">
                    {property.bathrooms}
                  </span>
                  <span className="text-base text-body-color">Bathrooms</span>
                </div>
                <div className="text-center">
                  <span className="mb-2 block text-2xl font-semibold text-black dark:text-white">
                    {property.squareFeet}
                  </span>
                  <span className="text-base text-body-color">Sq Ft</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-7.5 border-b border-stroke pb-7.5 dark:border-strokedark">
                <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 text-primary"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-body-color">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent Info */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                  Listed by
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full">
                    <Image
                      src={property.agent.avatar}
                      alt={property.agent.name}
                      className="object-cover"
                      fill
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-black dark:text-white">
                      {property.agent.name}
                    </h4>
                    <button className="mt-1 text-sm text-primary hover:underline">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Property Description */}
          <div className="col-span-12 lg:col-span-8">
            <div className="rounded-lg bg-white p-7.5 shadow-solid-8 dark:bg-blacksection">
              <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
                About this property
              </h2>
              <p className="text-body-color">{property.description}</p>
            </div>
          </div>
        </div>

        {/* Add this after the Property Info section */}
        {(property?.type === "SHORTLET" || property?.type === "BOTH") && (
          <div className="col-span-12 lg:col-span-4">
            <div className="rounded-lg bg-white p-7.5 shadow-solid-8 dark:bg-blacksection">
              <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
                Book this property
              </h3>
              <form onSubmit={handleBookingSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Select Dates
                  </label>
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={{ before: new Date() }}
                    className="rounded-lg border border-stroke p-4 dark:border-strokedark"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="guests"
                    className="mb-2.5 block text-black dark:text-white"
                  >
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    id="guests"
                    min={1}
                    max={property?.maxGuests ?? 1}
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-body-color outline-none focus:border-primary dark:border-strokedark dark:text-white dark:focus:border-primary"
                  />
                </div>

                {dateRange?.from && dateRange?.to && (
                  <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-dark-2">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-body-color">
                        {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                        {format(dateRange.to, "MMM dd, yyyy")}
                      </span>
                      <span className="font-medium text-black dark:text-white">
                        {differenceInDays(dateRange.to, dateRange.from)} nights
                      </span>
                    </div>
                    <div className="mb-4 flex items-center justify-between border-b border-stroke pb-4 dark:border-strokedark">
                      <span className="text-body-color">
                        {formatCurrency(property?.price ?? 0)} × {differenceInDays(dateRange.to, dateRange.from)} nights
                      </span>
                      <span className="font-medium text-black dark:text-white">
                        {formatCurrency(calculateTotalPrice())}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-black dark:text-white">
                        Total
                      </span>
                      <span className="text-lg font-semibold text-black dark:text-white">
                        {formatCurrency(calculateTotalPrice())}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="border-gray-300 bg-gray-100 text-blue-600 dark:border-gray-600 dark:bg-gray-700 group mr-3 flex h-5 min-w-[20px] items-center justify-center rounded peer-checked:bg-primary">
                      <svg
                        className="opacity-0 peer-checked:group-[]:opacity-100"
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.70704 0.792787C9.89451 0.980314 9.99983 1.23462 9.99983 1.49979C9.99983 1.76495 9.89451 2.01926 9.70704 2.20679L4.70704 7.20679C4.51951 7.39426 4.26521 7.49957 4.00004 7.49957C3.73488 7.49957 3.48057 7.39426 3.29304 7.20679L0.293041 4.20679C0.110883 4.01818 0.0100885 3.76558 0.0123669 3.50339C0.0146453 3.24119 0.119814 2.99038 0.305222 2.80497C0.490631 2.61956 0.741443 2.51439 1.00364 2.51211C1.26584 2.50983 1.51844 2.61063 1.70704 2.79279L4.00004 5.08579L8.29304 0.792787C8.48057 0.605316 8.73488 0.5 9.00004 0.5C9.26521 0.5 9.51951 0.605316 9.70704 0.792787Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                    <span className="text-sm text-body-color">
                      I agree to the{" "}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => {
                          // TODO: Show terms modal
                        }}
                      >
                        terms and conditions
                      </button>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={bookingProcessing || !dateRange?.from || !dateRange?.to || !acceptedTerms}
                  className="w-full rounded-lg bg-primary px-6 py-3 text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {bookingProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Book Now - ${formatCurrency(calculateTotalPrice())}`
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-7.5 dark:bg-blacksection">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
              Gift this property
            </h3>
            <form onSubmit={handleGiftSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="recipientEmail"
                  className="mb-2.5 block text-black dark:text-white"
                >
                  Recipient's Email
                </label>
                <input
                  type="email"
                  id="recipientEmail"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-body-color outline-none focus:border-primary dark:border-strokedark dark:text-white dark:focus:border-primary"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="giftMessage"
                  className="mb-2.5 block text-black dark:text-white"
                >
                  Message (Optional)
                </label>
                <textarea
                  id="giftMessage"
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="h-24 w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-body-color outline-none focus:border-primary dark:border-strokedark dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowGiftModal(false)}
                  className="rounded-lg px-6 py-2 text-body-color hover:text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={giftProcessing}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {giftProcessing ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Send Gift"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default PropertyDetails; 