import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

@Injectable()
export class PaymentService {
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService) {
    this.clientId = 'AauAG9HWxx25fS0hccd_kZS5vQNfPA5hlQKolkRDLa1rDRklWnN3NasH0DWsMaM1pud7fwly032dGBDV';
    this.clientSecret = 'EMENkxWSrhhEmah_ymaxjBvbRwdnlgsN1Xf5oUpYiEoNH-JEjPbcrVEnOjNnVeiIMIZoLoD0MXJaNhBM';
    this.baseUrl = 'https://api-m.sandbox.paypal.com'; // sandbox გარემოსთვის
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();
    return data.access_token;
  }

  async createOrder(amount: number, currency: string = 'RUB') {
    const accessToken = await this.getAccessToken();
    
    const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toString(),
            },
          },
        ],
      }),
    });

    return response.json();
  }

  async capturePayment(orderId: string) {
    const accessToken = await this.getAccessToken();
    
    const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.json();
  }
} 