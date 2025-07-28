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
    this.clientId = 'AdGUXBKzSaUCAZ_j7UO8YOYCbWRQCIcBl9o0pC6GJ7PQmT6uMucRdWCGegdB65JJbGewVP97-iU7EiAl';
    this.clientSecret = 'ELMXhk_ovajHdeUxaFcNSYtPZyWxyvxCZ7vbVuBZXAFh0Wa3CSw5Zof3wvjFNATZJCQFp8QiaCpZP9lm';
    this.baseUrl = 'https://api-m.paypal.com'; // live URL
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

  async createOrder(amount: number, currency: string = 'RUB', userId: string, setId: string) {
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
          purchase_units: [
            {
              amount: {
                currency_code: currency,
                value: amount.toString(),
              },
              custom_id: `${userId}:${setId}`,
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
      
      if (paymentData.status === 'COMPLETED') {
        const customId = paymentData.purchase_units[0].custom_id;
        const [userId, setId] = customId.split(':');
        
        await this.purchaseService.createPurchase({
          userId,
          setId,
          paymentId: paymentData.id,
          amount: parseFloat(paymentData.purchase_units[0].amount.value),
          currency: paymentData.purchase_units[0].amount.currency_code,
        });
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