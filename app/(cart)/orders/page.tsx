import { Container } from '@/components/shared/container';
import { OrderItem } from '@/components/shared/order-item';

import { Title } from '@/components/shared/title';
import { getUserSession } from '@/lib/get-user-session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
  const session = await getUserSession();

  if (!session) {
    return redirect('/not-auth');
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: Number(session?.id),
    },
  });

  return (
    <Container className="my-5">
      <Title text="Оформление заказа" size="xl" className="font-extrabold mb-8" />

      <div className="flex flex-col gap-10 flex-1 mb-20 w-[70%]">
        {orders.map((order) => (
          <OrderItem
            key={order.id}
            id={order.id}
            items={order.items ? JSON.parse(order.items as string) : []}
            createdAt={order.createdAt.toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            })}
            totalAmount={order.totalAmount}
            status={order.status}
          />
        ))}
      </div>
    </Container>
  );
}
