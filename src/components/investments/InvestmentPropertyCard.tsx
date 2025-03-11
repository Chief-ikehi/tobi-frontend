import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { InvestDialog } from './InvestDialog';

interface InvestmentPropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    images: string[];
    price: number;
    minInvestment: number;
    maxInvestment: number;
    expectedRoi: number;
    totalInvestment: number;
    remainingInvestmentCapacity: number;
    isFullyFunded: boolean;
    investmentDuration: number;
  };
}

export function InvestmentPropertyCard({ property }: InvestmentPropertyCardProps) {
  const [showInvestDialog, setShowInvestDialog] = useState(false);
  const fundingProgress = (property.totalInvestment / property.price) * 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={property.images[0] || '/placeholder.jpg'}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <Link href={`/properties/${property.id}`} className="hover:underline">
          <h3 className="text-xl font-semibold">{property.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {property.description}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Investment Progress</span>
            <span>{Math.round(fundingProgress)}%</span>
          </div>
          <Progress value={fundingProgress} className="h-2" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Min Investment</p>
            <p className="font-medium">{formatCurrency(property.minInvestment)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Expected ROI</p>
            <p className="font-medium">{property.expectedRoi}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Duration</p>
            <p className="font-medium">{property.investmentDuration} months</p>
          </div>
          <div>
            <p className="text-muted-foreground">Remaining</p>
            <p className="font-medium">{formatCurrency(property.remainingInvestmentCapacity)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={property.isFullyFunded}
          onClick={() => setShowInvestDialog(true)}
        >
          {property.isFullyFunded ? 'Fully Funded' : 'Invest Now'}
        </Button>
      </CardFooter>

      <InvestDialog
        property={property}
        open={showInvestDialog}
        onOpenChange={setShowInvestDialog}
      />
    </Card>
  );
} 