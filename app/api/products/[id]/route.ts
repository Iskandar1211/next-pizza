import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const product = await prisma.product.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      ingredients: true,
      items: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          product: {
            include: {
              items: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(product);
}
