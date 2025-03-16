"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/utils/format";
import { InvestmentProperty } from "@/types/property";

interface InvestmentPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: InvestmentProperty;
  purchaseType: "outright" | "installment";
}

const InvestmentPurchaseModal = ({
  isOpen,
  onClose,
  property,
  purchaseType,
}: InvestmentPurchaseModalProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const price = purchaseType === "outright" 
    ? property.outrighPrice 
    : property.installmentPrice;

  const downPayment = purchaseType === "installment" 
    ? property.installmentPrice * 0.6 
    : price;

  const handlePurchase = async () => {
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/investments/purchase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyId: property.id,
            purchaseType,
            amount: downPayment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to initiate purchase");
      }

      const data = await response.json();

      // Redirect to payment page
      router.push(data.paymentUrl);
    } catch (error) {
      console.error("Error initiating purchase:", error);
      toast.error("Failed to initiate purchase. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm Purchase</DialogTitle>
          <DialogDescription>
            Please review the details of your {purchaseType} purchase
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Property Summary */}
          <div>
            <h3 className="mb-2 font-semibold text-black dark:text-white">
              {property.title}
            </h3>
            <p className="text-sm text-body-color">{property.location}</p>
          </div>

          {/* Purchase Details */}
          <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-sm text-body-color">Purchase Type</span>
              <span className="font-medium text-black dark:text-white">
                {purchaseType.charAt(0).toUpperCase() + purchaseType.slice(1)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-body-color">Total Price</span>
              <span className="font-medium text-black dark:text-white">
                {formatCurrency(price)}
              </span>
            </div>
            {purchaseType === "installment" && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-body-color">Down Payment (60%)</span>
                  <span className="font-medium text-black dark:text-white">
                    {formatCurrency(downPayment)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-body-color">Monthly Payment</span>
                  <span className="font-medium text-black dark:text-white">
                    {formatCurrency((price - downPayment) / 24)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Membership Benefits */}
          <div>
            <h4 className="mb-2 font-medium text-black dark:text-white">
              Included Benefits
            </h4>
            <ul className="space-y-2 text-sm text-body-color">
              {purchaseType === "outright" ? (
                <>
                  <li>• Immediate full ownership</li>
                  <li>• Platinum membership included</li>
                  <li>• Optional T.O.B.I management</li>
                </>
              ) : (
                <>
                  <li>• Gold membership included</li>
                  <li>• T.O.B.I manages as short-let</li>
                  <li>• ₦5M credit for short-let stays</li>
                </>
              )}
            </ul>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm leading-none text-body-color peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms and conditions of this purchase, including the
              {purchaseType === "installment"
                ? " payment schedule and property management agreement"
                : " property ownership transfer agreement"}
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              onClick={handlePurchase}
              disabled={!termsAccepted || loading}
            >
              {loading ? "Processing..." : `Pay ${formatCurrency(downPayment)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentPurchaseModal; 