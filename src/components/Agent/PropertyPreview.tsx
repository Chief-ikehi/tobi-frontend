import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { formatPrice } from "@/lib/utils";
import { Building2, MapPin, Bed, Bath, Calendar } from "lucide-react";

interface PropertyPreviewProps {
  data: {
    type: "SHORT_LET" | "INVESTMENT";
    title: string;
    description: string;
    location: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    propertyType: string;
    amenities: string[];
    images: (string | File)[];
    investmentDetails?: {
      roi?: string;
      installmentAvailable?: boolean;
      initialPayment?: string;
      monthlyPayment?: string;
      duration?: string;
    };
    shortLetDetails?: {
      minStay?: string;
      maxStay?: string;
      availableFrom?: string;
      availableTo?: string;
      cleaningFee?: string;
      securityDeposit?: string;
    };
  };
}

export function PropertyPreview({ data }: PropertyPreviewProps) {
  // Convert File objects to URLs for preview
  const imageUrls = data.images.map((image) => 
    typeof image === "string" ? image : URL.createObjectURL(image)
  );

  return (
    <div className="space-y-6">
      <div className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {imageUrls.map((url, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                  <Image
                    src={url}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{data.title}</h1>
            <Badge variant={data.type === "SHORT_LET" ? "default" : "secondary"}>
              {data.type === "SHORT_LET" ? "Short Let" : "Investment"}
            </Badge>
          </div>
          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{data.location}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>{data.propertyType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4" />
            <span>{data.bedrooms} Bedrooms</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-4 w-4" />
            <span>{data.bathrooms} Bathrooms</span>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {formatPrice(data.price)}
              {data.type === "SHORT_LET" && <span className="text-sm font-normal">/night</span>}
            </div>
            {data.type === "INVESTMENT" && data.investmentDetails && (
              <div className="mt-2 space-y-2 text-sm">
                <div>ROI: {data.investmentDetails.roi}%</div>
                <div>Initial Payment: {formatPrice(Number(data.investmentDetails.initialPayment))}</div>
                <div>Monthly Payment: {formatPrice(Number(data.investmentDetails.monthlyPayment))}</div>
              </div>
            )}
            {data.type === "SHORT_LET" && data.shortLetDetails && (
              <div className="mt-2 space-y-2 text-sm">
                <div>Min Stay: {data.shortLetDetails.minStay} nights</div>
                <div>Cleaning Fee: {formatPrice(Number(data.shortLetDetails.cleaningFee))}</div>
                <div>Security Deposit: {formatPrice(Number(data.shortLetDetails.securityDeposit))}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{data.description}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Amenities</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.amenities.map((amenity) => (
              <Badge key={amenity} variant="outline">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 