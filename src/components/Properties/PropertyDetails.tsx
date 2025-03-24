"use client";

import { useEffect, useState } from "react";
import { Property } from "@/types/property";
import Image from "next/image";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

interface PropertyDetailsProps {
  propertyId: string;
}

const PropertyDetails = ({ propertyId }: PropertyDetailsProps) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>();
  const [guests, setGuests] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${propertyId}/`);
        const data = await res.json();
        setProperty(data);
        setSelectedImage(data.images[0]);
      } catch (err) {
        toast.error("Failed to load property details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleBooking = () => {
  if (!token) return toast.error("Login required to book.");
  if (!dateRange?.from || !dateRange?.to) return toast.error("Select booking dates.");
  if (!acceptedTerms) return toast.error("Please accept terms.");

  const nights = differenceInDays(dateRange.to, dateRange.from);
  const total = property!.price * nights;

  // Config for Flutterwave payment
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
    tx_ref: `${Date.now()}-${propertyId}`,
    amount: total,
    currency: "NGN",
    payment_options: "card,banktransfer",
    customer: {
      email: localStorage.getItem("user_email") || "guest@example.com",
      name: localStorage.getItem("user_name") || "Guest",
      phone_number: property?.agent?.phone_number || "+2342348114936955", // Ensure this is a valid placeholder
    },
    customizations: {
      title: "T.O.B.I Booking",
      description: `Booking ${property?.title}`,
      logo: "/images/logo/tobi-logo-dark.svg",
    },
  };

  const triggerPayment = useFlutterwave(config);

  // Trigger payment process
  triggerPayment({
    callback: async (res) => {
      if (res.status === "successful") {
        // Handle the booking creation after successful payment
        const booking = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/create/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            property: propertyId,
            start_date: dateRange.from,
            end_date: dateRange.to,
            guests,
            tx_ref: res.tx_ref,
            payment_status: "PAID",
          }),
        });

        if (booking.ok) {
          toast.success("Booking confirmed!");
        } else {
          toast.error("Failed to create booking.");
        }
      } else {
        toast.error("Payment failed");
      }

      closePaymentModal();
    },
    onClose: () => toast("Payment cancelled."),
  });
};

  const handleGiftPaymentAndSubmit = () => {
    if (!token) return toast.error("Login required to gift.");
    if (!recipientEmail) return toast.error("Recipient email is required.");

    const config = {
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
      tx_ref: `${Date.now()}-GIFT-${propertyId}`,
      amount: property!.price,
      currency: "NGN",
      payment_options: "card,banktransfer",
      customer: {
        email: localStorage.getItem("user_email") || "guest@example.com",
        name: localStorage.getItem("user_name") || "Guest",
        phone_number: property?.agent?.phone_number || "+2348114936955",
      },
      customizations: {
        title: "T.O.B.I Property Gift",
        description: `Gifting ${property?.title}`,
        logo: "/images/logo/tobi-logo-dark.svg",
      },
    };

    const triggerPayment = useFlutterwave(config);

    triggerPayment({
      callback: async (response) => {
        if (response.status === "successful") {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gifts/create/`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                property: propertyId,
                recipient_email: recipientEmail,
                message: giftMessage,
                transaction_ref: response.tx_ref,
              }),
            });

            if (res.ok) {
              toast.success("Gift sent!");
              setRecipientEmail("");
              setGiftMessage("");
              setShowGiftModal(false);
            } else {
              toast.error("Payment succeeded, but gift failed.");
            }
          } catch {
            toast.error("Gift creation failed.");
          }
        } else {
          toast.error("Payment was not successful.");
        }

        closePaymentModal();
      },
      onClose: () => toast("Gift payment cancelled."),
    });
  };

  const handleInvestment = (type: "INSTALLMENT" | "OUTRIGHT") => {
    if (!token || !property) return toast.error("Login required to invest");

    const amount = type === "OUTRIGHT"
      ? property.cost_price
      : Math.round(property.cost_price * 0.6);

    const config = {
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
      tx_ref: `${Date.now()}-INVEST-${propertyId}`,
      amount,
      currency: "NGN",
      payment_options: "card,banktransfer",
      customer: {
        email: localStorage.getItem("user_email") || "guest@example.com",
        name: localStorage.getItem("user_name") || "Guest",
        phone_number: property?.agent?.phone_number || "+2348114936955",
      },
      customizations: {
        title: "T.O.B.I Investment",
        description: `Investing in ${property.title}`,
        logo: "/images/logo/tobi-logo-dark.svg",
      },
    };

    const triggerPayment = useFlutterwave(config);

    triggerPayment({
      callback: async (response) => {
        if (response.status === "successful") {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/investments/create/`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              property: propertyId,
              amount,
              payment_type: type,
              transaction_ref: response.tx_ref,
            }),
          });

          if (res.ok) {
            toast.success("Investment successful!");
            setShowInvestmentModal(false);
          } else {
            toast.error("Investment failed after payment");
          }
        } else {
          toast.error("Payment not successful");
        }

        closePaymentModal();
      },
      onClose: () => toast("Investment payment cancelled."),
    });
  };

  if (loading) return <div className="py-40 text-center text-lg">Loading property...</div>;
  if (!property) return <div className="py-40 text-center text-lg text-red-500">Property not found.</div>;

  const type = property.property_type?.toUpperCase();

  return (
    <section className="py-20 container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="relative h-[400px] w-full mb-4 rounded-lg overflow-hidden">
            <Image src={selectedImage} alt={property.title} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-5 gap-3">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative h-20 rounded-md border-2 ${selectedImage === img ? "border-primary" : "border-transparent"}`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
          <p className="text-body-color mb-2">{property.location}</p>
          <p className="text-black text-xl font-semibold mb-4">
            {formatCurrency(property.price)} {type === "SHORTLET" && "/night"}
          </p>
          <p className="text-body-color mb-6">{property.description}</p>

          <div className="grid grid-cols-3 gap-4 text-sm text-body-color mb-6">
            <span>{property.bedrooms} Bedrooms</span>
            <span>{property.bathrooms} Bathrooms</span>
            <span>{property.squareFeet} Sqft</span>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Amenities</h3>
            <ul className="list-disc list-inside text-body-color text-sm">
              {property.amenities.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Listed By</h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 relative rounded-full overflow-hidden">
                <Image src={property.agent.avatar} alt={property.agent.name} fill className="object-cover" />
              </div>
              <div className="text-sm">
                <p>{property.agent.name}</p>
                <p className="text-xs text-gray-500">{property.agent.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowGiftModal(true)}
            className="mb-4 w-full rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Gift This Property
          </button>

          {(type === "SHORTLET" || type === "BOTH") && (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="text-sm block mb-1">Select Dates</label>
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  disabled={{ before: new Date() }}
                />
              </div>
              <div className="mb-4">
                <label className="text-sm block mb-1">Guests</label>
                <input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full rounded-md border px-3 py-2"
                  min={1}
                  max={property.maxGuests || 10}
                />
              </div>
              <label className="mb-4 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                I agree to the terms and conditions
              </label>
              <button
                type="submit"
                onClick={handleBooking}
                className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-gray-900"
              >
                Book Now ({formatCurrency(property.price)} per night)
              </button>
            </form>
          )}

          {(type === "INVESTMENT" || type === "BOTH") && (
            <div className="mt-6">
              <button
                onClick={() => setShowInvestmentModal(true)}
                className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Invest in this Property
              </button>
            </div>
          )}
        </div>
      </div>

      {showGiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-white p-6 rounded-md relative">
            <h2 className="text-lg font-semibold mb-4">Gift this Property</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
                placeholder="Recipient email"
                className="w-full mb-3 rounded border px-3 py-2"
              />
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Message (optional)"
                className="w-full mb-4 rounded border px-3 py-2"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowGiftModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleGiftPaymentAndSubmit}
                  className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/80"
                >
                  Pay & Gift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInvestmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-white p-6 rounded-md">
            <h2 className="text-lg font-semibold mb-4">Choose Investment Option</h2>
            <div className="grid gap-4">
              <button
                onClick={() => handleInvestment("INSTALLMENT")}
                className="w-full rounded bg-yellow-600 text-white px-4 py-2 hover:bg-yellow-700"
              >
                Pay 60% Installment ({formatCurrency(Math.round(property!.cost_price * 0.6))})
              </button>
              <button
                onClick={() => handleInvestment("OUTRIGHT")}
                className="w-full rounded bg-green-600 text-white px-4 py-2 hover:bg-green-700"
              >
                Pay Full Price ({formatCurrency(property!.cost_price)})
              </button>
            </div>
            <button
              onClick={() => setShowInvestmentModal(false)}
              className="mt-4 text-sm text-gray-600 hover:text-black"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PropertyDetails;