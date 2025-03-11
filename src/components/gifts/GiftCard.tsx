import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift } from '@/types/gift';

interface GiftCardProps {
  gift: Gift;
  type: 'sent' | 'received';
}

export function GiftCard({ gift, type }: GiftCardProps) {
  const statusColors = {
    PENDING: 'bg-yellow-500',
    REDEEMED: 'bg-green-500',
    EXPIRED: 'bg-red-500',
    CANCELLED: 'bg-gray-500',
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={gift.property.images[0]}
          alt={gift.property.title}
          fill
          className="object-cover"
        />
        <Badge
          className={`absolute top-2 right-2 ${
            statusColors[gift.status as keyof typeof statusColors]
          }`}
        >
          {gift.status}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">{gift.property.title}</h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          {type === 'sent' ? (
            <p>To: {gift.recipientEmail}</p>
          ) : (
            <p>From: {gift.sender.fullName}</p>
          )}

          <div className="flex justify-between">
            <p>Check-in:</p>
            <p>{format(new Date(gift.startDate), 'MMM d, yyyy')}</p>
          </div>

          <div className="flex justify-between">
            <p>Check-out:</p>
            <p>{format(new Date(gift.endDate), 'MMM d, yyyy')}</p>
          </div>

          {gift.message && (
            <div className="mt-4">
              <p className="font-medium">Message:</p>
              <p className="italic">{gift.message}</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/gifts/${gift.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 