import { cn } from '@/lib/utils';
import React from 'react';
import { WhiteBlock } from './white-block';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

interface Props {
  totalAmount: number;
  totalPrice: number;
  vatPrice: number;
  deliveryPrice: number;
  className?: string;
  submitting?: boolean;
}

export const CartSidebar: React.FC<Props> = ({
  totalAmount,
  totalPrice,
  vatPrice,
  deliveryPrice,
  className,
  submitting,
}) => {
  return (
    <WhiteBlock className={cn('p-6 sticky top-4', className)}>
      <div className="flex flex-col gap-1">
        <span className="text-xl">Итого:</span>
        <span className="text-4xl font-extrabold">{totalPrice} ₽</span>
      </div>

      <div className="flex my-4">
        <span className="flex flex-1 text-lg text-neutral-500">
          Стоимость товаров:
          <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
        </span>

        <span className="font-bold text-lg">{totalAmount} ₽</span>
      </div>

      <div className="flex my-4">
        <span className="flex flex-1 text-lg text-neutral-500">
          Налоги:
          <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
        </span>

        <span className="font-bold text-lg">{vatPrice} ₽</span>
      </div>

      <div className="flex my-4">
        <span className="flex flex-1 text-lg text-neutral-500">
          Доставка:
          <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
        </span>

        <span className="font-bold text-lg">{deliveryPrice} ₽</span>
      </div>

      <Button
        type="submit"
        disabled={!totalAmount || submitting}
        className="w-full h-14 rounded-2xl mt-6 text-base font-bold">
        Перейти к оплате
        <ArrowRight className="w-5 ml-2" />
      </Button>
    </WhiteBlock>
  );
};
