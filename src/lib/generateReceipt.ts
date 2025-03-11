import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

interface ReceiptData {
  booking: {
    id: string;
    checkInDate: Date;
    checkOutDate: Date;
    totalPrice: number;
    transactionRef: string;
    createdAt: Date;
    property: {
      title: string;
      price: number;
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

export function generateReceiptHTML({ booking, user }: ReceiptData) {
  const nights = Math.ceil(
    (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Booking Receipt - ${booking.property.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
        }
        .receipt {
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #ddd;
          padding: 30px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .details {
          margin-bottom: 30px;
        }
        .row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .total {
          font-size: 1.2em;
          font-weight: bold;
          border-top: 2px solid #333;
          padding-top: 20px;
          margin-top: 20px;
        }
        @media print {
          body {
            padding: 0;
          }
          .receipt {
            border: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h1>TOBI Properties</h1>
          <h2>Booking Receipt</h2>
          <p>Receipt #: ${booking.id}</p>
          <p>Transaction Ref: ${booking.transactionRef}</p>
          <p>Date: ${format(new Date(booking.createdAt), 'PPP')}</p>
        </div>

        <div class="details">
          <h3>Property Details</h3>
          <p>
            ${booking.property.title}<br/>
            ${booking.property.address}<br/>
            ${booking.property.city}, ${booking.property.state}
          </p>

          <h3>Guest Information</h3>
          <p>
            ${user.name}<br/>
            ${user.email}
          </p>

          <h3>Booking Details</h3>
          <p>
            Check-in: ${format(new Date(booking.checkInDate), 'PPP')}<br/>
            Check-out: ${format(new Date(booking.checkOutDate), 'PPP')}<br/>
            Duration: ${nights} night${nights > 1 ? 's' : ''}
          </p>

          <h3>Payment Summary</h3>
          <div class="row">
            <span>Price per night:</span>
            <span>${formatCurrency(booking.property.price)}</span>
          </div>
          <div class="row">
            <span>Number of nights:</span>
            <span>${nights}</span>
          </div>
          <div class="row total">
            <span>Total Amount:</span>
            <span>${formatCurrency(booking.totalPrice)}</span>
          </div>
        </div>

        <div style="text-align: center; margin-top: 40px; color: #666;">
          <p>Thank you for choosing TOBI Properties!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function downloadReceipt(receiptData: ReceiptData) {
  const html = generateReceiptHTML(receiptData);
  
  // Create a Blob from the HTML
  const blob = new Blob([html], { type: 'text/html' });
  
  // Create a download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `receipt-${receiptData.booking.id}.html`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
} 