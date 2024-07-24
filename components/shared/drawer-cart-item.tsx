import { cn } from '@/lib/utils';
import React from 'react';
import debounce from 'lodash.debounce';
import { CountButton } from './count-button';
import { CartItemDetailsImage } from './cart-item-details/cart-item-details-image';
import { CartItemInfo } from './cart-item-details/cart-item-info';
import { CartItemDetailsPrice } from './cart-item-details/cart-item-details-price';
import { CartItemProps } from './cart-item-details/cart-item-details.types';
import { ICartItem } from '@/store/cart';
import { Trash2Icon } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';

interface Props extends CartItemProps {
  id: number;
  ingredients?: ICartItem['ingredients'];
  pizzaSize?: number | null;
  type?: number | null;
}

export const DrawerCartItem: React.FC<Props> = ({
  id,
  imageUrl,
  name,
  price,
  ingredients,
  pizzaSize,
  type,
  quantity,
  className,
}) => {
  const { updateItemQuantity, removeCartItem } = useCart();

  const onClickCountButton = (type: 'plus' | 'minus') => {
    updateItemQuantity(id, type === 'plus' ? quantity + 1 : quantity - 1);
  };

  return (
    <div className={cn('flex bg-white p-5 gap-6', className)}>
      <CartItemDetailsImage src={imageUrl} />

      <div className="flex-1">
        <CartItemInfo name={name} ingredients={ingredients} pizzaSize={pizzaSize} type={type} />

        <hr className="my-3" />

        <div className="flex items-center justify-between">
          <CountButton onClick={onClickCountButton} value={quantity} />

          <div className="flex items-center gap-3">
            <CartItemDetailsPrice value={price} />
            <Trash2Icon
              onClick={() => removeCartItem(id)}
              className="text-gray-400 cursor-pointer hover:text-gray-600"
              size={16}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
