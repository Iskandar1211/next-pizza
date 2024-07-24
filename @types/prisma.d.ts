import type { Category, Product, ProductItem } from '@prisma/client';

type CategoryProducts = Category & {
  products: Array<Product & { items: ProductItem[] }>;
};
