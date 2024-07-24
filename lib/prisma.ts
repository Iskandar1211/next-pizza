import { PrismaClient } from '@prisma/client';
import { pagination } from 'prisma-extension-pagination';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query'],
  }).$extends(pagination());
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
