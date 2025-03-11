import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GiftForm } from './GiftForm';
import { Gift } from '@/icons/Gift';

interface GiftButtonProps {
  propertyId: string;
  propertyTitle: string;
}

export function GiftButton({ propertyId, propertyTitle }: GiftButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full flex items-center gap-2"
      >
        <Gift className="w-4 h-4" />
        Gift this property
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Gift this property</DialogTitle>
          </DialogHeader>
          <GiftForm
            propertyId={propertyId}
            propertyTitle={propertyTitle}
            onSuccess={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 