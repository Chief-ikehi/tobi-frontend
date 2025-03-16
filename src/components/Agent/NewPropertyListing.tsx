"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
  Building2,
  ChevronRight,
  Image as ImageIcon,
  MapPin,
  DollarSign,
  Calendar,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn, formatPriceInput, parsePriceInput } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { PropertyPreview } from "./PropertyPreview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const propertySchema = z.object({
  type: z.enum(["SHORT_LET", "INVESTMENT"]),
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  location: z.string().min(5, "Please enter a valid location"),
  price: z.string().transform((val) => parseFloat(val.replace(/,/g, ""))),
  bedrooms: z.string().transform(Number),
  bathrooms: z.string().transform(Number),
  propertyType: z.enum([
    "APARTMENT",
    "HOUSE",
    "VILLA",
    "TOWNHOUSE",
    "LAND",
    "COMMERCIAL",
  ]),
  amenities: z.array(z.string()).min(1, "Select at least one amenity"),
  images: z.array(z.union([
    z.custom<File>(),
    z.string().url("Invalid image URL")
  ])).min(3, "Upload at least 3 images"),
  // Additional fields for investment properties
  investmentDetails: z.object({
    roi: z.string().optional(),
    installmentAvailable: z.boolean().optional(),
    initialPayment: z.string().optional(),
    monthlyPayment: z.string().optional(),
    duration: z.string().optional(),
  }).optional(),
  // Additional fields for short-let properties
  shortLetDetails: z.object({
    minStay: z.string().optional(),
    maxStay: z.string().optional(),
    availableFrom: z.string().optional(),
    availableTo: z.string().optional(),
    cleaningFee: z.string().optional(),
    securityDeposit: z.string().optional(),
  }).optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "VILLA", label: "Villa" },
  { value: "TOWNHOUSE", label: "Townhouse" },
  { value: "LAND", label: "Land" },
  { value: "COMMERCIAL", label: "Commercial Property" },
];

const AMENITIES = [
  "Wi-Fi",
  "Air Conditioning",
  "Pool",
  "Gym",
  "Parking",
  "Security",
  "Elevator",
  "Furnished",
  "Garden",
  "Balcony",
];

interface NewPropertyListingProps {
  mode?: "create" | "edit";
  initialData?: any;
  propertyId?: string;
}

export function NewPropertyListing({
  mode = "create",
  initialData,
  propertyId,
}: NewPropertyListingProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [propertyType, setPropertyType] = useState<"SHORT_LET" | "INVESTMENT">("SHORT_LET");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: "SHORT_LET",
      title: "",
      description: "",
      location: "",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      propertyType: "APARTMENT",
      amenities: [],
      images: [],
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        type: initialData.type,
        title: initialData.title,
        description: initialData.description,
        location: initialData.location,
        price: initialData.price.toString(),
        bedrooms: initialData.bedrooms.toString(),
        bathrooms: initialData.bathrooms.toString(),
        propertyType: initialData.propertyType,
        amenities: initialData.amenities,
        images: initialData.images || [],
        ...(initialData.type === "INVESTMENT" && {
          investmentDetails: {
            roi: initialData.investmentDetails?.roi,
            installmentAvailable: initialData.investmentDetails?.installmentAvailable,
            initialPayment: initialData.investmentDetails?.initialPayment,
            monthlyPayment: initialData.investmentDetails?.monthlyPayment,
            duration: initialData.investmentDetails?.duration,
          },
        }),
        ...(initialData.type === "SHORT_LET" && {
          shortLetDetails: {
            minStay: initialData.shortLetDetails?.minStay,
            maxStay: initialData.shortLetDetails?.maxStay,
            availableFrom: initialData.shortLetDetails?.availableFrom,
            availableTo: initialData.shortLetDetails?.availableTo,
            cleaningFee: initialData.shortLetDetails?.cleaningFee,
            securityDeposit: initialData.shortLetDetails?.securityDeposit,
          },
        }),
      });
      setPropertyType(initialData.type);
    }
  }, [mode, initialData, form]);

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      setIsSubmitting(true);
      setIsProcessingImages(true);
      const formData = new FormData();
      
      // Handle all non-image fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "images") {
          if (typeof value === "object" && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Handle images - separate new files from existing URLs
      if (Array.isArray(data.images)) {
        const newImages = data.images.filter((image): image is File => image instanceof File);
        const existingImages = data.images.filter((image): image is string => typeof image === "string");

        // Show processing state while handling images
        for (const image of newImages) {
          formData.append("images", image);
        }

        formData.append("existingImages", JSON.stringify(existingImages));
      }

      setIsProcessingImages(false);

      const url = mode === "edit"
        ? `${process.env.NEXT_PUBLIC_API_URL}/agent/listings/${propertyId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/agent/listings`;

      const response = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(mode === "edit" ? "Failed to update property" : "Failed to create property");
      }

      toast.success(mode === "edit" ? "Property updated successfully" : "Property created successfully");
      router.push("/agent/dashboard");
    } catch (error) {
      console.error("Error saving property:", error);
      toast.error(mode === "edit" ? "Failed to update property" : "Failed to create property");
    } finally {
      setIsSubmitting(false);
      setIsProcessingImages(false);
    }
  };

  const totalSteps = 3; // Updated to include preview step

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      const result = await form.trigger(["title", "description", "propertyType", "location"] as const);
      if (result) setStep(2);
    } else if (step === 2) {
      const baseFields = ["price", "bedrooms", "bathrooms", "amenities", "images"] as const;
      const investmentFields = ["investmentDetails.roi", "investmentDetails.initialPayment"] as const;
      const shortLetFields = ["shortLetDetails.minStay", "shortLetDetails.cleaningFee", "shortLetDetails.securityDeposit"] as const;
      
      const fieldsToValidate = [
        ...baseFields,
        ...(propertyType === "INVESTMENT" ? investmentFields : shortLetFields)
      ];
      
      const result = await form.trigger(fieldsToValidate);
      if (result) setStep(3);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "edit" ? "Edit Property" : "Add New Property"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "edit"
              ? "Update your property listing details"
              : "Create a new property listing for short-let or investment"}
          </p>
        </div>
      </div>

      <div className="relative">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center justify-center gap-2">
            {[...Array(totalSteps)].map((_, index) => (
              <li key={index} className="relative">
                <div
                  className={cn(
                    "h-2 w-16 rounded-full",
                    step > index + 1 ? "bg-primary" : "bg-muted"
                  )}
                />
              </li>
            ))}
          </ol>
        </nav>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Step {step} of {totalSteps}: {
            step === 1 ? "Basic Information" :
            step === 2 ? "Property Details" :
            "Preview"
          }
        </p>
      </div>

      <Tabs
        defaultValue="SHORT_LET"
        onValueChange={(value) => setPropertyType(value as "SHORT_LET" | "INVESTMENT")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="SHORT_LET">Short-Let Property</TabsTrigger>
          <TabsTrigger value="INVESTMENT">Investment Property</TabsTrigger>
        </TabsList>
      </Tabs>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter property title" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive title for your property
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="Describe your property..."
                          className="min-h-[150px]"
                          {...field}
                          maxLength={1000}
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                          {field.value.length}/1000
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Include key features, nearby attractions, and unique selling points
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROPERTY_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter property location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="amenities"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Amenities</FormLabel>
                      <FormDescription>
                        Select all the amenities available at your property
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {AMENITIES.map((amenity) => (
                        <FormField
                          key={amenity}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={amenity}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(amenity)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, amenity])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value: string) => value !== amenity
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {amenity}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="text"
                            placeholder="Enter price"
                            className="pl-6"
                            value={formatPriceInput(field.value.toString())}
                            onChange={(e) => {
                              field.onChange(parsePriceInput(e.target.value));
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Number of bedrooms"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Number of bathrooms"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {propertyType === "INVESTMENT" && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid gap-4">
                      <FormField
                        control={form.control}
                        name="investmentDetails.roi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected ROI (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter expected ROI"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="investmentDetails.initialPayment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Initial Payment (60%)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    $
                                  </span>
                                  <Input
                                    type="text"
                                    placeholder="Initial payment amount"
                                    className="pl-6"
                                    value={formatPriceInput(field.value || "0")}
                                    onChange={(e) => {
                                      field.onChange(parsePriceInput(e.target.value).toString());
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="investmentDetails.monthlyPayment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Payment</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    $
                                  </span>
                                  <Input
                                    type="text"
                                    placeholder="Monthly payment amount"
                                    className="pl-6"
                                    value={formatPriceInput(field.value || "0")}
                                    onChange={(e) => {
                                      field.onChange(parsePriceInput(e.target.value).toString());
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {propertyType === "SHORT_LET" && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid gap-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="shortLetDetails.minStay"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Stay (nights)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Minimum nights"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="shortLetDetails.maxStay"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Stay (nights)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Maximum nights"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="shortLetDetails.cleaningFee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cleaning Fee</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    $
                                  </span>
                                  <Input
                                    type="text"
                                    placeholder="Enter cleaning fee"
                                    className="pl-6"
                                    value={formatPriceInput(field.value || "0")}
                                    onChange={(e) => {
                                      field.onChange(parsePriceInput(e.target.value).toString());
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="shortLetDetails.securityDeposit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Security Deposit</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    $
                                  </span>
                                  <Input
                                    type="text"
                                    placeholder="Enter security deposit"
                                    className="pl-6"
                                    value={formatPriceInput(field.value || "0")}
                                    onChange={(e) => {
                                      field.onChange(parsePriceInput(e.target.value).toString());
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Images</FormLabel>
                    <FormControl>
                      <ImageUpload
                        onChange={field.onChange}
                        value={field.value}
                        maxFiles={10}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload at least 3 high-quality images of your property
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <PropertyPreview data={form.getValues()} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  Please review your property listing details carefully before submitting.
                  You can go back to make changes if needed.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
            >
              Back
            </Button>
            {step < totalSteps ? (
              <Button type="button" onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isProcessingImages ? "Processing Images..." : "Submitting..."}
                      </>
                    ) : (
                      mode === "edit" ? "Update Listing" : "Create Listing"
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {mode === "edit" ? "Update Property Listing?" : "Create Property Listing?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will {mode === "edit" ? "update" : "create"} your property listing with the provided details.
                      Make sure all information is correct before proceeding.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => form.handleSubmit(onSubmit)()}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {mode === "edit" ? "Update" : "Create"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
} 