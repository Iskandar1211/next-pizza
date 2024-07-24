import { Ingredient, ProductItem } from '@prisma/client';

type Item = {
  productItem: ProductItem;
  ingredients: Ingredient[];
  quantity: number;
};

export const calcCartItemTotalAmount = (item: Item): number => {
  return (
    (item.productItem.price +
      item.ingredients.reduce((acc, ingredient) => acc + ingredient.price, 0)) *
    item.quantity
  );
};
