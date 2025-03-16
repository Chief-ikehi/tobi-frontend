"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const addMoneyFormSchema = z.object({
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Amount must be greater than 0"),
  paymentMethod: z.string({
    required_error: "Please select a payment method",
  }),
});

type AddMoneyFormValues = z.infer<typeof addMoneyFormSchema>;

export interface AddMoneyDialogProps {
  paymentMethods: Array<{
    id: string;
    type: string;
    last4: string;
    brand?: string;
    bankName?: string;
    accountNumber?: string;
  }>;
}

export function AddMoneyDialog({ paymentMethods }: AddMoneyDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddMoneyFormValues>({
    resolver: zodResolver(addMoneyFormSchema),
    defaultValues: {
      amount: "",
      paymentMethod: "",
    },
  });

  async function onSubmit(data: AddMoneyFormValues) {
    try {
      setIsLoading(true);
      // TODO: Implement add money functionality
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Money added successfully");
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to add money");
    } finally {
      setIsLoading(false);
    }
  }

  const formatAmount = (value: string) => {
    const onlyNums = value.replace(/[^\d.]/g, "");
    const decimalCount = (onlyNums.match(/\./g) || []).length;
    if (decimalCount > 1) return value;
    
    const parts = onlyNums.split(".");
    if (parts[1]?.length > 2) {
      parts[1] = parts[1].slice(0, 2);
    }
    return parts.join(".");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Money</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Money</DialogTitle>
          <DialogDescription>
            Add money to your wallet using your saved payment methods.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        placeholder="0.00"
                        className="pl-7"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatAmount(e.target.value);
                          field.onChange(formatted);
                          e.target.value = formatted;
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
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.type === "card"
                            ? `${method.brand} ending in ${method.last4}`
                            : `${method.bankName} - ${method.accountNumber}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Add Money"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 