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
    this.clientId = 'AQtqwl189MSBEbnUWNGIfPsAl3ynUUUKr506gJa5SDXhnXzje33FVtEJaTjcqRXE9FCnUPWu3kaVlfEO';
    this.clientSecret = 'EEXA7Fu-fqLpaUFcVH2vIbkZijgccjRLiRHD9S0U-gNJ_jwP-zQPODmUyw9RiWCcE4p0tVRxo0A-guLR';
    this.baseUrl = 'https://api-m.sandbox.paypal.com'; // sandbox URL
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
        console.error('PayPal token error:', errorData);
        throw new HttpException(
          'PayPal authentication failed',
          HttpStatus.UNAUTHORIZED
        );
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('PayPal token error:', error);
      throw new HttpException(
        'Failed to authenticate with PayPal',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createOrder(amount: number, currency: string = 'RUB', userId: string, itemId: string, itemType: 'set' | 'course' | 'mixed' = 'set') {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'PayPal-Request-Id': `${userId}-${Date.now()}`, // უნიკალური request ID
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          application_context: {
            shipping_preference: 'NO_SHIPPING'
          },
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: amount.toString(),
              },
              custom_id: `${userId}:${itemId}:${itemType}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('PayPal create order error:', errorData);
        throw new HttpException(
          'Failed to create PayPal order',
          HttpStatus.BAD_REQUEST
        );
      }

      return response.json();
    } catch (error) {
      console.error('Create order error:', error);
      throw new HttpException(
        'Failed to create order',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async capturePayment(orderId: string) {
    try {
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
        console.error('PayPal capture payment error:', errorData);
        throw new HttpException(
          'Failed to capture payment',
          HttpStatus.BAD_REQUEST
        );
      }

      const paymentData = await response.json();
      console.log('PayPal payment data:', JSON.stringify(paymentData, null, 2));
      
      if (paymentData.status === 'COMPLETED') {
        // Try to get custom_id from different locations in PayPal response
        let customId = paymentData.purchase_units?.[0]?.custom_id;
        
        // If not found in purchase_units, try captures
        if (!customId) {
          customId = paymentData.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id;
        }
        
        console.log('Custom ID:', customId);
        
        if (!customId) {
          console.error('No custom_id found in payment data');
          throw new HttpException(
            'Payment data missing custom_id',
            HttpStatus.BAD_REQUEST
          );
        }
        
        const parts = customId.split(':');
        const userId = parts[0];
        const itemIds = parts[1];
        const itemType = parts[2] || 'set'; // default to 'set' for backward compatibility
        
        // Handle multiple itemIds (comma-separated)
        const itemIdArray = itemIds.split(',');
        
        // Get amount from captures (where it actually is in the response)
        const totalAmount = parseFloat(
          paymentData.purchase_units[0].payments.captures[0].amount.value
        );
        const currency = paymentData.purchase_units[0].payments.captures[0].amount.currency_code;
        const amountPerItem = totalAmount / itemIdArray.length;
        
        // Create purchase record for each itemId
        for (const itemId of itemIdArray) {
          const purchaseData: any = {
            userId,
            paymentId: paymentData.id,
            amount: amountPerItem,
            currency: currency,
            itemType: itemType === 'mixed' ? 'set' : itemType, // mixed-ის შემთხვევაში default set-ზე
          };

          if (itemType === 'set' || itemType === 'mixed') {
            purchaseData.setId = itemId.trim();
          } else if (itemType === 'course') {
            purchaseData.courseId = itemId.trim();
          }

          await this.purchaseService.createPurchase(purchaseData);
        }
      }

      return paymentData;
    } catch (error) {
      console.error('Capture payment error:', error);
      throw new HttpException(
        'Failed to process payment',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 