import { NextRequest } from 'next/server';
import { OrderStatus } from '@prisma/client';
import { sendEmail } from '@/lib/send-email';
import { prisma } from '@/lib/prisma';
import { CartItemDTO } from '@/services/dto/cart';

type PaymentCallbackData = {
  type: string;
  event: string;
  object: {
    id: string;
    status: string;
    amount: { value: string; currency: 'RUB' };
    income_amount: { value: string; currency: 'RUB' };
    description: string;
    recipient: { account_id: string; gateway_id: string };
    payment_method: {
      type: string;
      id: string;
      saved: boolean;
      title: string;
    };
    captured_at: string;
    created_at: string;
    test: boolean;
    refunded_amount: { value: string; currency: 'RUB' };
    paid: boolean;
    refundable: true;
    metadata: { order_id: string };
    authorization_details: {
      rrn: string;
      auth_code: string;
    };
  };
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as PaymentCallbackData;

  const order = await prisma.order.findFirst({
    where: {
      id: Number(body.object.metadata.order_id),
    },
    include: {
      user: true,
    },
  });

  if (order) {
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: OrderStatus.SUCCEEDED,
      },
    });

    const items = order?.items as unknown as CartItemDTO[];

    const html = `
    <h1>Спасибо за покупку!</h1>

    <p>Ваш заказ #${order?.id} оплачен. Список товаров:</p>
    
    <hr />

    <ul>
        ${items
          .map((item) => {
            return `<li>${item.productItem.product.name} | (${item.productItem.price}₽ x ${item.quantity} шт.)</li>`;
          })
          .join('')}
    </ul>
    `;

    await sendEmail(order.user.email, `Next Pizza / Заказ #${order?.id} оплачен!`, html);
  }

  return new Response(null, {
    status: 200,
  });
}
