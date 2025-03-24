"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AMENITIES = [
  "Swimming Pool",
  "Gym",
  "Security",
  "Parking",
  "Air Conditioning",
  "Furnished",
  "Internet",
  "Generator",
];

const PropertyForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    title: "",
    description: "",
    type: "SHORTLET", // SHORTLET, INVESTMENT, BOTH
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    max_guests: "",
    roi: "",
    cost_price: "",
    amenities: [] as string[],
    images: [] as File[],
  });

  const handleAmenityToggle = (amenity: string) => {
    setData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setData({ ...data, images: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.title || !data.description || !data.location || !data.price || !data.bedrooms || !data.bathrooms || !data.square_feet || data.images.length === 0) {
      toast.error("Please fill all required fields.");
      return;
    }

    if ((data.type === "SHORTLET" || data.type === "BOTH") && !data.max_guests) {
      toast.error("Max guests required for shortlet listings.");
      return;
    }

    if ((data.type === "INVESTMENT" || data.type === "BOTH") && (!data.roi || !data.cost_price)) {
      toast.error("ROI and cost price required for investment listings.");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("location", data.location);
    formData.append("price", data.price);
    formData.append("bedrooms", data.bedrooms);
    formData.append("bathrooms", data.bathrooms);
    formData.append("square_feet", data.square_feet);
    formData.append("max_guests", data.max_guests || "");
    formData.append("roi", data.roi || "");
    formData.append("cost_price", data.cost_price || "");
    data.amenities.forEach((amenity) => formData.append("amenities", amenity));
    data.images.forEach((img) => formData.append("images", img));

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/create/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        toast.success("Property submitted for approval.");
        router.push("/dashboard/agent");
      } else {
        toast.error("Failed to submit. Check your input.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-20">
      <h1 className="text-3xl font-bold mb-6">List a Property</h1>

      <form onSubmit={handleSubmit} className="grid gap-6 max-w-2xl">
        {/* Basic Fields */}
        <input
          type="text"
          placeholder="Title"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="border rounded px-4 py-2"
          required
        />
        <textarea
          placeholder="Description"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="border rounded px-4 py-2"
          rows={4}
          required
        />
        <select
          value={data.type}
          onChange={(e) => setData({ ...data, type: e.target.value })}
          className="border rounded px-4 py-2"
        >
          <option value="SHORTLET">Shortlet</option>
          <option value="INVESTMENT">Investment</option>
          <option value="BOTH">Shortlet + Investment</option>
        </select>

        <input
          type="text"
          placeholder="Location"
          value={data.location}
          onChange={(e) => setData({ ...data, location: e.target.value })}
          className="border rounded px-4 py-2"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={data.price}
          onChange={(e) => setData({ ...data, price: e.target.value })}
          className="border rounded px-4 py-2"
          required
        />

        <div className="grid grid-cols-3 gap-4">
          <input
            type="number"
            placeholder="Bedrooms"
            value={data.bedrooms}
            onChange={(e) => setData({ ...data, bedrooms: e.target.value })}
            className="border rounded px-4 py-2"
            required
          />
          <input
            type="number"
            placeholder="Bathrooms"
            value={data.bathrooms}
            onChange={(e) => setData({ ...data, bathrooms: e.target.value })}
            className="border rounded px-4 py-2"
            required
          />
          <input
            type="number"
            placeholder="Square Feet"
            value={data.square_feet}
            onChange={(e) => setData({ ...data, square_feet: e.target.value })}
            className="border rounded px-4 py-2"
            required
          />
        </div>

        {(data.type === "SHORTLET" || data.type === "BOTH") && (
          <input
            type="number"
            placeholder="Max Guests"
            value={data.max_guests}
            onChange={(e) => setData({ ...data, max_guests: e.target.value })}
            className="border rounded px-4 py-2"
            required
          />
        )}

        {(data.type === "INVESTMENT" || data.type === "BOTH") && (
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="ROI (%)"
              value={data.roi}
              onChange={(e) => setData({ ...data, roi: e.target.value })}
              className="border rounded px-4 py-2"
              required
            />
            <input
              type="number"
              placeholder="Cost Price"
              value={data.cost_price}
              onChange={(e) => setData({ ...data, cost_price: e.target.value })}
              className="border rounded px-4 py-2"
              required
            />
          </div>
        )}

        {/* Amenities */}
        <div>
          <p className="mb-2 text-sm font-medium">Amenities</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AMENITIES.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={data.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium mb-2">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit for Approval"}
        </button>
      </form>
    </section>
  );
};

export default PropertyForm;