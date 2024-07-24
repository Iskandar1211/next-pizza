import { calcCartItemTotalAmount } from '@/lib/calc-cart-item-total-amount';
import { getUserSession } from '@/lib/get-user-session';
import { prisma } from '@/lib/prisma';
import { CreateCartItemValues } from '@/services/dto/cart';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const cartToken = req.cookies.get('cartToken')?.value;
    const currentUser = await getUserSession();
    const userId = Number(currentUser?.id);

    if (!cartToken) {
      return NextResponse.json({ items: [] });
    }

    const userCart = await prisma.cart.findFirst({
      where: {
        OR: [
          {
            userId,
          },
          {
            tokenId: cartToken,
          },
        ],
      },
      include: {
        items: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            productItem: {
              include: {
                product: true,
              },
            },
            ingredients: true,
          },
        },
      },
    });

    return NextResponse.json(userCart);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: '[CART_GET] Server error' }, { status: 500 });
  }
}

async function findOrCreateCart(userId: number, cartToken: string | undefined) {
  let userCart = await prisma.cart.findFirst({
    where: {
      OR: [
        {
          userId,
        },
        {
          tokenId: cartToken,
        },
      ],
    },
  });

  if (!userCart) {
    userCart = await prisma.cart.create({
      data: {
        userId,
        tokenId: cartToken,
      },
    });
  }

  return userCart;
}

async function getCartTotalAmount(cartId: number): Promise<number> {
  const userCartAfterUpdate = await prisma.cart.findFirst({
    where: {
      id: cartId,
    },
    include: {
      items: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          productItem: {
            include: {
              product: true,
            },
          },
          ingredients: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalAmount = userCartAfterUpdate?.items.reduce(
    (acc, item) => acc + calcCartItemTotalAmount(item),
    0,
  );

  return totalAmount ?? 0;
}

async function updateCartTotalAmount(cartId: number, totalAmount: number) {
  const updatedCart = await prisma.cart.update({
    where: {
      id: cartId,
    },
    data: {
      totalAmount,
    },
    include: {
      items: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          productItem: {
            include: {
              product: true,
            },
          },
          ingredients: true,
        },
      },
    },
  });

  return updatedCart;
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getUserSession();
    const userId = Number(currentUser?.id);
    let cartToken = req.cookies.get('cartToken')?.value;

    const data = (await req.json()) as CreateCartItemValues;

    if (!cartToken) {
      cartToken = crypto.randomUUID();
    }

    let userCart = await findOrCreateCart(userId, cartToken);

    const findCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productItemId: data.productItemId,
        ingredients: { every: { id: { in: data.ingredientsIds } } },
      },
    });

    if (findCartItem) {
      const updatedCartItem = await prisma.cartItem.update({
        where: {
          id: findCartItem.id,
        },
        data: {
          quantity: findCartItem.quantity + data.quantity,
        },
      });

      const resp = NextResponse.json(updatedCartItem);
      resp.cookies.set('cartToken', cartToken);
      return resp;
    }

    await prisma.cartItem.create({
      data: {
        cartId: userCart.id,
        productItemId: data.productItemId,
        quantity: data.quantity,
        type: data.type,
        pizzaSize: data.pizzaSize,
        ingredients: { connect: data.ingredientsIds?.map((id) => ({ id })) },
      },
    });

    const totalAmount = await getCartTotalAmount(userCart.id);
    const updatedCart = await updateCartTotalAmount(userCart.id, totalAmount);

    const resp = NextResponse.json(updatedCart);
    resp.cookies.set('cartToken', cartToken);
    return resp;
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: '[CART_POST] Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cartToken = req.cookies.get('cartToken')?.value;
    const currentUser = await getUserSession();
    const userId = Number(currentUser?.id);

    if (!cartToken) {
      return NextResponse.json({ message: 'Cart token not found' }, { status: 400 });
    }

    const userCart = await prisma.cart.findFirst({
      where: {
        OR: [
          {
            userId,
          },
          {
            tokenId: cartToken,
          },
        ],
      },
    });

    if (!userCart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    const totalAmount = await getCartTotalAmount(userCart.id);
    const updatedCart = await updateCartTotalAmount(userCart.id, totalAmount);

    return NextResponse.json(updatedCart);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: '[CART_DELETE] Server error' }, { status: 500 });
  }
}
