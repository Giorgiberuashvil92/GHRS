'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { apiRequest, API_CONFIG } from '../config/api';
import { useAuth } from '../context/AuthContext';

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
  setId: string;
  onSuccess: (details: PaymentResponse) => void;
  onError: (error: Error) => void;
}

export default function PayPalButton({ amount, currency = 'RUB', setId, onSuccess, onError }: PayPalButtonProps) {
  const { user } = useAuth();

  const createOrder = async () => {
    try {
      if (!user) {
        throw new Error('მომხმარებელი არ არის ავტორიზებული');
      }

      const response = await apiRequest<PaymentResponse>(API_CONFIG.ENDPOINTS.PAYMENTS.CREATE_ORDER, {
        method: 'POST',
        body: JSON.stringify({ 
          amount, 
          currency,
          userId: user.id,
          setId
        })
      });

      console.log('PayPal order created:', response);
      
      if (!response.id) {
        throw new Error('PayPal order ID is missing');
      }

      return response.id;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      onError(error instanceof Error ? error : new Error('Failed to create order'));
      throw error;
    }
  };

  const handleApprove = async (data: any) => {
    try {
      console.log('PayPal payment approved:', data);
      
      const response = await apiRequest<PaymentResponse>(API_CONFIG.ENDPOINTS.PAYMENTS.CAPTURE_PAYMENT, {
        method: 'POST',
        body: JSON.stringify({ orderId: data.orderID })
      });
      
      console.log('PayPal payment captured:', response);
      
      onSuccess(response);
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      onError(error instanceof Error ? error : new Error('Failed to capture payment'));
    }
  };

  const handleCancel = () => {
    console.log('PayPal payment cancelled');
  };

  const handleError = (error: unknown) => {
    console.error('PayPal error:', error);
    onError(new Error('PayPal payment failed'));
  };

  if (!user) {
    return <div className="text-center text-red-500 p-4">გთხოვთ გაიაროთ ავტორიზაცია</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-center text-gray-700">
        ჯამი: {amount} {currency}
      </div>
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal"
        }}
        createOrder={createOrder}
        onApprove={handleApprove}
        onCancel={handleCancel}
        onError={handleError}
      />
    </div>
  );
} 