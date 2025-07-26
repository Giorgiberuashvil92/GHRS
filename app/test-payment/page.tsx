'use client';

import { useState } from 'react';
import PayPalButton from '../components/PayPalButton';

export default function TestPayment() {
  const [paymentStatus, setPaymentStatus] = useState<string>('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">PayPal გადახდის ტესტი</h1>
      
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <PayPalButton
          amount={10} // ტესტისთვის მცირე თანხა
          currency="RUB"
          onSuccess={(details) => {
            console.log('Payment completed:', details);
            setPaymentStatus(`გადახდა წარმატებით დასრულდა! ID: ${details.id}`);
          }}
          onError={(error) => {
            console.error('Payment error:', error);
            setPaymentStatus(`შეცდომა გადახდისას: ${error.message}`);
          }}
        />

        {paymentStatus && (
          <div className={`mt-4 p-4 rounded ${
            paymentStatus.includes('წარმატებით') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {paymentStatus}
          </div>
        )}
      </div>
    </div>
  )
} 