import React from 'react';
import toast from 'react-hot-toast';
import { useSet } from 'react-use';
import { Ingredient, Product, ProductItem } from '@prisma/client';

import {
  PizzaSize,
  PizzaSizeItem,
  PizzaType,
  pizzaDetailsToText,
  pizzaSizes,
} from '@/lib/pizza-details-to-text';
import { useCart } from './use-cart';

export type IProduct = Product & { items: ProductItem[]; ingredients: Ingredient[] };

export const useChoosePizza = (items?: IProduct['items']) => {
  const [selectedIngredientsIds, { toggle: toggleAddIngredient }] = useSet<number>(new Set([]));
  const { addCartItem, loading } = useCart();

  const [size, setSize] = React.useState<PizzaSize>(20);
  const [type, setType] = React.useState<PizzaType>(1);

  const activeSizes = items?.filter((item) => item.pizzaType === type).map((item) => item.size);
  const productItem = items?.find((item) => item.pizzaType === type && item.size === Number(size));

  const isActiveSize = (value: number | string) => {
    return activeSizes?.some((activeSize) => activeSize === Number(value));
  };

  const availablePizzaSizes = pizzaSizes.map<PizzaSizeItem>((obj) => ({
    name: obj.name,
    value: obj.value,
    disabled: !isActiveSize(obj.value),
  }));

  React.useEffect(() => {
    const availableSize = availablePizzaSizes?.find((item) => !item.disabled);

    if (availableSize) {
      setSize(Number(availableSize.value) as PizzaSize);
    }
  }, [type]);

  const addPizza = async () => {
    if (productItem) {
      try {
        await addCartItem({
          productItemId: productItem?.id,
          pizzaSize: size,
          type,
          ingredientsIds: Array.from(selectedIngredientsIds),
          quantity: 1,
        });
        toast.success('Товар добавлен в корзину');
      } catch (error) {
        console.error(error);
        toast.error('Произошла ошибка при добавлении в корзину');
      }
    }
  };

  const setPizzaSize = (value: number | string) => {
    setSize(Number(value) as PizzaSize);
  };

  const setPizzaType = (value: number | string) => {
    setType(Number(value) as PizzaType);
  };

  const isSelectedIngredient = (id: number) => {
    return selectedIngredientsIds.has(id);
  };

  const textDetaills = pizzaDetailsToText(size, type);

  return {
    availablePizzaSizes,
    setPizzaSize,
    setPizzaType,
    isActiveSize,
    textDetaills,
    isSelectedIngredient,
    loading,
    size,
    type,
    addPizza,
    selectedIngredientsIds,
    toggleAddIngredient,
  };
};
