import { prisma } from '@/lib/prisma';

export interface GetSearchParams {
  query?: string;
  sortBy?: string;
  sizes?: string;
  pizzaTypes?: string;
  ingredients?: string;
  priceFrom?: string;
  priceTo?: string;
  limit?: string;
  page?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

const DEFAULT_LIMIT = 12;
const DEFAULT_PAGE = 1;

export const findPizzas = async (params: GetSearchParams) => {
  const ingredientsIdArr = params.ingredients?.split(',').map(Number);
  const pizzaTypes = params.pizzaTypes?.split(',').map(Number);
  const sizes = params.sizes?.split(',').map(Number);

  const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE;
  const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE;

  const limit = Number(params.limit || DEFAULT_LIMIT);
  const page = Number(params.page || DEFAULT_PAGE);

  const result = await prisma.category
    .paginate({
      include: {
        products: {
          orderBy: {
            id: 'desc',
          },
          where: {
            ingredients: ingredientsIdArr
              ? {
                  some: {
                    id: {
                      in: ingredientsIdArr,
                    },
                  },
                }
              : undefined,
            items: {
              some: {
                size: {
                  in: sizes,
                },
                pizzaType: {
                  in: pizzaTypes,
                },
                price: {
                  gte: minPrice,
                  lte: maxPrice,
                },
              },
            },
          },
          include: {
            items: {
              where: {
                price: {
                  gte: minPrice,
                  lte: maxPrice,
                },
              },
              orderBy: {
                price: 'asc',
              },
            },
          },
        },
      },
    })
    .withPages({
      page,
      limit,
      includePageCount: true,
    });

  return result;
};
