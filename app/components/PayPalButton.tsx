'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { apiRequest, API_CONFIG } from '../config/api';
import { useEffect } from 'react';

export interface PaymentResponse {
  id: string;
  status: string;
  payer: {
    email_address: string;
    payer_id: string;
  };
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
  }>;
}

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  onSuccess: (details: PaymentResponse) => void;
  onError: (error: Error) => void;
}

export default function PayPalButton({ amount, currency = 'RUB', onSuccess, onError }: PayPalButtonProps) {
  const [{ isResolved, isPending }] = usePayPalScriptReducer();

  useEffect(() => {
  }, [isResolved, isPending, amount, currency]);

  const createOrder = async () => {
    try {
      const response = await apiRequest<PaymentResponse>(API_CONFIG.PAYMENTS.CREATE_ORDER, {
        method: 'POST',
        body: JSON.stringify({ amount, currency })
      });
      return response.id;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      onError(error instanceof Error ? error : new Error('Failed to create order'));
      throw error;
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      const response = await apiRequest<PaymentResponse>(API_CONFIG.PAYMENTS.CAPTURE_PAYMENT, {
        method: 'POST',
        body: JSON.stringify({ orderId: data.orderID })
      });
      
      onSuccess(response);
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      onError(error instanceof Error ? error : new Error('Failed to capture payment'));
    }
  };

  if (!isResolved) {
    return <div className="text-center p-4">Loading PayPal...</div>;
  }

  if (isPending) {
    return <div className="text-center p-4">PayPal is initializing...</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-center text-gray-700">
        Total: {amount} {currency}
      </div>
      <PayPalButtons
        style={{ 
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "pay"
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          console.error('PayPal button error:', err);
          onError(err instanceof Error ? err : new Error('PayPal button error'));
        }}
      />
    </div>
  );
} 