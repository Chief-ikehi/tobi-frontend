import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

interface BookingEmailProps {
  booking: {
    id: string;
    checkInDate: Date;
    checkOutDate: Date;
    totalPrice: number;
    specialRequests?: string;
    property: {
      title: string;
      address: string;
      city: string;
      state: string;
    };
  };
  user: {
    name: string;
    email: string;
  };
}

export function generateBookingConfirmationEmail({ booking, user }: BookingEmailProps) {
  return {
    to: user.email,
    subject: `Booking Confirmation - ${booking.property.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">Booking Confirmed!</h1>
        
        <p>Dear ${user.name},</p>
        
        <p>Your booking has been confirmed. Here are the details:</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">${booking.property.title}</h2>
          <p style="margin: 5px 0;">
            ${booking.property.address}<br/>
            ${booking.property.city}, ${booking.property.state}
          </p>
          
          <div style="margin: 20px 0; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; padding: 15px 0;">
            <p style="margin: 5px 0;"><strong>Check-in:</strong> ${format(new Date(booking.checkInDate), 'PPP')}</p>
            <p style="margin: 5px 0;"><strong>Check-out:</strong> ${format(new Date(booking.checkOutDate), 'PPP')}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> ${formatCurrency(booking.totalPrice)}</p>
          </div>
          
          ${booking.specialRequests ? `
            <div style="margin-top: 20px;">
              <h3 style="margin: 0;">Special Requests:</h3>
              <p style="margin: 5px 0;">${booking.specialRequests}</p>
            </div>
          ` : ''}
        </div>
        
        <p>
          You can view your booking details and download your receipt at any time by visiting:
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}" style="color: #0066cc;">
            View Booking Details
          </a>
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px;">
            If you have any questions about your booking, please don't hesitate to contact us.
          </p>
        </div>
      </div>
    `,
  };
} 