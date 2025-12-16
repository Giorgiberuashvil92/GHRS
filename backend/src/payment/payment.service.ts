import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import { PurchaseService } from '../purchase/purchase.service';

@Injectable()
export class PaymentService {
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    private configService: ConfigService,
    private purchaseService: PurchaseService,
  ) {
    this.clientId =  'AQtqwl189MSBEbnUWNGIfPsAl3ynUUUKr506gJa5SDXhnXzje33FVtEJaTjcqRXE9FCnUPWu3kaVlfEO0';
    this.clientSecret = 'EEXA7Fu-fqLpaUFcVH2vIbkZijgccjRLiRHD9S0U-gNJ_jwP-zQPODmUyw9RiWCcE4p0tVRxo0A-guLR';
    this.baseUrl = 'https://api-m.sandbox.paypal.com';
    
    if (!this.clientId || !this.clientSecret) {
      throw new Error('PayPal credentials are not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env file');
    }
  }

  private async getAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ PayPal token error:', errorData);
        throw new HttpException(
          'PayPal authentication failed',
          HttpStatus.UNAUTHORIZED
        );
      }

      const data = await response.json();
      console.log('✅ PayPal access token obtained');
      return data.access_token;
    } catch (error) {
      console.error('❌ PayPal token error:', error);
      throw new HttpException(
        'Failed to authenticate with PayPal',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createOrder(amount: number, currency: string = 'USD', userId: string, itemId: string, itemType: 'set' | 'course' | 'mixed' = 'set') {
    console.log('🔵 createOrder called with:', {
      amount,
      amountType: typeof amount,
      currency,
      currencyType: typeof currency,
      userId,
      itemId,
      itemType,
    });

    try {
      // ✅ Convert amount to number if it's a string
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      
      if (isNaN(numAmount) || numAmount <= 0) {
        console.error('❌ Invalid amount:', amount);
        throw new HttpException(
          `Invalid amount value: ${amount}`,
          HttpStatus.BAD_REQUEST
        );
      }

      // ✅ Validate currency
      const allowedCurrencies = ['USD', 'EUR', 'GBP', 'GEL'];
      const upperCurrency = currency.toUpperCase();
      
      if (!allowedCurrencies.includes(upperCurrency)) {
        console.error('❌ Unsupported currency:', currency);
        throw new HttpException(
          `Currency ${currency} is not supported. Please use: ${allowedCurrencies.join(', ')}`,
          HttpStatus.BAD_REQUEST
        );
      }

      console.log('🔑 Getting PayPal access token...');
      const accessToken = await this.getAccessToken();
      
      const orderPayload = {
        intent: 'CAPTURE',
        application_context: {
          shipping_preference: 'NO_SHIPPING'
        },
        purchase_units: [
          {
            amount: {
              currency_code: upperCurrency,
              value: numAmount.toFixed(2),
            },
            custom_id: `${userId}:${itemId}:${itemType}`,
          },
        ],
      };

      console.log('📤 Sending order to PayPal:', JSON.stringify(orderPayload, null, 2));

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'PayPal-Request-Id': `${userId}-${Date.now()}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('❌ PayPal create order error:', JSON.stringify(responseData, null, 2));
        throw new HttpException(
          `Failed to create PayPal order: ${JSON.stringify(responseData)}`,
          HttpStatus.BAD_REQUEST
        );
      }

      console.log('✅ PayPal order created successfully:', responseData.id);
      return responseData;
    } catch (error) {
      console.error('❌ Create order error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to create order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async capturePayment(orderId: string) {
    try {
      console.log('💰 Capturing payment for order:', orderId);
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ PayPal capture payment error:', errorData);
        throw new HttpException(
          'Failed to capture payment',
          HttpStatus.BAD_REQUEST
        );
      }

      const paymentData = await response.json();
      console.log('✅ PayPal payment data:', JSON.stringify(paymentData, null, 2));
      
      if (paymentData.status === 'COMPLETED') {
        let customId = paymentData.purchase_units?.[0]?.custom_id;
        
        if (!customId) {
          customId = paymentData.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id;
        }
        
        console.log('Custom ID:', customId);
        
        if (!customId) {
          console.error('❌ No custom_id found in payment data');
          throw new HttpException(
            'Payment data missing custom_id',
            HttpStatus.BAD_REQUEST
          );
        }
        
        const parts = customId.split(':');
        const userId = parts[0];
        const itemIds = parts[1];
        const itemType = parts[2] || 'set';
        
        const itemIdArray = itemIds.split(',');
        
        const totalAmount = parseFloat(
          paymentData.purchase_units[0].payments.captures[0].amount.value
        );
        const currency = paymentData.purchase_units[0].payments.captures[0].amount.currency_code;
        const amountPerItem = totalAmount / itemIdArray.length;
        
        for (const itemId of itemIdArray) {
          const purchaseData: any = {
            userId,
            paymentId: paymentData.id,
            amount: amountPerItem,
            currency: currency,
            itemType: itemType === 'mixed' ? 'set' : itemType,
          };

          if (itemType === 'set' || itemType === 'mixed') {
            purchaseData.setId = itemId.trim();
          } else if (itemType === 'course') {
            purchaseData.courseId = itemId.trim();
          }

          await this.purchaseService.createPurchase(purchaseData);
          console.log('✅ Purchase record created for item:', itemId);
        }
      }

      return paymentData;
    } catch (error) {
      console.error('❌ Capture payment error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to process payment',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}