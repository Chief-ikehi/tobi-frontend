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

const withdrawFormSchema = z.object({
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Amount must be greater than 0"),
  bankAccount: z.string({
    required_error: "Please select a bank account",
  }),
});

type WithdrawFormValues = z.infer<typeof withdrawFormSchema>;

// Mock data for bank accounts
const mockBankAccounts = [
  { id: "1", name: "Main Account - **** 1234" },
  { id: "2", name: "Savings - **** 5678" },
];

export function WithdrawDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      amount: "",
      bankAccount: "",
    },
  });

  async function onSubmit(data: WithdrawFormValues) {
    try {
      setIsLoading(true);
      // TODO: Implement withdrawal functionality
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Withdrawal request submitted successfully");
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to submit withdrawal request");
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
        <Button variant="outline">Withdraw</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Money</DialogTitle>
          <DialogDescription>
            Withdraw funds to your linked bank account. The process typically takes 1-3 business days.
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
              name="bankAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bank account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockBankAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
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
                  "Withdraw"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 