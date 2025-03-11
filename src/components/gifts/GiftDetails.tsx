import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Gift } from '@/types/gift';

interface GiftDetailsProps {
  gift: Gift;
}

export function GiftDetails({ gift }: GiftDetailsProps) {
  const statusColors = {
    PENDING: 'bg-yellow-500',
    REDEEMED: 'bg-green-500',
    EXPIRED: 'bg-red-500',
    CANCELLED: 'bg-gray-500',
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image
            src={gift.property.images[0]}
            alt={gift.property.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="grid gap-4 grid-cols-2">
          {gift.property.images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={`${gift.property.title} - Image ${index + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{gift.property.title}</h1>
            <Badge
              className={statusColors[gift.status as keyof typeof statusColors]}
            >
              {gift.status}
            </Badge>
          </div>
          <p className="text-gray-600">
            {gift.property.address}, {gift.property.city}, {gift.property.state}
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Gift Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <p className="text-gray-600">From:</p>
                <p>{gift.sender.fullName}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">To:</p>
                <p>{gift.recipientEmail}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Check-in:</p>
                <p>{format(new Date(gift.startDate), 'MMM d, yyyy')}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Check-out:</p>
                <p>{format(new Date(gift.endDate), 'MMM d, yyyy')}</p>
              </div>
              {gift.redemptionCode && (
                <div className="flex justify-between">
                  <p className="text-gray-600">Redemption Code:</p>
                  <p className="font-mono">{gift.redemptionCode}</p>
                </div>
              )}
            </div>
          </div>

          {gift.message && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Message</h2>
              <p className="text-gray-600 italic">{gift.message}</p>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-2">Property Amenities</h2>
            <div className="grid grid-cols-2 gap-2">
              {gift.property.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                >
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Property Description</h2>
          <p className="text-gray-600 whitespace-pre-line">
            {gift.property.description}
          </p>
        </Card>
      </div>
    </div>
  );
} 