'use client';

import React from 'react';
import { OrderCartItem } from '@/components/shared/order-cart-item';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { Title } from '@/components/shared/title';
import { OrderStatus } from './order-status';
import { CartItemDTO } from '@/services/dto/cart';
import { OrderStatus as IOrderStatus } from '@prisma/client';

interface Props {
  id: number;
  items: CartItemDTO[];
  exanded?: boolean;
  createdAt: string;
  totalAmount: number;
  status: IOrderStatus;
  className?: string;
}

const ITEM_HEIGHT = 98;
const FOOTER_HEIGHT = 68;

export const OrderItem: React.FC<Props> = ({
  id = 0,
  items,
  totalAmount = 0,
  createdAt,
  exanded = false,
  status,
  className,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(exanded);

  const TOTAL_HEIGHT = isExpanded ? items.length * ITEM_HEIGHT + FOOTER_HEIGHT : 0;

  return (
    <div className={cn('bg-white rounded-3xl select-none', className)}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex  cursor-pointer justify-between items-center p-7 border-b border-gray-100">
        <div className="flex items-center gap-6">
          <Title text={`Заказ #${id}`} size="md" className="font-extrabold" />
          <span className="text-gray-400">{createdAt}</span>
        </div>
        <div className="flex items-center gap-5">
          <OrderStatus variant={status} />
          <ChevronDown className={isExpanded ? 'rotate-180' : ''} />
        </div>
      </div>

      <div className={cn('transition-all overflow-hidden')} style={{ height: TOTAL_HEIGHT }}>
        <div>
          {items.map((item) => (
            <OrderCartItem
              key={item.id}
              imageUrl={item.productItem.product.imageUrl}
              name={item.productItem.product.name}
              count={item.quantity}
              price={item.productItem.price * item.quantity}
              className="border-b border-gray-100"
            />
          ))}

          <div className="p-5 px-7">
            <h3 className="text-xl">
              Итого: <b>{totalAmount} ₽</b>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
