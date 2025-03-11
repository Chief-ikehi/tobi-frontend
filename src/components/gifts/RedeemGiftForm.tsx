"use client";
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
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
import { REDEEM_GIFT } from '@/lib/graphql/gifts';

const formSchema = z.object({
  redemptionCode: z.string().min(1, 'Please enter a redemption code'),
});

export function RedeemGiftForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [redeemGift] = useMutation(REDEEM_GIFT, {
    onCompleted: (data) => {
      toast.success('Gift redeemed successfully', {
        description: 'You can now view your booking details.',
      });
      router.push(`/gifts/${data.redeemGift.id}`);
    },
    onError: (error) => {
      toast.error('Error redeeming gift', {
        description: error.message,
      });
      setIsSubmitting(false);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      redemptionCode: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    await redeemGift({
      variables: {
        input: values,
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="redemptionCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Redemption Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your gift redemption code"
                  {...field}
                  className="uppercase"
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Redeeming...' : 'Redeem Gift'}
        </Button>
      </form>
    </Form>
  );
} 