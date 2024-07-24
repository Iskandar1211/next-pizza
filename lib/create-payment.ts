import axios from 'axios';

export interface PaymentData {
  id: string;
  status: string;
  amount: Amount;
  description: string;
  recipient: Recipient;
  created_at: string;
  confirmation: Confirmation;
  test: boolean;
  paid: boolean;
  refundable: boolean;
  metadata: Metadata;
}

export interface Amount {
  value: string;
  currency: string;
}

export interface Recipient {
  account_id: string;
  gateway_id: string;
}

export interface Confirmation {
  type: string;
  confirmation_url: string;
}

export interface Metadata {
  order_id: string;
}

export async function createPayment(details: {
  description: string;
  orderId: number;
  amount: number;
}) {
  if (!process.env.YOOKASSA_API_KEY) {
    throw new Error('Укажите ключ YOOKASSA_API_KEY');
  }

  const { data } = await axios.post<PaymentData>(
    'https://api.yookassa.ru/v3/payments',
    {
      amount: {
        value: details.amount,
        currency: 'RUB',
      },
      capture: true,
      description: details.description,
      metadata: {
        order_id: details.orderId,
      },
      confirmation: {
        type: 'redirect',
        return_url: 'http://localhost:3000/?paid',
      },
    },
    {
      auth: {
        username: process.env.YOOKASSA_API_KEY,
        password: '',
      },
      headers: {
        'Idempotence-Key': Math.random().toString(36).substring(7),
      },
    },
  );

  return data;
}
