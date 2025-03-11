import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CREATE_INVESTMENT } from '@/lib/graphql/investments';
import { formatCurrency } from '@/lib/utils';

const formSchema = z.object({
  amount: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Amount must be a positive number'
  ),
});

interface InvestDialogProps {
  property: {
    id: string;
    title: string;
    minInvestment: number;
    maxInvestment: number;
    remainingInvestmentCapacity: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvestDialog({ property, open, onOpenChange }: InvestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createInvestment] = useMutation(CREATE_INVESTMENT);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: property.minInvestment.toString(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const amount = Number(values.amount);

    if (amount < property.minInvestment) {
      form.setError('amount', {
        message: `Minimum investment amount is ${formatCurrency(property.minInvestment)}`,
      });
      return;
    }

    if (amount > property.maxInvestment) {
      form.setError('amount', {
        message: `Maximum investment amount is ${formatCurrency(property.maxInvestment)}`,
      });
      return;
    }

    if (amount > property.remainingInvestmentCapacity) {
      form.setError('amount', {
        message: `Only ${formatCurrency(property.remainingInvestmentCapacity)} remaining for investment`,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createInvestment({
        variables: {
          input: {
            propertyId: property.id,
            amount,
          },
        },
      });

      toast.success('Investment created successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create investment');
      console.error('Investment error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invest in {property.title}</DialogTitle>
          <DialogDescription>
            Enter the amount you would like to invest. The minimum investment is{' '}
            {formatCurrency(property.minInvestment)} and the maximum is{' '}
            {formatCurrency(property.maxInvestment)}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min={property.minInvestment}
                      max={Math.min(property.maxInvestment, property.remainingInvestmentCapacity)}
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Investment...' : 'Invest Now'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 